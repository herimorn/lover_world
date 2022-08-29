// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlZdcDiqeb7Iq-W2Thy30prBveE1Bmdak",
  authDomain: "lovers1-dfa34.firebaseapp.com",
  projectId: "lovers1-dfa34",
  storageBucket: "lovers1-dfa34.appspot.com",
  messagingSenderId: "722741879764",
  appId: "1:722741879764:web:a6a93f0588d0b91fd1ac41",
  measurementId: "G-93YPMF6LF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore(
  app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
  }
);
export { auth, db };
