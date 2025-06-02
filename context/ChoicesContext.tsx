import React, { createContext, useContext, useState, useCallback } from "react";

interface FontChoice {
  label: string;
  value: string; // typically the className (e.g., "__className_xyz")
}

interface ChoicesState {
  color: string;               // Radix palette name (e.g., 'indigo')
  originalHex: string;         // Original picked hex color
  shade: string;               // Radix color shade (e.g., '9')
  chroma: string;              // OKLCH chroma value as string
  lightness: string;           // OKLCH lightness value as string
  mood: string;                // Selected mood
  font: FontChoice,            // Selected font
  buttonStyle: string;         // Button style choice
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
      if (stored) {
        const parsed = JSON.parse(stored);

        // Migrate old string-based font to object-based font
        if (typeof parsed.font === "string") {
          parsed.font = {
            label: parsed.font
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            value: parsed.font,
          };
        }

        return parsed;
      }
    }
    return {
      color: "indigo",         // Radix palette name
      originalHex: "#4f46e5",  // Original hex color
      shade: "9",              // Radix color shade
      chroma: ".5",            // OKLCH chroma value
      lightness: ".50",        // OKLCH lightness value
      mood: "modern",          // Selected mood
      font: { label: "System UI", value: "system-ui" }, // Selected font
      buttonStyle: "rounded",  // Button style choice
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