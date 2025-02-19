import httpMocks from "node-mocks-http";
import {
    query,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore"; // mock firestore functions
import * as firebase_auth from "firebase/auth"; // mock auth functions

import Account from "../models/account.js";

import accountControllerMock from "../controllers/accountController";

jest.mock("firebase/app", () => {
    return {
        initializeApp: jest.fn(),
    };
});

jest.mock("firebase/auth", () => {
    return {
        getAuth: jest.fn().mockReturnValue({
            currentUser: {
                email: "test",
                uid: "123",
                emailVerified: true,
            },
        }),
        auth: jest.fn(),
        signInWithEmailAndPassword: jest.fn(),
        createUserWithEmailAndPassword: jest.fn(),
        updateEmail: jest.fn(),
        updatePassword: jest.fn(),
        deleteUser: jest.fn(),
        signOut: jest.fn(),
    };
});

jest.mock("firebase/firestore", () => {
    return {
        getFirestore: jest.fn(),
        collection: jest.fn(),
        doc: jest.fn(),
        query: jest.fn(),
        getDocs: jest.fn(),
        getDoc: jest.fn(),
        setDoc: jest.fn(),
        updateDoc: jest.fn(),
        deleteDoc: jest.fn(),
        where: jest.fn(),
    };
});

jest.mock("firebase/storage", () => {
    return {
        getStorage: jest.fn(),
    };
});

describe("Get Account Function", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should throw 400 error if Firebase Firestore is not retrieved", async () => {
        const errorSpy = jest.spyOn(global.console, "error");
        req.params = { accountId: "1234" };

        await accountControllerMock.getAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error: Cannot read properties of undefined (reading 'exists')"
        );
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("No user exists in the database.");

        errorSpy.mockRestore();
    });

    it("should throw 400 error if account does not exists", async () => {
        req.params = { accountId: "nonExistingAccountId" };
        const errorSpy = jest.spyOn(global.console, "error");

        // Mock the behavior of getDoc for a valid account ID
        doc.mockReturnValueOnce({});
        getDoc.mockResolvedValueOnce({
            exists: () => false,
        });

        await accountControllerMock.getAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith("Error: Retrieval failed.");
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("No user exists in the database.");
    });

    it("should return 200 and the user account when the accountId is valid", async () => {
        req.params = { accountId: "1234" };
        // Mock user data
        const mockUserData = {
            email: "testuser@example.com",
            name: "Test User",
            state: "VIC",
        };

        // Mock the behavior of getDoc for a valid account ID
        doc.mockReturnValueOnce({});
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockUserData,
        });

        await accountControllerMock.getAccount(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBeInstanceOf(Account);
        expect(res._getData()).toEqual({
            email: "testuser@example.com",
            id: "1234",
            name: "Test User",
            state: "VIC",
        });
    });
});

describe("Get Current Account Function", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should throw 400 error if null current user", async () => {
        const originalCurrentUser = firebase_auth.getAuth().currentUser;

        firebase_auth.getAuth().currentUser = null;

        const errorSpy = jest.spyOn(global.console, "error");

        await accountControllerMock.getCurrentAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith("Error: Null user.");
        expect(res.statusCode).toBe(400);
        jest.spyOn(global.console, "error");
        expect(res._getData()).toBe("No user logged in.");

        jest.restoreAllMocks();

        firebase_auth.getAuth().currentUser = originalCurrentUser;
    });

    it("should throw 400 error if Firebase Firestore is not retrieved", async () => {
        const errorSpy = jest.spyOn(global.console, "error");

        await accountControllerMock.getCurrentAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error: Cannot read properties of undefined (reading 'exists')"
        );
        expect(res.statusCode).toBe(400);
        jest.spyOn(global.console, "error");
        expect(res._getData()).toBe("No user logged in.");
    });

    it("should throw 400 error if failed retrieval from the authentication", async () => {
        const errorSpy = jest.spyOn(global.console, "error");

        // Mock the behavior of getDoc for a valid account ID
        doc.mockReturnValueOnce({});
        getDoc.mockResolvedValueOnce({
            exists: () => false,
        });

        await accountControllerMock.getCurrentAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith("Error: Retrieval failed.");
        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("No user logged in.");
    });

    it("should return 200 and the current account logged in", async () => {
        const errorSpy = jest.spyOn(global.console, "error");

        // Mock user data
        const mockUserData = {
            email: "testuser@example.com",
            name: "Test User",
            state: "VIC",
        };

        // Mock the behavior of getDoc for a valid account ID
        doc.mockReturnValueOnce({});
        getDoc.mockResolvedValueOnce({
            exists: () => true,
            data: () => mockUserData,
        });

        await accountControllerMock.getCurrentAccount(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBeInstanceOf(Account);
        expect(res._getData()).toEqual({
            email: "testuser@example.com",
            id: "123",
            name: "Test User",
            state: "VIC",
        });
    });
});

describe("Login Function", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 400 if email or password is empty", async () => {
        req.body = { email: "", password: "" };

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Empty email or password field");
    });

    test("should return 400 for invalid email format", async () => {
        req.body = { email: "invalidemail", password: "validPassword123" };

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Invalid email format");
    });

    test("should return 400 if user not found", async () => {
        req.body = { email: "user@example.com", password: "validPassword123" };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({ empty: true });

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("No existing user");
    });

    test("should return 400 if user not verified", async () => {
        req.body = { email: "user@example.com", password: "validPassword123" };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({ empty: false });

        // OTP query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            docs: [{ data: () => ({ isVerified: false }) }],
        });

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("User not verified");
    });

    test("should return 200 for successful login", async () => {
        req.body = { email: "user@example.com", password: "validPassword123" };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({ empty: false });

        // OTP query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            docs: [{ data: () => ({ isVerified: true }) }],
        });

        firebase_auth.signInWithEmailAndPassword.mockResolvedValueOnce({});

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe("Successful login");
    });

    test("should return 400 on error during login", async () => {
        req.body = { email: "user@example.com", password: "validPassword123" };

        query.mockReturnValueOnce({});
        getDocs.mockRejectedValueOnce(new Error("Database error"));

        await accountControllerMock.login(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Incorrect email or password");
    });
});

describe("Signup Function", () => {
    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should return 400 if required fields are empty", async () => {
        req.body = { form: { name: "", email: "", password: "" } };

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Empty field(s)");
    });

    test("should return 400 for invalid email format", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "invalidemail",
                password: "password",
            },
        };

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Invalid email format");
    });

    test("should return 200 if new user is added successfully", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({ empty: true });
        firebase_auth.createUserWithEmailAndPassword.mockResolvedValueOnce({});
        setDoc.mockResolvedValueOnce({});

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe("New user added");
    });

    test("should return 400 if user exists and is already verified", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: true }) }],
        });

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Existing account");
    });

    test("should return 200 if user exists but OTP has not been sent", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: false }) }],
        });

        // OTP query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: true,
        });

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe("User not verified");
    });

    test("should return 400 if user exists, OTP has been sent, and is already verified", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: true }) }],
        });

        // OTP query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: true }) }],
        });

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Existing account");
    });

    test("should return 200 if user exists and OTP has been sent but is not yet verified", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        // User query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
        });

        // OTP query and docs call
        query.mockReturnValueOnce({});
        getDocs.mockResolvedValueOnce({
            empty: false,
            docs: [{ data: () => ({ isVerified: false }) }],
        });

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe("User not verified");
    });

    test("should return 400 on error during signup", async () => {
        req.body = {
            form: {
                name: "John Doe",
                email: "user@example.com",
                password: "password",
                state: "VIC",
            },
        };

        query.mockReturnValueOnce({});
        getDocs.mockRejectedValueOnce(new Error("Database error"));

        await accountControllerMock.signup(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getData()).toBe("Existing account");
    });
});

describe("Edit Account Function", () => {
    const req = {
        body: {},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update the account successfully when account exists", async () => {
        req.body = { email: "newemail@example.com", name: "New Name" };

        // Mock user data
        const mockUserData = {
            email: "newemail@example.com",
            name: "New Name",
            state: "VIC",
        };

        // Mocking Firestore responses
        getDoc.mockResolvedValueOnce({ exists: jest.fn(() => true), data: () => mockUserData });
        firebase_auth.updateEmail.mockResolvedValueOnce();

        // Updating document
        updateDoc.mockResolvedValueOnce({});

        // Get the updated document
        getDoc.mockResolvedValueOnce({
            exists: jest.fn(() => true),
            data: () => mockUserData,
        });

        await accountControllerMock.editAccount(req, res);

        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );

        expect(updateDoc).toHaveBeenCalledTimes(1);
        expect(updateDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            ),
            {
                id: "123",
                email: "newemail@example.com",
                name: "New Name",
                state: "VIC",
            }
        );

        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            email: "newemail@example.com",
            id: "123",
            name: "New Name",
            state: "VIC",
        });
    });

    it("should update the account successfully when account exists but db didn't save user", async () => {
        req.body = { state: "NSW" };

        // Mock user data
        const mockUserData = {
            email: "newemail@example.com",
            name: "New Name",
            state: "VIC",
        };

        // Mocking Firestore responses
        getDoc.mockResolvedValueOnce({ exists: jest.fn(() => true),
            data: () => mockUserData });
        firebase_auth.updateEmail.mockResolvedValueOnce();
        

        // Updating document
        updateDoc.mockResolvedValueOnce({});

        // No document saved from user
        getDoc.mockResolvedValueOnce({
            exists: jest.fn(() => false),
        });

        await accountControllerMock.editAccount(req, res);

        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );
        expect(firebase_auth.updateEmail).not.toHaveBeenCalledWith(
            firebase_auth.getAuth().currentUser,
            "newemail@example.com"
        );
        expect(updateDoc).toHaveBeenCalledTimes(1);
        expect(updateDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            ),
            {
                id: "123",
                email: "newemail@example.com",
                name: "New Name",
                state: "NSW",
            }
        );
        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error editing account.");
    });

    it("should return 404 if account does not exist", async () => {
        getDoc.mockResolvedValueOnce({ exists: jest.fn(() => false) });

        await accountControllerMock.editAccount(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Account does not exist.");
    });

    it("should handle error during account update", async () => {
        const errorSpy = jest.spyOn(global.console, "error");
        getDoc.mockRejectedValueOnce(new Error("Firestore error"));

        await accountControllerMock.editAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error editing account: Firestore error"
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error editing account.");
    });
});

