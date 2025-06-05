
import * as admin from "firebase-admin";
import {onRequest} from "firebase-functions/v2/https";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin SDK
// This is done once per function instance, not per request.
// For deployed functions, Firebase handles initialization automatically.
// For local emulator, it uses the service account if GOOGLE_APPLICATION_CREDENTIALS is set,
// or uses default credentials available in the emulated environment.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Example HTTP function (callable via URL)
// In V2, 'request' is of type 'firebase-functions/v2/https.Request' (which extends express.Request)
// and 'response' is of type 'express.Response'. These are typically inferred.
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  // Explicitly cast to 'any' as a workaround if TypeScript's inference is problematic
  // or if the provided Response type (reported as Response<any, Record<string, any>>)
  // is unexpectedly missing methods in this specific environment.
  (response as any).send("Hello from OneSub Firebase Functions!");
});

// Example Callable function (called from client SDK)
// In V2, 'request' is of type 'firebase-functions/v2/https.CallableRequest'.
export const myCallableFunction = onCall((request) => {
  // Check authentication
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
    );
  }

  const userId = request.auth.uid;
  const text = request.data.text; // Data passed from the client

  logger.info(`User ${userId} called function with text: ${text}`);

  // Perform some action
  return {
    message: `Received your message: "${text}". Processed by user ${userId}.`,
    timestamp: admin.firestore.Timestamp.now(),
  };
});

// You will add more functions here, e.g., for auth, subscriptions, etc.
// export * from "./auth"; // Example: if you put auth functions in auth.ts
// export * from "./subscriptions";
