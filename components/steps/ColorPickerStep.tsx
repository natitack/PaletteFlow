import React, { useState, useEffect } from 'react';
import { Card, Text, Flex, Box } from "@radix-ui/themes"
import { useColorScales } from '../../hooks/useColorScales';
import themeManager from '../../lib/themeManager';
import { useChoices } from "../../context/ChoicesContext";
import { 
  findClosestRadixPalette, 
  getPaletteColor, 
  transformColorByMood 
} from '../utils/radix-color-utils';
import { getRadixColor } from '../utils/radix-color-utils';

export function ColorPickerStep({ value, onChange }) {
  const { choices, updateChoice } = useChoices();
  const [currentColor, setCurrentColor] = useState<string>(getPaletteColor(value));

  useEffect(() => {
    setCurrentColor(getPaletteColor(value));
  }, [value]);

  const handleColorChange = (hexColor) => {
    // Store the original hex color
    updateChoice("originalHex", hexColor);
    
    // Find the closest Radix UI palette for color previews
    const paletteName = findClosestRadixPalette(hexColor);
    themeManager.setTheme(paletteName);
    onChange(paletteName);
    
    // Process the color transformation based on the current mood settings
    if (choices.mood && choices.chroma && choices.lightness) {
      processColorTransformation(hexColor, parseFloat(choices.chroma), parseFloat(choices.lightness));
    } else {
      // If mood settings aren't available yet, just set the radix color
      // based on the closest match to the original hex
      const { paletteName, shade } = transformColorByMood(
        hexColor, 
        0.5, // Default chroma
        0.5  // Default lightness
      );
      
      updateChoice("color", paletteName);
      updateChoice("shade", shade);
    }
  };
  
  const processColorTransformation = (hexColor, chroma, lightness) => {
    // Transform the color according to the mood values
    const { paletteName, shade } = transformColorByMood(hexColor, chroma, lightness);
    
    // Update the context with the new values
    updateChoice("color", paletteName);
    updateChoice("shade", shade);
  };

  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(value);
  const isDarkMode = themeManager.getCurrentTheme().darkMode;

  // Get the representative color from palette shade 9
  const representativeColor = getRadixColor(choices.color, choices.shade || '9', isDarkMode);

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
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="font-medium">Selected Color</span>
            <span className="text-sm text-gray-500 uppercase">{value}</span>
            <span className="text-sm text-gray-500 uppercase">{choices.originalHex}</span>
            <span className="text-sm text-gray-500">Radix: {choices.color} shade {choices.shade}</span>
          </div>
        </div>
      </Card>
      
      {/* Color Transformation Preview */}
      <Card className="p-4">
        <Text size="2" weight="bold" className="mb-2">Color Transformations</Text>
        <Flex gap="3">
          <div className="flex flex-col items-center">
            <div 
              className="w-10 h-10 rounded mb-1" 
              style={{ backgroundColor: choices.originalHex }} 
            />
            <Text size="1">Original</Text>
          </div>
          
          <div className="flex items-center">
            <div className="text-gray-400">→</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-10 h-10 rounded mb-1" 
              style={{ backgroundColor: representativeColor }} 
            />
            <Text size="1">Transformed</Text>
          </div>
          
          <div className="ml-2">
            <Text size="1">Chroma: {choices.chroma}</Text>
            <Text size="1">Lightness: {choices.lightness}</Text>
          </div>
        </Flex>
      </Card>
      
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
              <Box key={index} style={{ backgroundColor: color, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(darkModeColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(grayColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
          <Flex direction="column" gap="1" align="center">
            {Object.values(darkGrayColorScale).map((color, index) => (
              <Box key={index} style={{ backgroundColor: color, width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}