describe("Delete Account Function", () => {
    const req = {
        body: {},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the account successfully when account exists", async () => {
        // Mocking Firestore responses

        console.log("200 test")

        getDoc.mockResolvedValueOnce({ exists: jest.fn(() => true) });
        firebase_auth.deleteUser.mockResolvedValueOnce();
        deleteDoc.mockResolvedValueOnce();

        await accountControllerMock.deleteAccount(req, res);

        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );

        expect(firebase_auth.deleteUser).toHaveBeenCalledWith(
            firebase_auth.getAuth().currentUser
        );
        expect(deleteDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Account deleted successfully.");
    });

    it("should return 404 if account does not exist", async () => {
        getDoc.mockResolvedValueOnce({
            exists: () => false,
        });

        console.log("404 test")

        await accountControllerMock.deleteAccount(req, res);

        expect(getDoc).toHaveBeenCalledWith(
            doc(
                "firebase/firestore",
                "users",
                firebase_auth.getAuth().currentUser.uid
            )
        );

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith("Account does not exist.");
    });

    it("should handle error during account deletion", async () => {

        console.log("500 test")

        const errorSpy = jest.spyOn(global.console, "error");
        getDoc.mockRejectedValueOnce(new Error("Firestore error"));

        await accountControllerMock.deleteAccount(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error deleting account: Firestore error"
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error deleting account.");
    });
});

describe("changePassword", () => {
    const req = {
        body: {},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const data = {
        email: "test",
        uid: "123",
        emailVerified: true,
    };

    beforeEach(() => {
        firebase_auth.getAuth().currentUser = data;
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should change the password successfully when user is authenticated", async () => {
        req.body = { newPassword: "newSecurePassword" };
        firebase_auth.updatePassword.mockResolvedValueOnce();

        await accountControllerMock.changePassword(req, res);

        expect(firebase_auth.updatePassword).toHaveBeenCalledWith(
            firebase_auth.getAuth().currentUser,
            "newSecurePassword"
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("Password updated successfully.");
    });

    it("should return 401 if user is not authenticated", async () => {
        firebase_auth.getAuth().currentUser = null; // Simulate no authenticated user

        await accountControllerMock.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("User is not authenticated.");
    });

    it("should return 400 if new password is not provided", async () => {
        req.body = {}; // No new password

        await accountControllerMock.changePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith("New password is required.");
    });

    it("should handle error during password change", async () => {
        const errorSpy = jest.spyOn(global.console, "error");
        req.body = { newPassword: "newSecurePassword" };
        firebase_auth.updatePassword.mockRejectedValueOnce(
            new Error("Password change failed.")
        );

        await accountControllerMock.changePassword(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error changing password: Password change failed."
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error changing password.");
    });
});

describe("logout", () => {
    const req = {
        body: {},
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const data = {
        email: "test",
        uid: "123",
        emailVerified: true,
    };

    beforeEach(() => {
        firebase_auth.getAuth().currentUser = data;
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should log out the user successfully", async () => {
        firebase_auth.signOut.mockResolvedValueOnce();

        await accountControllerMock.logout(req, res);

        expect(firebase_auth.signOut).toHaveBeenCalledWith(
            firebase_auth.getAuth()
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith("User logged out successfully.");
    });

    it("should return 401 if no user is authenticated", async () => {
        firebase_auth.getAuth().currentUser = null; // Simulate no authenticated user

        await accountControllerMock.logout(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith("User is not authenticated.");
    });

    it("should handle error during logout", async () => {
        const errorSpy = jest.spyOn(global.console, "error");
        firebase_auth.signOut.mockRejectedValueOnce(
            new Error("Logout failed.")
        );

        await accountControllerMock.logout(req, res);

        expect(errorSpy).toHaveBeenCalled();
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            "Error logging out: Logout failed."
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith("Error logging out.");
    });
});
