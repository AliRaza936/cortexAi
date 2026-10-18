
import admin from "firebase-admin";

const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!credentials) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
}

const serviceAccount = JSON.parse(credentials);

export const app =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
