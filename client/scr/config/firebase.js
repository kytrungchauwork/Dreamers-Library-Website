import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
// TODO: Thay đổi các giá trị này bằng config từ Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDTp6odIAOfMQUUaVOUJB4dq9Zeqgwlw-U",
  authDomain: "book-reader-app-25e72.firebaseapp.com",
  projectId: "book-reader-app-25e72",
  storageBucket: "book-reader-app-25e72.firebasestorage.app",
  messagingSenderId: "1053681283892",
  appId: "1:1053681283892:web:147c058bddce26b28a6b61",
  measurementId: "G-29RHCF0KC0"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Force account selection
});
