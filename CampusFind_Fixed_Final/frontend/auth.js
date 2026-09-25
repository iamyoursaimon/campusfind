// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH37AroTQmQ-2MLVyoejDX3Gn6NQSz9pw",
  authDomain: "campus-find-2b29b.firebaseapp.com",
  projectId: "campus-find-2b29b",
  storageBucket: "campus-find-2b29b.firebasestorage.app",
  messagingSenderId: "860482660963",
  appId: "1:860482660963:web:0c0d1bde6f67996fba2656",
  measurementId: "G-7DFTTNZN5H"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);


// ===============================
// SIGN UP
// ===============================

export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log("User created:", userCredential.user.uid);

        return {
            success: true,
            user: userCredential.user
        };

    } catch (error) {
        console.error("Signup error:", error);

        return {
            success: false,
            error: error.message
        };
    }
}


// ===============================
// LOGIN
// ===============================

export async function loginUser(email, password) {
    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            userCredential.user;

        // Get Firebase ID Token
        const idToken =
            await user.getIdToken();

        console.log(
            "User logged in:",
            user.uid
        );

        return {
            success: true,
            user: user,
            idToken: idToken
        };

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        return {
            success: false,
            error: error.message
        };
    }
}

// ===============================
// PASSWORD RESET
// ===============================

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);

        return {
            success: true
        };

    } catch (error) {
        console.error("Password reset error:", error);

        return {
            success: false,
            error: error.message
        };
    }
}


// ===============================
// LOGOUT
// ===============================

export async function logoutUser() {
    try {
        await signOut(auth);

        console.log("User logged out");

        return {
            success: true
        };

    } catch (error) {
        console.error("Logout error:", error);

        return {
            success: false,
            error: error.message
        };
    }
}


// ===============================
// AUTH STATE
// ===============================

export function watchAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}


// Export Firebase Auth
export { auth };