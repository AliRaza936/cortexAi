
// import {
//   initializeApp,
//   getApps,
//   cert,
// } from "firebase-admin/app";

// const credentials = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

// if (!credentials) {
//   throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");
// }

// const serviceAccount = JSON.parse(credentials);

// export const app =
//   getApps().length > 0
//     ? getApps()[0]
//     : initializeApp({
//         credential: cert(serviceAccount),
//       });


      
import {
  initializeApp,
  getApps,
  cert,
} from "firebase-admin/app";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get service account JSON from the auth project root
const serviceAccountPath = path.resolve(
  __dirname,
  "../serviceAccountKey.json"
);

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

export const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });
