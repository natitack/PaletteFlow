import React, { useState, useEffect } from 'react';
import { Card, Text, Flex, Box } from "@radix-ui/themes"
import * as lightColors from '../light';
import { useColorScales } from '../../hooks/useColorScales';
import themeManager from '../../lib/themeManager';




const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getColorDistance = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );
};

const findClosestPalette = (color) => {
  let closestDistance = Infinity;
  let closestPaletteName = '';

  Object.entries(lightColors).forEach(([name, palette]) => {
    if (name.includes('A') || name.includes('P3')) return;

    Object.entries(palette).forEach(([_, paletteColor]) => {
      const distance = getColorDistance(color, paletteColor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPaletteName = name;
      }
    });
  });

  return closestPaletteName;
};



const getPaletteColor = (paletteName: string): string => {
  if (!paletteName || !lightColors[paletteName]) return '#000000';
  const colors = Object.values(lightColors[paletteName]) as string[];
  return colors[Math.floor(colors.length / 2)] || colors[0] || '#000000';
};

export function ColorPickerStep({ value, onChange }) {
  const [currentColor, setCurrentColor] = useState<string>(getPaletteColor(value));

  useEffect(() => {
    setCurrentColor(getPaletteColor(value));
  }, [value]);

  const handleColorChange = (hexColor) => {
    const paletteName = findClosestPalette(hexColor);
    themeManager.setTheme(paletteName);
    onChange(paletteName);
  };

  const paletteName = findClosestPalette(currentColor);
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
      </div>
      </div>
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