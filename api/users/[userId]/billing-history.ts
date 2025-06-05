
// Placeholder for: GET /api/users/{userId}/billing-history
// The actual backend logic for fetching billing history is intended to be implemented
// using Firebase Firestore and Firebase Functions.
// See README-Firebase.md for setup instructions.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const { userId } = request.query;

  if (request.method === 'GET') {
    response.status(501).json({ 
      message: `Get billing history for user ${userId} - endpoint not implemented on Vercel. Backend logic is handled by Firebase Functions.`,
      code: 'NOT_IMPLEMENTED_VERCEL',
      details: 'This is a placeholder API route. The functional backend uses Firebase.'
    });
  } else {
    response.setHeader('Allow', ['GET']);
    response.status(405).json({ message: `Method ${request.method} Not Allowed` });
  }
}
