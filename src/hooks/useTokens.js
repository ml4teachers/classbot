// hooks/useTokens.js
import { useState, useEffect } from 'react';

export function useTokens() {
  const [tokens, setTokens] = useState({ used_input_tokens: 0, used_output_tokens: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateTotalTokens = (inputTokens, outputTokens) => {
    return 1 * inputTokens + 3 * outputTokens;
  };

  const totalTokens = calculateTotalTokens(tokens.used_input_tokens, tokens.used_output_tokens);

  useEffect(() => {
    async function fetchTokens() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tokens');
        if (!response.ok) throw new Error('Netzwerkantwort war nicht ok.');
        const data = await response.json();
        setTokens(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTokens();
  }, []);

  return { totalTokens };
}
