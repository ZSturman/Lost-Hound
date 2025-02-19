import {
    FIREBASE_DB,
    FIREBASE_APP,
    FIREBASE_AUTH,
} from "../config/firebase.js";

import {
    getFirestore,
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    where,
} from "firebase/firestore";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    updateEmail,
    deleteUser,
    updatePassword,
    signOut,
} from "firebase/auth";
import Account from "../models/account.js";

const auth = FIREBASE_AUTH;
const db = FIREBASE_DB;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression to validate email format
const userRef = collection(db, "users");
const otpRef = collection(db, "otps");

/**
 * Fetches the account details of a specific user by their ID.
 *
 * @param {String} id - The unique identifier (ID) of the user.
 * @returns {Account} - The user's account details if found.
 */
const getAccount = async (req, res) => {
    try {
        const id = req.params.accountId; // Extract user ID from the request parameters
        const requestedUserRef = doc(db, "users", id); // Get the user document reference
        const requestedUserSnap = await getDoc(requestedUserRef); // Retrieve the document snapshot

        // If the user exists, return their account details
        if (requestedUserSnap.exists()) {
            const requestedUser = requestedUserSnap.data();
            let account = new Account(
                id,
                requestedUser.email,
                requestedUser.name,
                requestedUser.state
            );
            res.status(200).send(account); // Send the account details as a response
            return;
        } else {
            throw new Error("Retrieval failed."); // If no user exists, throw an error
        }
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(400).send("No user exists in the database."); // Handle error if no user is found
        return;
    }
};

/**
 * Fetches the account details of the currently logged-in user.
 *
 * @returns {Account} - The current user's account details if logged in.
 */
const getCurrentAccount = async (req, res) => {
    try {
        const user = auth.currentUser; // Get the current user from Firebase Auth
        if (user !== null) {
            const currentUserDoc = doc(db, "users", user.uid); // Get the current user document reference
            const currentUserSnap = await getDoc(currentUserDoc); // Retrieve the document snapshot

            // If the current user exists, return their account details
            if (currentUserSnap.exists()) {
                const currentUser = currentUserSnap.data();
                let account = new Account(
                    user.uid,
                    currentUser.email,
                    currentUser.name,
                    currentUser.state
                );
                res.status(200).send(account); // Send the account details as a response
                return;
            } else {
                throw new Error("Retrieval failed."); // Handle error if no user is found
            }
        } else {
            throw new Error("Null user."); // Handle case where no user is logged in
        }
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(400).send("No user logged in."); // Handle error if the user is not logged in
        return;
    }
};

/**
 * Logs in a user by verifying their email and password.
 *
 * - Checks if the user exists in the database.
 * - Ensures that the user has verified their account via OTP.
 *
 * @param {String} email - The user's email address.
 * @param {String} password - The user's password.
 * @returns {String} - A success or error message indicating login status.
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password fields
    if (email === "" || password === "") {
        console.log("Empty email or password field");
        res.status(400).send("Empty email or password field");
        return;
    } else if (!emailRegex.test(email)) {
        console.log("Invalid email format");
        res.status(400).send("Invalid email format");
        return;
    }

    try {
        const qUser = query(userRef, where("email", "==", email)); // Query to check if the user exists in the database
        const querySnapshotUser = await getDocs(qUser);

        // If the user does not exist, prompt them to sign up
        if (querySnapshotUser.empty) {
            console.log("User not in database, prompt to sign up instead");
            res.status(400).send("No existing user");
            return;
        } else {
            const qOtp = query(otpRef, where("userEmail", "==", email)); // Query to check if the user has verified their OTP
            const querySnapshotOtp = await getDocs(qOtp);

            const docData = querySnapshotOtp.docs[0].data();
            console.log("Checking if user has been verified");

            // If the user has verified their OTP, allow them to log in
            if (docData.isVerified) {
                console.log("User has been verified, allow to log in");
                const userCredentials = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                );
                // console.log(userCredentials);
                // localStorage.setItem("uid", userCredentials.uid)
                // localStorage.setItem("accessToken", userCredentials.accessToken)
                res.status(200).send("Successful login");
                return;
            } else {
                console.log("User has not verified account");
                res.status(400).send("User not verified");
                return;
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).send("Incorrect email or password");
        return;
    }
};

/**
 * Registers a new user and stores their account details in the database.
 *
 * - Ensures that all required fields are filled.
 * - Validates the email format.
 * - Adds the user to the Firebase Authentication system.
 *
 * @param {Object} form - The registration form containing name, email, password, and state.
 * @returns {String} - A success or error message indicating signup status.
 */
