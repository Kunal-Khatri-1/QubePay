// import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   // TODO: This below causes an error (Issue #47)
//   // projectId: process.env.FIREBASE_PROJECT_ID,
//   projectId: "qubepay-succery",
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// export { firebaseApp }

// ===========================================================================

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7XrHinwfwXwpt75m391tVdY701_iSSQU",
  authDomain: "succery-qube.firebaseapp.com",
  projectId: "succery-qube",
  storageBucket: "succery-qube.appspot.com",
  messagingSenderId: "256544417852",
  appId: "1:256544417852:web:507e435a865f3900e5bb39",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
