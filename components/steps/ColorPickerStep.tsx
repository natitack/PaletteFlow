import React, { useState, useEffect } from 'react';
import { Card, Text, Flex, Box } from "@radix-ui/themes"
import { useColorScales } from '../../hooks/useColorScales';
import themeManager from '../../lib/themeManager';
import { useChoices } from "../../context/ChoicesContext";
import { 
  findClosestRadixPalette, 
  getPaletteColor, 
} from '../utils/radix-color-utils';
import { getRadixColor } from '../utils/radix-color-utils';

export function ColorPickerStep({ value, onChange }) {
  const { choices, updateChoice } = useChoices();
  const [currentColor, setCurrentColor] = useState<string>(getPaletteColor(value));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCurrentColor(getPaletteColor(value));
  }, [value]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleColorChange = (hexColor) => {
    // Store the original hex color
    updateChoice("originalHex", hexColor);

    // Find the closest Radix UI palette for color previews
    const paletteName = findClosestRadixPalette(hexColor);
    themeManager.setTheme(paletteName);
    onChange(paletteName);

    // Set the radix color and default shade (9) based on the closest match
    updateChoice("color", paletteName);
    updateChoice("shade", '9');
  };

  // Removed processColorTransformation and all transformColorByMood usage

  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(value);
  const isDarkMode = themeManager.getCurrentTheme().darkMode;

  // Get the representative color from palette shade 9
  const representativeColor = getRadixColor(choices.color, choices.shade || '9', isDarkMode);

  if (!hydrated) {
    // Optionally, return a skeleton or nothing
    return null;
  }

  // Convert object values to arrays to ensure consistent rendering
  const colorScaleArray = Object.values(colorScale);
  const darkModeColorScaleArray = Object.values(darkModeColorScale);
  const grayColorScaleArray = Object.values(grayColorScale);
  const darkGrayColorScaleArray = Object.values(darkGrayColorScale);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">
        Choose your color
      </h2>
      
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
        <input
          type="color"
          value={choices.originalHex || currentColor}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-12 h-12 rounded cursor-pointer"
        />
          </div>
          
          <div className="flex flex-col gap-1">
        <span className="font-medium">Selected Color</span>
        {/* <span className="text-sm text-gray-500 uppercase">{value}</span> */}
        <span className="text-sm text-gray-500 uppercase">{choices.originalHex}</span>
        {/* <span className="text-sm text-gray-500">Radix: {choices.color} shade {choices.shade}</span> */}
          </div>
        </div>
      </Card>
      
      {/* Removed Color Transformation Preview */}
      
      {/* Color Palette Preview */}
      <Flex direction="column" gap="4" align="center">
        <Text size="2" weight="bold">
          Accessible Color Palette
        </Text>
        
         <Flex gap="1" justify="center">
          <Flex direction="column" gap="3" align="center">
            {Array.from({ length: 12 }, (_, i) => (
              <Text key={i} size="3">{i + 1}</Text>
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(colorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color as string, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(darkModeColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color as string, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(grayColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color as string, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(darkGrayColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color as string, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>
        </Flex>  </div>
  );
}