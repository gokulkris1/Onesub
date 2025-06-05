// Service for interacting with the AI model via the proxy

export const getAISuggestions = async (prompt: string): Promise<string> => {
  // The local api/geminiProxy.ts has been removed as it's server-side code
  // and cannot run directly with a simple static file server.
  // AI features require a backend proxy implementation (e.g., in Firebase Functions).
  console.warn("AI Suggestion feature is currently disabled. A backend proxy is required.");
  throw new Error("AI Suggestion feature is not available. Please configure a backend proxy (e.g., a Firebase Function).");

  // Original fetch logic commented out:
  /*
  try {
    const response = await fetch('/api/geminiProxy', { // This endpoint no longer exists locally
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI API Error Data:', errorData);
      throw new Error(errorData.error?.message || `AI API Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.text) {
      return data.text;
    } else {
      console.error('AI API Response Missing Text:', data);
      throw new Error("Received an empty or invalid response from the AI.");
    }
  } catch (err: any) {
    console.error("Error fetching AI suggestions:", err);
    throw err; // Re-throw to be caught by the calling component
  }
  */
};