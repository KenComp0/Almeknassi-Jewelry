// Firebase app / auth / db singletons. Config comes from .env (gitignored)
// — the same vars must also be set in Netlify (Site settings → Environment).
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// App Check: debug token on localhost, reCAPTCHA Enterprise on production
if (typeof window !== "undefined") {
  const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  
  if (isLocalhost) {
    // Custom debug provider - reads token from localStorage
    const debugProvider = {
      getToken: () => {
        const token = localStorage.getItem("FIREBASE_APPCHECK_DEBUG_TOKEN");
        if (!token || token === "true") {
          // SDK will generate proper debug token and log it to console
          return Promise.resolve({ token: "debug-token-placeholder", expireTimeMillis: Date.now() + 3600000 });
        }
        return Promise.resolve({ token, expireTimeMillis: Date.now() + 3600000 });
      },
      initialize: () => Promise.resolve(),
    };
    initializeAppCheck(app, {
      provider: debugProvider,
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    // reCAPTCHA Enterprise for production
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider("6LcTss4tAAAAAOsUxYgwrpvwtf8x6J4_MauCCMnc"),
      isTokenAutoRefreshEnabled: true,
    });
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
