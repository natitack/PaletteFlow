import React, { createContext, useContext, useState, useCallback } from "react";

interface ChoicesState {
  color: string;               // Radix palette name (e.g., 'indigo')
  originalHex: string;         // Original picked hex color
  shade: string;               // Radix color shade (e.g., '9')
  chroma: string;              // OKLCH chroma value as string
  lightness: string;           // OKLCH lightness value as string
  mood: string;                // Selected mood
  font: string;                // Selected font
  buttonStyle: string;         // Button style choice
  cardStyle: string;           // Card style choice
  heroLayout: string;          // Hero layout choice
  featureLayout: string;       // Feature layout choice
}

interface ChoicesContextType {
  choices: ChoicesState;
  updateChoice: (key: string, value: string) => void;
  setAllChoices: (newChoices: ChoicesState) => void;
}

const ChoicesContext = createContext<ChoicesContextType | null>(null);

export const ChoicesProvider = ({ children }) => {
  const getInitialChoices = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brandChoices");
      if (stored) return JSON.parse(stored);
    }
    return {
      color: "indigo",         // Radix palette name
      originalHex: "#4f46e5",  // Original hex color
      shade: "9",              // Radix color shade
      chroma: ".5",            // OKLCH chroma value
      lightness: ".50",        // OKLCH lightness value
      mood: "modern",          // Selected mood
      font: "system-ui",       // Selected font
      buttonStyle: "rounded",  // Button style choice
      cardStyle: "flat",       // Card style choice
      heroLayout: "header1",   // Hero layout choice
      featureLayout: "event2", // Feature layout choice
    };
  };

  const [choices, setChoices] = useState<ChoicesState>(getInitialChoices);

  const updateChoice = useCallback((key: string, value: string) => {
    setChoices((prev) => {
      const newChoices = { ...prev, [key]: value };
      localStorage.setItem("brandChoices", JSON.stringify(newChoices)); // Save to localStorage
      return newChoices;
    });
  }, []);

  const setAllChoices = useCallback((newChoices: ChoicesState) => {
    setChoices(newChoices);
    localStorage.setItem("brandChoices", JSON.stringify(newChoices));
  }, []);

  return (
    <ChoicesContext.Provider value={{ choices, updateChoice, setAllChoices }}>
      {children}
    </ChoicesContext.Provider>
  );
};

export const useChoices = (): ChoicesContextType => {
  const context = useContext(ChoicesContext);
  if (!context) {
    throw new Error("useChoices must be used within a ChoicesProvider");
  }
  return context;
};