const signup = async (req, res) => {
    const { form } = req.body;
    const { name, email, password, state } = form;

    // Validate required fields
    if (name === "" || email === "" || password === "") {
        console.log("Empty field(s)");
        res.status(400).send("Empty field(s)");
        return;
    } else if (!emailRegex.test(email)) {
        console.log("Invalid email format");
        res.status(400).send("Invalid email format");
        return;
    }

    try {
        const qUser = query(userRef, where("email", "==", email)); // Query to check if the user already exists in the database
        const querySnapshotUser = await getDocs(qUser);

        // If the user doesn't exist, add them to Firebase Auth and Firestore
        if (querySnapshotUser.empty) {
            console.log("User doesn't exist, add user to db");
            await createUserWithEmailAndPassword(auth, email, password).then(
                () =>
                    setDoc(doc(userRef, auth.currentUser.uid), {
                        name: name,
                        email: email,
                        state: state,
                    })
            );
            res.status(200).send("New user added");
            return;
        } else {
            console.log("User exists, checking OTP verification status.");

            const qOtp = query(otpRef, where("userEmail", "==", email)); // Query to check OTP status
            const querySnapshotOtp = await getDocs(qOtp);

            // If OTP data is not found, prompt the user to verify their account
            if (querySnapshotOtp.empty) {
                console.log("User has not verified account.");
                res.status(200).send("User not verified");
                return;
            }

            const docData = querySnapshotOtp.docs[0].data();
            console.log("Checking if user has been verified");

            // If the user has verified their OTP, prompt them to log in instead
            if (docData.isVerified) {
                console.log("User has been verified, prompt to log in");
                res.status(400).send("Existing account");
                return;
            } else {
                console.log("User has not verified account.");
                res.status(200).send("User not verified");
                return;
            }
        }
    } catch (error) {
        console.log(error);
        if (error.code === "auth/weak-password") {
            res.status(400).send("Weak password")
            return;
        } else {
            res.status(400).send("Existing account");
            return;
        }
    }
};

/**
 * Edits the account details of the currently authenticated user.
 *
 * - Retrieves the current user's account from Firestore using their UID.
 * - Updates the user's email if provided and syncs it with Firebase Authentication.
 * - Updates other account details (e.g., name, state) in Firestore.
 *
 * @param {Object} req - The HTTP request object containing the account data to update.
 * @param {Object} res - The HTTP response object to send back the status and message.
 * @returns {Account} - Updated user's account details and a success or error response based on the outcome.
 */
