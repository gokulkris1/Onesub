
// Placeholder for admin provider management endpoints.
// The actual backend logic for this is intended to be implemented
// using Firebase Firestore and Firebase Functions.
// See README-Firebase.md for setup instructions.

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  let message = 'Admin providers endpoint not implemented on Vercel. Backend logic is handled by Firebase Functions.';
  
  if (request.method === 'POST') {
    message = 'Admin onboard provider endpoint not implemented on Vercel. Use Firebase Functions.';
  } else if (request.method === 'GET') {
    message = 'Admin get providers endpoint not implemented on Vercel. Use Firebase Functions.';
  } else if (request.method === 'PUT') {
    message = 'Admin update provider endpoint not implemented on Vercel. Use Firebase Functions.';
  }

  if (['POST', 'GET', 'PUT'].includes(request.method || '')) {
    response.status(501).json({ 
      message: message,
      code: 'NOT_IMPLEMENTED_VERCEL',
      details: 'This is a placeholder API route. The functional backend uses Firebase.'
    });
  } else {
    response.setHeader('Allow', ['POST', 'GET', 'PUT']);
    response.status(405).json({ message: `Method ${request.method} Not Allowed` });
  }
}
