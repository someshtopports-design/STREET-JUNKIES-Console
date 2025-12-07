import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDv1SZT1V8iVdKtDDWKENU3-TK0MgPSyi0",
  authDomain: "streetj.firebaseapp.com",
  projectId: "streetj",
  storageBucket: "streetj.firebasestorage.app",
  messagingSenderId: "868126532076",
  appId: "1:868126532076:web:2c690e1c032235bc2a60c9",
  measurementId: "G-5DXCGLGZDH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((ok) => {
    if (ok) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };
