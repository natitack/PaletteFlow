import React, { useState, useEffect } from 'react';
import { Card, Text, Flex, Box } from "@radix-ui/themes"
import * as lightColors from '../light';
import { useColorScales } from '../../hooks/useColorScales';
import themeManager from '../../lib/themeManager';
import { themeColors } from '../tailwindcolors';
import { useChoices } from "../../context/ChoicesContext";
import { findClosestRadixPalette, getPaletteColor } from '../utils/colorutils';
import { hexToOklch, adjustOklch, formatOklch, findClosestTailwindColor } from '../utils/oklch-color-utils';

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
      processColorTransformation(hexColor, choices.chroma, choices.lightness);
    } else {
      // If mood settings aren't available yet, just set the tailwind color
      // based on the closest match to the original hex
      const oklchColor = hexToOklch(hexColor);
      if (oklchColor) {
        const numericOklch = {
          l: Number(oklchColor.l),
          c: Number(oklchColor.c),
          h: Number(oklchColor.h),
        };
        const closestTailwind = findClosestTailwindColor(numericOklch);
        updateChoice("tailwindColor", closestTailwind.colorName);
        updateChoice("brandNumber", closestTailwind.shade);
      }
    }
  };
  
  const processColorTransformation = (hexColor, chroma, lightness) => {
    // Convert hex to OKLCH
    const oklchColor = hexToOklch(hexColor);
    
    if (oklchColor) {
      // Adjust OKLCH values based on mood
      const adjustedOklch = adjustOklch(oklchColor, chroma, lightness);
      
      // Format the new OKLCH color
      const newOklchStr = formatOklch(adjustedOklch.l, adjustedOklch.c, adjustedOklch.h);
      
      // Find the closest Tailwind color
      const closestTailwind = findClosestTailwindColor(adjustedOklch);
      
      // Update the context with the new values
      updateChoice("tailwindColor", closestTailwind.colorName);
      updateChoice("brandNumber", closestTailwind.shade);
    }
  };

  const paletteName = findClosestRadixPalette(currentColor);
  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(paletteName);

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
      <span className="text-sm text-gray-500">Tailwind: {choices.tailwindColor}-{choices.brandNumber}</span>
      </div>
      </div>
      </Card>
      
      {/* Color Transformation Preview
      // <Card className="p-4">
      //   <Text size="2" weight="bold" className="mb-2">Color Transformations</Text>
      //   <Flex gap="3">
      //     <div className="flex flex-col items-center">
      //       <div 
      //         className="w-10 h-10 rounded mb-1" 
      //         style={{ backgroundColor: choices.originalHex }} 
      //       />
      //       <Text size="1">Original</Text>
      //     </div>
          
      //     <div className="flex items-center">
      //       <div className="text-gray-400">→</div>
      //     </div>
          
      //     <div className="flex flex-col items-center">
      //       <div 
      //         className="w-10 h-10 rounded mb-1" 
      //         style={{ 
      //           backgroundColor: themeColors[choices.tailwindColor]?.[choices.brandNumber] || "#cccccc"
      //         }} 
      //       />
      //       <Text size="1">Transformed</Text>
      //     </div>
          
      //     <div className="ml-2">
      //       <Text size="1">Chroma: {choices.chroma}</Text>
      //       <Text size="1">Lightness: {choices.lightness}</Text>
      //     </div>
      //   </Flex>
      </Card> */}
      
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
      {Object.keys(colorScale).map((key, index) => (
        <Box key={key} style={{ backgroundColor: colorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
      ))}
        </Flex>
        <Flex direction="column" gap="1" align="center">
      {Object.keys(darkModeColorScale).map((key, index) => (
        <Box key={key} style={{ backgroundColor: darkModeColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
      ))}
        </Flex>
        <Flex direction="column" gap="1" align="center">
      {Object.keys(grayColorScale).map((key, index) => (
        <Box key={key} style={{ backgroundColor: grayColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
      ))}
        </Flex>
        <Flex direction="column" gap="1" align="center">
      {Object.keys(darkGrayColorScale).map((key, index) => (
        <Box key={key} style={{ backgroundColor: darkGrayColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
      ))}
        </Flex>
      </Flex>
      </Flex>
      </div>
  );
}