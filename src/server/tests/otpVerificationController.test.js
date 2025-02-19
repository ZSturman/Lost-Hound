import otpVerificationControllerMock from "../controllers/otpVerificationController.js";
import nodemailer from "nodemailer";
import { query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
import speakeasy from "speakeasy";

jest.mock("nodemailer");
jest.mock("firebase/firestore");
jest.mock("speakeasy");

describe("Send Email Function", () => {
    let mockSendMail;
    let mockOtpRefs;

    beforeEach(() => {
        // Mock nodemailer transporter
        mockSendMail = jest.fn();
        nodemailer.createTransport.mockReturnValue({
            sendMail: mockSendMail,
            verify: jest.fn().mockResolvedValue(true),
        });

        // Mock Firestore methods
        mockOtpRefs = {
            doc: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should send an email with an OTP successfully", async () => {
        const req = { body: { userEmail: "test@example.com" } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        speakeasy.generateSecret.mockReturnValue({ base32: "secret123" });
        speakeasy.totp.mockReturnValue("123456");

        // OTP query and docs call
        query.mockReturnValueOnce({});
        updateDoc.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: false }) }],
        });

        await otpVerificationControllerMock.sendEmail(req, res);

        expect(nodemailer.createTransport).toHaveBeenCalledWith({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.GOOGLE_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            },
        });

        expect(mockSendMail).toHaveBeenCalledWith({
            from: {
                name: "Lost and Hound",
                address: process.env.GOOGLE_EMAIL,
            },
            to: "test@example.com",
            subject: "OTP for Email Verification",
            html: expect.stringContaining("123456"),
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            "Email with OTP sent sucessfully"
        );
    });

    test("should handle error when email sending fails", async () => {
        const req = { body: { userEmail: "test@example.com" } };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        // OTP query and docs call
        query.mockReturnValueOnce({});
        addDoc.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: true,
            docs: [{ data: () => ({ isVerified: false }) }],
        });

        mockSendMail.mockImplementation(() => {
            throw new Error("Email sending failed");
        });

        await otpVerificationControllerMock.sendEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Email sending failed");
    });
});

describe("Check Input Type Function", () => {
    it("should throw an error if userEmail is not a string", () => {
        const invalidEmail = 12345; // Invalid email type
        const validSecret = "some-secret";
        const validExpiryTime = 3600;

        expect(() => {
            otpVerificationControllerMock.checkInputType(
                invalidEmail,
                validSecret,
                validExpiryTime
            );
        }).toThrow("Invalid email");
    });

    it("should throw an error if secret is not a string", () => {
        const validEmail = "user@example.com";
        const invalidSecret = 12345; // Invalid secret type
        const validExpiryTime = 3600;

        expect(() => {
            otpVerificationControllerMock.checkInputType(
                validEmail,
                invalidSecret,
                validExpiryTime
            );
        }).toThrow("Invalid secret");
    });

    it("should throw an error if expiryTime is not a number", () => {
        const validEmail = "user@example.com";
        const validSecret = "some-secret";
        const invalidExpiryTime = "not-a-number"; // Invalid expiry time type

        expect(() => {
            otpVerificationControllerMock.checkInputType(
                validEmail,
                validSecret,
                invalidExpiryTime
            );
        }).toThrow("Invalid expiry time");
    });

    it("should not throw an error if all inputs are valid", () => {
        const validEmail = "user@example.com";
        const validSecret = "some-secret";
        const validExpiryTime = 3600;

        expect(() => {
            otpVerificationControllerMock.checkInputType(
                validEmail,
                validSecret,
                validExpiryTime
            );
        }).not.toThrow();
    });
});

describe("Verify OTP Function", () => {
    let mockSendMail;
    let mockOtpRefs;

    beforeEach(() => {
        // Mock nodemailer transporter
        mockSendMail = jest.fn();
        nodemailer.createTransport.mockReturnValue({
            sendMail: mockSendMail,
            verify: jest.fn().mockResolvedValue(true),
        });

        // Mock Firestore methods
        mockOtpRefs = {
            doc: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should verify OTP and update isVerified to true", async () => {
        const req = {
            body: { enteredOTP: "123456", userEmail: "test@example.com" },
        };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        const mockDocData = {
            secret: "secret123",
            expiryTime: Date.now() + 10000,
            isVerified: false,
        };

        getDocs.mockResolvedValue({
            empty: false,
            docs: [
                {
                    data: () => mockDocData,
                    ref: {},
                },
            ],
        });

        speakeasy.totp.verify.mockReturnValue(true);

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(speakeasy.totp.verify).toHaveBeenCalledWith({
            secret: "secret123",
            encoding: "base32",
            token: "123456",
            window: 6,
        });

        expect(updateDoc).toHaveBeenCalledWith({}, { isVerified: true });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("OTP Verified");
    });

    test("should return 400 if OTP has expired", async () => {
        const req = {
            body: { enteredOTP: "123456", userEmail: "test@example.com" },
        };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        const mockDocData = {
            secret: "secret123",
            expiryTime: Date.now() - 10000, // Expired OTP
            isVerified: false,
        };

        getDocs.mockResolvedValue({
            empty: false,
            docs: [
                {
                    data: () => mockDocData,
                    ref: {},
                },
            ],
        });

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("OTP Expired");
    });

    test("should return 404 if no OTP exists for user", async () => {
        const req = {
            body: { enteredOTP: "123456", userEmail: "test@example.com" },
        };
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        getDocs.mockResolvedValue({ empty: true });

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("No Existing OTP");
    });

    it("should return 400 if OTP was previously verified", async () => {
        const req = {
            body: {
                enteredOTP: "123456",
                userEmail: "user@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const logSpy = jest.spyOn(global.console, "log");
        // Mocking Firestore to return a verified OTP document
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [
                {
                    data: () => ({
                        isVerified: true,
                        expiryTime: Date.now() + 10000,
                        secret: "secret_base32",
                    }),
                    ref: {},
                },
            ],
        });

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("OTP Previously Verified");
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith("OTP has previously been verified");
    });

    it("should return 400 if OTP does not match", async () => {
        const req = {
            body: {
                enteredOTP: "123456",
                userEmail: "user@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const logSpy = jest.spyOn(global.console, "log");
        // Mocking Firestore to return a non-verified OTP document
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [
                {
                    data: () => ({
                        isVerified: false,
                        expiryTime: Date.now() + 10000,
                        secret: "secret_base32",
                    }),
                    ref: {},
                },
            ],
        });

        // Mocking speakeasy to return false, indicating the OTP is incorrect
        speakeasy.totp.verify.mockReturnValueOnce(false);

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("OTP Incorrect");
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith(
            "OTP does not match (is incorrect)"
        );
    });

    it("should return 400 and log error on catch", async () => {
        const req = {
            body: {
                enteredOTP: "123456",
                userEmail: "user@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const logSpy = jest.spyOn(global.console, "log");
        // Mocking Firestore to throw an error
        getDocs.mockRejectedValueOnce(new Error("Firestore error"));

        await otpVerificationControllerMock.verifyOTP(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("Verification Error");
        expect(logSpy).toHaveBeenCalled();
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith("Firestore error");
    });
});
