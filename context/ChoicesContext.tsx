import React, { createContext, useContext, useState, useCallback } from "react";

const ChoicesContext = createContext(null);

export const ChoicesProvider = ({ children }) => {
  const getInitialChoices = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brandChoices");
      if (stored) return JSON.parse(stored);
    }
    return {
      color: "indigo",
      tailwindColor: "indigo",
      originalHex: "#4f46e5",
      brandNumber: "500",
      chroma: ".5",
      lightness: ".50",
      mood: "modern",
      font: "system-ui",
      buttonStyle: "rounded",
      cardStyle: "flat",
      heroLayout: "header1",
      featureLayout: "event2",
    };
  };

  const [choices, setChoices] = useState(getInitialChoices);

  const updateChoice = useCallback((key: string, value: string) => {
    setChoices((prev) => {
      const newChoices = { ...prev, [key]: value };
      localStorage.setItem("brandChoices", JSON.stringify(newChoices)); // Save to localStorage
      return newChoices;
    });
  }, []);

  const setAllChoices = useCallback((newChoices) => {
    setChoices(newChoices);
    localStorage.setItem("brandChoices", JSON.stringify(newChoices));
  }, []);

  return (
    <ChoicesContext.Provider value={{ choices, updateChoice, setAllChoices }}>
      {children}
    </ChoicesContext.Provider>
  );
};

export const useChoices = () => {
  const context = useContext(ChoicesContext);
  if (!context) {
    throw new Error("useChoices must be used within a ChoicesProvider");
  }
  return context;
};