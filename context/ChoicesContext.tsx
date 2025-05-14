import React, { createContext, useContext, useState, useCallback } from "react";

const ChoicesContext = createContext(null);

export const ChoicesProvider = ({ children }) => {
  const [choices, setChoices] = useState({
    color: "indigo",
    mood: "caregiver",
    font: "system-ui",
    buttonStyle: "rounded",
    cardStyle: "flat",
    heroLayout: "header1",
    featureLayout: "event2",
  });

  const updateChoice = useCallback((key: string, value: string) => {
    setChoices((prev) => {
      const newChoices = { ...prev, [key]: value };
      localStorage.setItem("brandChoices", JSON.stringify(newChoices)); // Save to localStorage
      return newChoices;
    });
  }, []);

  return (
    <ChoicesContext.Provider value={{ choices, updateChoice }}>
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