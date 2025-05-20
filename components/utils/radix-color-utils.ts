import * as lightColors from '../light';
import * as darkColors from '../dark';
import { grayPairs } from '../gray';
import { hexToRgb, hexToOklch, parseOklch, formatOklch, adjustOklch, oklchDistance } from './oklch-color-utils';

/**
 * Gets all available Radix color palette names
 * @param isDark Whether to check dark mode palettes
 */
export const getRadixPaletteNames = (isDark: boolean = false): string[] => {
  const colorSet = isDark ? darkColors : lightColors;
  return Object.keys(colorSet)
    .filter(name => 
      !name.includes('A') && 
      !name.includes('P3') && 
      typeof colorSet[name] === 'object'
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
  
  if (!palette) {
    console.warn(`Palette ${paletteName} not found in ${isDark ? 'dark' : 'light'} mode`);
    return '#000000';
  }
  
  const shadeKey = `${paletteName}${shade}`;
  if (!palette[shadeKey]) {
    console.warn(`Shade ${shadeKey} not found in palette ${paletteName}`);
    return palette[`${paletteName}9`] || '#000000';
  }
  
  return palette[shadeKey];
};

/**
 * Gets a representative color from the middle of a palette
 */
export const getPaletteColor = (paletteName: string, isDark: boolean = false): string => {
  if (!paletteName) return '#000000';
  
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) {
    console.warn(`Palette ${paletteName} not found in ${isDark ? 'dark' : 'light'} mode`);
    return '#000000';
  }
  
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
 * Builds a full color scale using Radix UI colors
 */
export const buildColorScale = (paletteName: string, isDark: boolean = false): Record<string, string> => {
  const colorSet = isDark ? darkColors : lightColors;
  const palette = colorSet[paletteName];
  
  if (!palette) {
    console.warn(`Palette ${paletteName} not found in ${isDark ? 'dark' : 'light'} mode`);
    return {};
  }
  
  const scale = {};
  
  // Iterate through the palette and extract colors
  for (let i = 1; i <= 12; i++) {
    const shadeKey = `${paletteName}${i}`;
    if (palette[shadeKey]) {
      scale[i] = palette[shadeKey]; // Use numeric keys for easier access
      scale[shadeKey] = palette[shadeKey]; // Also keep the original key format
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
 * @param color The hex color to match
 * @param isDark Whether to search in dark mode palettes
 */
export const findClosestRadixPalette = (color: string, isDark: boolean = false): string => {
  if (!color) return 'indigo';
  
  // Convert input color to OKLCH for better perceptual comparison
  const inputOklch = hexToOklch(color);
  if (!inputOklch) return 'indigo';
  
  // Parse OKLCH values to numbers
  const inputColor = {
    l: Number(inputOklch.l),
    c: Number(inputOklch.c),
    h: Number(inputOklch.h)
  };
  
  let minAvgDistance = Infinity;
  let closestPaletteName = 'indigo'; // Default fallback

  // Get all palette names for the specified mode
  const paletteNames = getRadixPaletteNames(isDark);
  const colorSet = isDark ? darkColors : lightColors;

  // For each palette, check multiple shades (not just the middle one)
  paletteNames.forEach(paletteName => {
    const palette = colorSet[paletteName];
    if (!palette) return;
    
    let totalDistance = 0;
    let countValidShades = 0;
    
    // Sample multiple shades across the palette (1, 5, 9, 12) to better represent the palette
    const shadesToCheck = [1, 5, 9, 12];
    
    shadesToCheck.forEach(shade => {
      const shadeKey = `${paletteName}${shade}`;
      const shadeColor = palette[shadeKey];
      
      if (shadeColor) {
        const shadeOklch = hexToOklch(shadeColor);
        
        if (shadeOklch) {
          const numericShadeOklch = {
            l: Number(shadeOklch.l),
            c: Number(shadeOklch.c),
            h: Number(shadeOklch.h)
          };
          
          // Calculate perceptual distance using OKLCH
          const distance = oklchDistance(inputColor, numericShadeOklch);
          
          // For very light/dark colors, reduce the importance of lightness
          // and focus more on hue and chroma
          let adjustedDistance = distance;
          
          // Adjust distance calculation for very light or very dark colors
          if (inputColor.l > 0.9 || inputColor.l < 0.1) {
            // For very light/dark colors, hue and chroma matter more than lightness
            const hueChromeDistance = Math.sqrt(
              Math.pow(Math.sin(inputColor.h * Math.PI / 180) * inputColor.c - 
                      Math.sin(numericShadeOklch.h * Math.PI / 180) * numericShadeOklch.c, 2) +
              Math.pow(Math.cos(inputColor.h * Math.PI / 180) * inputColor.c - 
                      Math.cos(numericShadeOklch.h * Math.PI / 180) * numericShadeOklch.c, 2)
            );
            
            // Weight lightness less for very light/dark colors
            adjustedDistance = (hueChromeDistance * 0.8) + (Math.abs(inputColor.l - numericShadeOklch.l) * 0.2);
          }
          
          totalDistance += adjustedDistance;
          countValidShades++;
        }
      }
    });
    
    // Calculate average distance across all checked shades
    if (countValidShades > 0) {
      const avgDistance = totalDistance / countValidShades;
      
      if (avgDistance < minAvgDistance) {
        minAvgDistance = avgDistance;
        closestPaletteName = paletteName;
      }
    }
  });

  return closestPaletteName;
};

/**
 * Gets a color from a Radix palette by name and shade
 */
export const getRadixColor = (paletteName: string, shade: string | number, isDark: boolean = false): string => {
  return getRadixColorShade(paletteName, shade, isDark);
};

