import { Flex, Text, Box } from "@radix-ui/themes";
import { useChoices } from "../../context/ChoicesContext";
import { useFontOptions } from "../../hooks/useFontOptions";
import {  transformColorByMood, getRadixColor } from "../utils/radix-color-utils";
import { hexToRgb, hexToOklch, parseOklch, formatOklch, adjustOklch, oklchDistance } from '../utils/oklch-color-utils';
import { useState, useEffect } from "react";
import themeManager from '../../lib/themeManager';

// Mapping of moods to their visual characteristics
const moodVisuals = {
  caregiver: {
    emoji: "❤️",
    description: "Nurturing, compassionate, supportive"
  },
  creator: {
    emoji: "🎨",
    description: "Innovative, artistic, expressive"
  },
  ruler: {
    emoji: "👑",
    description: "Authoritative, refined, commanding"
  },
  innocent: {
    emoji: "🌸",
    description: "Pure, optimistic, trustful"
  },
  explorer: {
    emoji: "🧭",
    description: "Adventurous, independent, authentic"
  },
  sage: {
    emoji: "🧠",
    description: "Wise, knowledgeable, analytical"
  },
  hero: {
    emoji: "⚔️",
    description: "Brave, determined, inspiring"
  },
  outlaw: {
    emoji: "🔥",
    description: "Rebellious, disruptive, free-thinking"
  },
  magician: {
    emoji: "✨",
    description: "Transformative, visionary, charismatic"
  },
  everyman: {
    emoji: "🤝",
    description: "Relatable, down-to-earth, practical"
  },
  lover: {
    emoji: "💕",
    description: "Passionate, intimate, appreciative"
  },
  jester: {
    emoji: "🎭",
    description: "Playful, humorous, spontaneous"
  }
};

const moodOptions = [
  { value: "caregiver", label: "Caregiver" },
  { value: "creator", label: "Creator" },
  { value: "ruler", label: "Ruler" },
  { value: "innocent", label: "Innocent" },
  { value: "explorer", label: "Explorer" },
  { value: "sage", label: "Sage" },
  { value: "hero", label: "Hero" },
  { value: "outlaw", label: "Outlaw" },
  { value: "magician", label: "Magician" },
  { value: "everyman", label: "Everyman" },
  { value: "lover", label: "Lover" },
  { value: "jester", label: "Jester" },
];

