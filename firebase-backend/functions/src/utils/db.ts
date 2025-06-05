
import * as admin from "firebase-admin";

// Ensure Firebase Admin is initialized (idempotent)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

// You can add Firestore settings here if needed
// For example, to ignore undefined properties:
// db.settings({
//   ignoreUndefinedProperties: true,
// });

export { db };