const editAccount = async (req, res) => {
    try {
        const user = auth.currentUser; // Get the current user from Firebase Auth
        const reqAccountData = req.body;

        // Fetch the account document from Firestore using auth's current user id
        const accountRef = doc(db, "users", user.uid);
        const accountSnap = await getDoc(accountRef);

        if (!accountSnap.exists()) {
            return res.status(404).send("Account does not exist.");
        }

        let updatedAccountData = accountSnap.data();
        let updatedAccount = new Account(
            user.uid,
            updatedAccountData.email,
            updatedAccountData.name,
            updatedAccountData.state
        );

        if (reqAccountData.name === '') {
            res.status(200).send(updatedAccount)
            return;
        }

        if ("name" in reqAccountData) {
            updatedAccount.name = reqAccountData.name;
            await updateDoc(accountRef, {...updatedAccount});
        }

        if ("state" in reqAccountData) {
            updatedAccount.state = reqAccountData.state;
            await updateDoc(accountRef, {...updatedAccount});
        }

        const updatedUserDoc = doc(db, "users", user.uid); // Get the current user document reference
        const updatedUserSnap = await getDoc(updatedUserDoc); // Retrieve the document snapshot

        // If the current user exists, return their account details
        if (updatedUserSnap.exists()) {
            const updatedUser = updatedUserSnap.data();
            let account = new Account(
                user.uid,
                updatedUser.email,
                updatedUser.name,
                updatedUser.state
            );
            res.status(200).send(account); // Send the account details as a response
            return;
        } else {
            throw new Error("Update failed."); // Handle error if no user is found
        }
    } catch (error) {
        console.error("Error editing account: " + error.message);
        return res.status(500).send("Error editing account.");
    }
};

/**
 * Deletes the account of the currently authenticated user.
 *
 * - Retrieves the user's account from Firestore using their UID.
 * - Deletes the user from Firebase Authentication.
 * - Removes the user's account data from Firestore.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object to send back the status and message.
 * @returns {void} - Sends a success or error response based on the outcome.
 */
const deleteAccount = async (req, res) => {
    try {
        const user = auth.currentUser; // Get the current user from Firebase Auth

        // Fetch the account document from Firestore
        const accountRef = doc(db, "users", user.uid);
        const accountSnap = await getDoc(accountRef);

        if (!accountSnap.exists()) {
            return res.status(404).send("Account does not exist.");
        }

        // Delete account document
        await deleteUser(user).then(() => {
            // User deleted.
            deleteDoc(accountRef);
        });

        return res.status(200).send("Account deleted successfully.");
    } catch (error) {
        console.error("Error deleting account: " + error.message);
        return res.status(500).send("Error deleting account.");
    }
};

/**
 * Changes the password of the currently authenticated user.
 *
 * - Retrieves the current user from Firebase Authentication.
 * - Updates the user's password with the provided new password.
 *
 * @param {Object} req - The HTTP request object containing the new password in the body.
 * @param {Object} res - The HTTP response object to send back the status and message.
 * @returns {void} - Sends a success or error response based on the outcome.
 */
const changePassword = async (req, res) => {
    try {
        const user = auth.currentUser; // Get the current authenticated user from Firebase Auth
        const { newPassword } = req.body; // Extract the new password from the request body

        if (!user) {
            return res.status(401).send("User is not authenticated."); // Return error if no user is authenticated
        }

        if (!newPassword) {
            return res.status(400).send("New password is required."); // Return error if no new password is provided
        }

        // Update the user's password in Firebase Auth
        await updatePassword(user, newPassword);

        return res.status(200).send("Password updated successfully."); // Send success response
    } catch (error) {
        console.error("Error changing password: " + error.message); // Log error details
        return res.status(500).send("Error changing password."); // Send error response
    }
};

/**
 * Logs out the currently authenticated user.
 *
 * - Signs out the user from Firebase Authentication.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object to send back the status and message.
 * @returns {void} - Sends a success or error response based on the outcome.
 */
const logout = async (req, res) => {
    try {
        const user = auth.currentUser; // Get the current authenticated user from Firebase Auth

        if (!user) {
            return res.status(401).send("User is not authenticated."); // Return error if no user is authenticated
        }

        // Sign out the user from Firebase Auth
        await signOut(auth);

        return res.status(200).send("User logged out successfully."); // Send success response
    } catch (error) {
        console.error("Error logging out: " + error.message); // Log error details
        return res.status(500).send("Error logging out."); // Send error response
    }
};

export default {
    getAccount,
    getCurrentAccount,
    editAccount,
    deleteAccount,
    login,
    signup,
    changePassword,
    logout,
};
