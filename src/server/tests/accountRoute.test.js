import request from "supertest";
import app from "../index";
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Mock Firestore functions
import { getAuth, updatePassword, signOut } from "firebase/auth"; // Mock Firebase Auth functions

// Mock Firestore's doc and getDoc methods
jest.mock("firebase/auth", () => {
    return {
        getAuth: jest.fn(() => {
            return {
                currentUser: {
                    email: "test",
                    uid: "123",
                    emailVerified: true,
                },
            };
        }),
        updatePassword: jest.fn(),
        signOut: jest.fn(),
    };
});

jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
}));

const req = request(app);

describe("Get Account", () => {
    it("should throw 400 error if accountId is invalid account ID", async () => {
        await req
            .get("/api/account/0")
            .expect(400)
            .expect("No user exists in the database.");
    });

    it("should throw 400 error if account does not exists", async () => {
        getDoc.mockResolvedValueOnce({ exists: () => false });

        await req
            .get("/api/account/0")
            .expect(400)
            .expect("No user exists in the database.");
    });

    it("should return 200 and the user account when the accountId is valid", async () => {
        // Mock user data
        const mockUserData = {
            email: "testuser@example.com",
            name: "Test User",
            state: "VIC",
        };

        // Mock the behavior of getDoc for a valid account ID
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockUserData,
        });

        // Perform the request with a valid account ID
        await request(app)
            .get("/api/account/validAccountId") // Replace 'validAccountId' with any string
            .expect(200) // Expect HTTP 200 status
            .expect((res) => {
                expect(res.body).toEqual({
                    email: "testuser@example.com",
                    name: "Test User",
                    id: "validAccountId",
                    state: "VIC",
                });
            });
    });
});

describe("Get Current Account", () => {
    it("should throw 400 error if no current account logged in", async () => {
        await req.get("/api/account/").expect(400).expect("No user logged in.");
    });

    it("should throw 400 error if account does not exists", async () => {
        getDoc.mockResolvedValueOnce({ exists: () => false });

        await req.get("/api/account/").expect(400).expect("No user logged in.");
    });

    it("should return 200 and current account is returned", async () => {
        // Mock user data
        const mockUserData = {
            email: "testuser@example.com",
            name: "Test User",
            state: "VIC",
        };

        // Mock the behavior of getDoc for a valid account ID
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockUserData,
        });

        // Perform the request with a valid account ID
        await request(app)
            .get("/api/account/") // Replace 'validAccountId' with any string
            .expect(200) // Expect HTTP 200 status
            .expect((res) => {
                expect(res.body).toEqual({
                    email: "testuser@example.com",
                    id: "123",
                    name: "Test User",
                    state: "VIC",
                });
            });
    });
});

describe("Change Password", () => {
    it("should return 200 when the password is successfully changed", async () => {
        // Mock updatePassword to resolve successfully
        updatePassword.mockResolvedValueOnce();

        // Send the change password request
        await request(app)
            .post("/api/account/changePassword")
            .send({ newPassword: "newTestPassword123" })
            .expect(200)
            .expect("Password updated successfully.");
    });

    it("should return 500 if there is an error changing password", async () => {
        // Mock updatePassword to throw an error
        updatePassword.mockRejectedValueOnce(
            new Error("Failed to update password")
        );

        await request(app)
            .post("/api/account/changePassword")
            .send({ newPassword: "newTestPassword123" })
            .expect(500)
            .expect("Error changing password.");
    });
});

describe("Log Out", () => {
    it("should return 200 when the user logs out successfully", async () => {
        // Mock signOut to resolve successfully
        signOut.mockResolvedValueOnce();

        await request(app)
            .post("/api/account/logout")
            .expect(200)
            .expect("User logged out successfully.");
    });

    it("should return 500 if there is an error logging out", async () => {
        // Mock signOut to throw an error
        signOut.mockRejectedValueOnce(new Error("Logout failed"));

        await request(app)
            .post("/api/account/logout")
            .expect(500)
            .expect("Error logging out.");
    });
});
