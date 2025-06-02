import { Flex, Text, Box, Card } from "@radix-ui/themes";
import { useChoices } from "../../context/ChoicesContext";
import { useFontOptions } from "../../hooks/useFontOptions";
import { transformColorByMood, getRadixColor } from "../utils/color-utils";
import {  hexToOklch } from '../utils/color-utils';
import { useState, useEffect } from "react";
import themeManager from '../../lib/themeManager';

// Unified mood configuration combining all mood-related data
const MOOD_CONFIG = {
  caregiver: {
    label: "Caregiver",
    emoji: "❤️",
    description: "Nurturing, compassionate, supportive",
    styles: {
      font: "Nunito",
      buttonStyle: "full",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.30,
      lightness: 0.90
    }
  },
  creator: {
    label: "Creator",
    emoji: "🎨",
    description: "Innovative, artistic, expressive",
    styles: {
      font: "Fredoka",
      buttonStyle: "none",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.95,
      lightness: 0.40
    }
  },
  ruler: {
    label: "Ruler",
    emoji: "👑",
    description: "Authoritative, refined, commanding",
    styles: {
      font: "Source Serif 4",
      buttonStyle: "small",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.80,
      lightness: 0.25
    }
  },
  innocent: {
    label: "Innocent",
    emoji: "🌸",
    description: "Pure, optimistic, trustful",
    styles: {
      font: "Labrada",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.25,
      lightness: 0.97
    }
  },
  explorer: {
    label: "Explorer",
    emoji: "🧭",
    description: "Adventurous, independent, authentic",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.85,
      lightness: 0.60
    }
  },
  sage: {
    label: "Sage",
    emoji: "🧠",
    description: "Wise, knowledgeable, analytical",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.45,
      lightness: 0.85
    }
  },
  hero: {
    label: "Hero",
    emoji: "⚔️",
    description: "Brave, determined, inspiring",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 1.00,
      lightness: 0.30
    }
  },
  outlaw: {
    label: "Outlaw",
    emoji: "🔥",
    description: "Rebellious, disruptive, free-thinking",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 1.10,
      lightness: 0.18
    }
  },
  magician: {
    label: "Magician",
    emoji: "✨",
    description: "Transformative, visionary, charismatic",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.90,
      lightness: 0.22
    }
  },
  everyman: {
    label: "Everyman",
    emoji: "🤝",
    description: "Relatable, down-to-earth, practical",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 0.35,
      lightness: 0.92
    }
  },
  lover: {
    label: "Lover",
    emoji: "💕",
    description: "Passionate, intimate, appreciative",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 1.05,
      lightness: 0.38
    }
  },
  jester: {
    label: "Jester",
    emoji: "🎭",
    description: "Playful, humorous, spontaneous",
    styles: {
      font: "Reddit Mono",
      buttonStyle: "medium",
      heroLayout: "header1",
      featureLayout: "layout398",
      chroma: 1.15,
      lightness: 0.80
    }
  }
};

// Helper function to get mood values with font mapping
function getMoodValues(mood: string, fontOptions: any[]) {
  const fontMap = fontOptions.reduce((acc, option) => {
    acc[option.label] = option;
    return acc;
  }, {});

  const moodData = MOOD_CONFIG[mood];
  if (!moodData) {
    return {
      chroma: 0.20,
      lightness: 0.55
    };
  }

  return {
    ...moodData.styles,
    font: fontMap[moodData.styles.font]
  };
}

export function MoodStep({ value, onChange }) {
  const { updateChoice, choices } = useChoices();
  const fontOptions = useFontOptions();
  const [selectedMood, setSelectedMood] = useState(value || "");
  const [moodColors, setMoodColors] = useState({});
  const [radixInfo, setRadixInfo] = useState({});
  const isDarkMode = themeManager.getCurrentTheme().darkMode;

  useEffect(() => {
    if (choices.originalHex) {
      generateMoodColorData(choices.originalHex);
    }
  }, [choices.originalHex]);

  const generateMoodColorData = (hexColor: string) => {
    const oklchColor = hexToOklch(hexColor);
    if (!oklchColor) return;

    const newMoodColors = {};
    const newRadixInfo = {};
    
    Object.entries(MOOD_CONFIG).forEach(([moodKey, moodData]) => {
      const { paletteName, shade } = transformColorByMood(
        hexColor,
        moodData.styles.chroma,
        moodData.styles.lightness
      );
      
      newRadixInfo[moodKey] = {
        paletteName,
        shade
      };
      
      const radixColor = getRadixColor(paletteName, shade, false);
      newMoodColors[moodKey] = radixColor;
    });
    
    setMoodColors(newMoodColors);
    setRadixInfo(newRadixInfo);
  };

  const handleChange = (newValue: string) => {
    setSelectedMood(newValue);
    const moodValues = getMoodValues(newValue, fontOptions);
    updateChoice("mood", newValue);
    
    // Update all style-related values
    Object.entries(moodValues).forEach(([key, val]) => updateChoice(key, val as string));
    
    if (choices.originalHex) {
      const { paletteName, shade } = transformColorByMood(
        choices.originalHex,
        moodValues.chroma,
        moodValues.lightness
      );
      
      updateChoice("color", paletteName);
      updateChoice("shade", shade);
      updateChoice("chroma", moodValues.chroma.toString());
      updateChoice("lightness", moodValues.lightness.toString());
    }
    
    onChange(newValue);
  };

  const moodEntries = Object.entries(MOOD_CONFIG);

  return (
    <Flex direction="column" gap="6">
      <Text size="5" weight="bold" style={{ color: "#111" }}>
        Select your brand personality
      </Text>
      <Card
        className="p-4"
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        <Flex direction="column" gap="4">
          {moodEntries.map(([moodKey, moodData]) => {
            const isSelected = selectedMood === moodKey;
            const moodInfo = radixInfo[moodKey];
            const swatchColor = choices.originalHex && moodInfo && moodColors[moodKey] 
              ? moodColors[moodKey] 
              : "#e0e0e0";

            return (
              <Box
                key={moodKey}
                onClick={() => handleChange(moodKey)}
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
                    backgroundColor: "#f8f8f8",
                    color: "#111",
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
                  
                  {/* Emoji */}
                  <Text size="6" style={{ marginRight: "16px", color: "#111" }}>
                    {moodData.emoji}
                  </Text>
                  
                  {/* Text content */}
                  <Flex direction="column" style={{ flex: 1 }}>
                    <Text 
                      size="3" 
                      weight={isSelected ? "bold" : "medium"} 
                      style={{ marginBottom: "4px", color: "#111" }}
                    >
                      {moodData.label}
                    </Text>
                    <Text size="2" style={{ color: "#111" }}>
                      {moodData.description}
                    </Text>
                    {isSelected && moodInfo && (
                      <Text size="1" style={{ color: "#555", marginTop: "4px" }}>
                        {moodInfo.paletteName} {moodInfo.shade}
                      </Text>
                    )}
                  </Flex>
                  
                  {/* Checkmark */}
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
      </Card>
    </Flex>
  );
}

// Static method for backward compatibility
MoodStep.getMoodValues = function(mood: string) {
  const fontOptions = useFontOptions();
  return getMoodValues(mood, fontOptions);
};