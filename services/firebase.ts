import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: In a real environment, these would be environment variables.
// For this demo, we are mocking the initialization or expecting the user to fill this in.
// Since I cannot access process.env in this output sandbox, I will assume a valid config exists or fail gracefully.

const firebaseConfig = {
  apiKey: process.env.API_KEY || "AIzaSyD-mock-key-for-demo",
  authDomain: "mock-project.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);