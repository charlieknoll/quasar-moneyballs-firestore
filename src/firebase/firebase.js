import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
} from "firebase/auth";
import { Capacitor } from "@capacitor/core";

import { firebaseConfig } from "./firebaseConfig";

function whichAuth() {
  let auth;
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence,
    });
  } else {
    auth = getAuth();
  }
  return auth;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = whichAuth();

export { db, auth };
