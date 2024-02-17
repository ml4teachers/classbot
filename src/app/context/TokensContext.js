// context/TokensContext.js

'use client';

import React, { createContext, useEffect, useState, useContext } from 'react';

const TokensContext = createContext({
  tokens: { used_input_tokens: 0, used_output_tokens: 0 },
  setTokens: () => {},
  isLoading: true,
  error: null,
  updateTokens: () => {},
});

export const TokensProvider = ({ children }) => {
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

  const updateTokens = async () => {
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
  };
  

  return (
    <TokensContext.Provider value={{ tokens, setTokens, isLoading, error, updateTokens, totalTokens }}>
      {children}
    </TokensContext.Provider>
  );
};

export const useTokens = () => useContext(TokensContext);
