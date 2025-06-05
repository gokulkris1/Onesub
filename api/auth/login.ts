
// Placeholder for: POST /api/auth/login
// The actual backend authentication logic is intended to be implemented
// using Firebase Authentication and Firebase Functions.
// See README-Firebase.md for setup instructions.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'POST') {
    response.status(501).json({ 
      message: 'Login endpoint not implemented on Vercel. Backend logic is handled by Firebase Functions.',
      code: 'NOT_IMPLEMENTED_VERCEL',
      details: 'This is a placeholder API route. The functional backend uses Firebase.'
    });
  } else {
    response.setHeader('Allow', ['POST']);
    response.status(405).json({ message: `Method ${request.method} Not Allowed` });
  }
}
