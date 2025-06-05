
import React, { useState } from 'react';
import * as aiService from '../services/aiService';

interface AISuggestionBoxProps {
  title: string;
  generatePrompt: () => string; // Function to generate the prompt dynamically
}

const AISuggestionBox: React.FC<AISuggestionBoxProps> = ({ title, generatePrompt }) => {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    try {
      const prompt = generatePrompt();
      const result = await aiService.getAISuggestions(prompt);
      setSuggestions(result);
    } catch (err: any) {
      setError((err as Error).message || 'Failed to fetch AI suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-100 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-sky-600 mb-4">{title}</h3>
      <button
        onClick={fetchSuggestions}
        disabled={isLoading}
        className="mb-4 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-md transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : 'Get AI Suggestions'}
      </button>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-slate-600">Generating suggestions, please wait...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 rounded-md text-center">
          <p className="text-sm text-red-700 font-semibold">Error:</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {suggestions && !isLoading && (
        <div className="mt-4 p-4 bg-slate-200 rounded-md prose prose-sm max-w-none">
          <h4 className="text-slate-700 font-semibold mb-2">Suggestions from AI:</h4>
          <pre className="whitespace-pre-wrap break-words text-slate-700">{suggestions}</pre>
        </div>
      )}
    </div>
  );
};

export default AISuggestionBox;
