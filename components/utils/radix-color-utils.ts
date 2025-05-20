import * as lightColors from '../light';
import * as darkColors from '../dark';
import { grayPairs } from '../gray';
import { hexToRgb, hexToOklch, parseOklch, formatOklch, adjustOklch, oklchDistance } from './oklch-color-utils';

/**
 * Gets all available Radix color palette names
 */
export const getRadixPaletteNames = (): string[] => {
  return Object.keys(lightColors)
    .filter(name => 
      !name.includes('A') && 
      !name.includes('P3') && 
      typeof lightColors[name] === 'object'
    );
};

/**
 * Gets the gray palette that pairs with a given color palette
 */
export const getGrayPair = (colorName: string): string => {
  return grayPairs[colorName] || 'gray';
};

/**
 * Gets a specific shade from a Radix color palette
 */
export const getRadixColorShade = (paletteName: string, shade: string | number, isDark: boolean = false): string => {
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) return '#000000';
  
  const shadeKey = `${paletteName}${shade}`;
  return palette[shadeKey] || '#000000';
};

/**
 * Gets a representative color from the middle of a palette
 */
export const getPaletteColor = (paletteName: string, isDark: boolean = false): string => {
  if (!paletteName) return '#000000';
  
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) return '#000000';
  
  // Try to get a mid-range color (shade 9 for Radix)
  const midShade = `${paletteName}9`;
  if (palette[midShade]) {
    return palette[midShade];
  }
  
  // Fallback to first available color
  const firstKey = Object.keys(palette)[0];
  return palette[firstKey] || '#000000';
};

/**
 * Calculates the Euclidean distance between two colors in RGB space
 */
export const getColorDistance = (color1: string, color2: string) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );
};

/**
 * Finds the closest Radix UI color palette to a given hex color
 */
export const findClosestRadixPalette = (color: string): string => {
  if (!color) return 'indigo';
  
  let closestDistance = Infinity;
  let closestPaletteName = 'indigo'; // Default fallback

  // Get all palette names
  const paletteNames = getRadixPaletteNames();

  // Compare with a representative color from each palette
  paletteNames.forEach(paletteName => {
    const paletteColor = getPaletteColor(paletteName);
    const distance = getColorDistance(color, paletteColor);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPaletteName = paletteName;
    }
  });

  return closestPaletteName;
};

/**
 * Builds a full color scale using Radix UI colors
 */
export const buildColorScale = (paletteName: string, isDark: boolean = false): Record<string, string> => {
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) return {};
  
  const scale = {};
  
  // Iterate through the palette and extract colors
  for (let i = 1; i <= 12; i++) {
    const shadeKey = `${paletteName}${i}`;
    if (palette[shadeKey]) {
      scale[shadeKey] = palette[shadeKey];
    }
  }
  
  return scale;
};

/**
 * Transforms a color according to specified mood values (chroma, lightness)
 * Returns the appropriate Radix color palette and shade
 */
export const transformColorByMood = (hexColor: string, chroma: number, lightness: number): { paletteName: string, shade: string } => {
  // Convert hex to OKLCH
  const oklchColor = hexToOklch(hexColor);
  if (!oklchColor) return { paletteName: 'indigo', shade: '9' };
  
  // Adjust OKLCH values based on mood
  const adjustedOklch = adjustOklch(oklchColor, chroma, lightness);
  
  // Find closest Radix color
  let closestPaletteName = 'indigo';
  let closestShade = '9';
  let closestDistance = Infinity;
  
  // Get all palette names
  const paletteNames = getRadixPaletteNames();
  
  // Compare with each palette color
  paletteNames.forEach(paletteName => {
    for (let i = 1; i <= 12; i++) {
      const shadeKey = `${paletteName}${i}`;
      const colorValue = lightColors[paletteName]?.[shadeKey];
      
      if (colorValue) {
        const hexValue = colorValue;
        const colorOklch = hexToOklch(hexValue);
        
        if (colorOklch) {
          const numericOklch = {
            l: Number(colorOklch.l),
            c: Number(colorOklch.c),
            h: Number(colorOklch.h)
          };
          
          const numericAdjusted = {
            l: Number(adjustedOklch.l),
            c: Number(adjustedOklch.c),
            h: Number(adjustedOklch.h)
          };
          
          const distance = oklchDistance(numericOklch, numericAdjusted);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPaletteName = paletteName;
            closestShade = String(i);
          }
        }
      }
    }
  });
  
  return { paletteName: closestPaletteName, shade: closestShade };
};

/**
 * Gets a color from a Radix palette by name and shade
 */
export const getRadixColor = (paletteName: string, shade: string | number, isDark: boolean = false): string => {
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) return '#000000';
  
  const shadeKey = `${paletteName}${shade}`;
  return palette[shadeKey] || '#000000';
};