export function MoodStep({ value, onChange }) {
  const { updateChoice, choices } = useChoices();
  const [selectedMood, setSelectedMood] = useState(value || "");
  const [moodColors, setMoodColors] = useState({});
  const [radixInfo, setRadixInfo] = useState({});
  const isDarkMode = themeManager.getCurrentTheme().darkMode;

  useEffect(() => {
    // Generate color variations for each mood based on originalHex when available
    if (choices.originalHex) {
      generateMoodColorData(choices.originalHex);
    }
  }, [choices.originalHex]);

  // Unified function to generate mood color data
  const generateMoodColorData = (hexColor) => {
    const oklchColor = hexToOklch(hexColor);
    if (!oklchColor) return;

    const newMoodColors = {};
    const newRadixInfo = {};
    
    // Generate a color for each mood based on its chroma and lightness values
    moodOptions.forEach(option => {
      const moodValue = MoodStep.getMoodValues(option.value);
      const { paletteName, shade } = transformColorByMood(
        hexColor,
        moodValue.chroma,
        moodValue.lightness
      );
      
      // Store the radix color information
      newRadixInfo[option.value] = {
        paletteName,
        shade
      };
      
      // Get the actual color from the Radix palette
      const radixColor = getRadixColor(paletteName, shade, isDarkMode);
      newMoodColors[option.value] = radixColor;
    });
    
    setMoodColors(newMoodColors);
    setRadixInfo(newRadixInfo);
  };

  const handleChange = (newValue) => {
    setSelectedMood(newValue);
    const moodValues = MoodStep.getMoodValues(newValue);
    updateChoice("mood", newValue); // Update the mood in the context
    
    // Update other related values
    Object.entries(moodValues).forEach(([key, val]) => updateChoice(key, val));
    
    // Process the color transformation based on the new mood
    if (choices.originalHex) {
      // Transform the color according to the mood values
      const { paletteName, shade } = transformColorByMood(
        choices.originalHex,
        moodValues.chroma,
        moodValues.lightness
      );
      
      // Update the context with the new values
      updateChoice("color", paletteName);
      updateChoice("shade", shade);
      updateChoice("chroma", moodValues.chroma.toString());
      updateChoice("lightness", moodValues.lightness.toString());
    }
    
    onChange(newValue);
  };

  return (
    <Flex direction="column" gap="6">
      <Text size="5" weight="bold" style={{ color: "#111" }}>Select your brand personality</Text>
      <Flex direction="column" gap="4">
        {moodOptions.map((option) => {
          const isSelected = selectedMood === option.value;
          const visualInfo = moodVisuals[option.value];
          const moodInfo = radixInfo[option.value];

          // Consistent background for all options
          const consistentBg = "#f8f8f8";
          let swatchColor = "#e0e0e0";
          
          if (choices.originalHex && moodInfo && moodColors[option.value]) {
            swatchColor = moodColors[option.value];
          }

          return (
            <Box
              key={option.value}
              onClick={() => handleChange(option.value)}
              style={{
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                transform: isSelected ? "translateX(12px)" : "none",
              }}
            >
              <Flex 
                align="center"
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: consistentBg,
                  color: "#111", // Force all text to black
                  border: isSelected ? "3px solid rgba(0,0,0,0.3)" : "3px solid transparent",
                  boxShadow: isSelected 
                    ? "0 8px 16px rgba(0, 0, 0, 0.15)" 
                    : "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* Color swatch */}
                <Box
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: swatchColor,
                    marginRight: 16,
                    border: "2px solid #ddd",
                    flexShrink: 0,
                  }}
                />
                <Text size="6" style={{ marginRight: "16px", color: "#111" }}>
                  {visualInfo.emoji}
                </Text>
                <Flex direction="column" style={{ flex: 1 }}>
                  <Text size="3" weight={isSelected ? "bold" : "medium"} style={{ marginBottom: "4px", color: "#111" }}>
                    {option.label}
                  </Text>
                  <Text size="2" style={{ color: "#111" }}>
                    {visualInfo.description}
                  </Text>
                  {isSelected && moodInfo && (
                    <Text size="1" style={{ color: "#555", marginTop: "4px" }}>
                      {moodInfo.paletteName} {moodInfo.shade}
                    </Text>
                  )}
                </Flex>
                {isSelected && (
                  <Box style={{ marginLeft: "8px" }}>
                    <Text size="5" style={{ color: "#111" }}>✓</Text>
                  </Box>
                )}
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
}

MoodStep.getMoodValues = function (mood) {
  const fontOptions = useFontOptions();
  const fontMap = fontOptions.reduce((acc, option) => {
    acc[option.label] = option.value;
    return acc;
  }, {});

  switch (mood) {
    case "caregiver":
      return {
        font: fontMap["Nunito"],
        buttonStyle: "full",
        cardStyle: "raised",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.4,    
        lightness: 0.75  
      };
    case "creator":
      return {
        font: fontMap["Fredoka"],
        buttonStyle: "none",
        cardStyle: "flat",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.7,    
        lightness: 0.50 
      };
    case "ruler":
      return {
        font: fontMap["Source Serif 4"],
        buttonStyle: "small",
        cardStyle: "shadow",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.60,    
        lightness: 0.40  
      };
    case "innocent":
      return {
        font: fontMap["Labrada"],
        buttonStyle: "medium",
        cardStyle: "bordered",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.4,   
        lightness: 0.8  
      };
    case "explorer":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.60,    
        lightness: 0.55  
      };
    case "sage":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.50,    
        lightness: 0.70  
      };
    case "hero":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.80,    
        lightness: 0.45  
      };
    case "outlaw":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.90,    
        lightness: 0.35 
      };
    case "magician":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.70,    
        lightness: 0.40  
      };
    case "everyman":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.50,    
        lightness: 0.80  
      };
    case "lover":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.80,    
        lightness: 0.45  
      };
    case "jester":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.90,    
        lightness: 0.70  
      };
    default:
      return {
        chroma: 0.20,    // Default chroma
        lightness: 0.55  // Default lightness
      };
  }
};