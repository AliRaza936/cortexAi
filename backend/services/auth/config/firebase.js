
import {
  initializeApp,
  getApps,
  cert,
} from "firebase-admin/app";

const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!credentials) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
}

const serviceAccount = JSON.parse(credentials);

export const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });
