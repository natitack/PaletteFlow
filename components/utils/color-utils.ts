import * as lightColors from '../light';
import * as darkColors from '../dark';
import { grayPairs } from '../gray';

/**
 * Converts a hex color to RGB
 */
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Converts RGB to OKLCH color space
 */
export const rgbToOklch = (r: number, g: number, b: number) => {
  // Normalize RGB values to 0-1
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Convert to linear RGB
  const rLinear = rNorm <= 0.04045 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gLinear = gNorm <= 0.04045 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bLinear = bNorm <= 0.04045 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  // Convert to XYZ using sRGB matrix
  const x = 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear;
  const y = 0.2126729 * rLinear + 0.7151522 * gLinear + 0.0721750 * bLinear;
  const z = 0.0193339 * rLinear + 0.1191920 * gLinear + 0.9503041 * bLinear;

  // Convert to LMS cone response
  const l = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s = 0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z;

  // Non-linear transformation
  const lp = Math.cbrt(l);
  const mp = Math.cbrt(m);
  const sp = Math.cbrt(s);

  // Convert to Oklab
  const L = 0.2104542553 * lp + 0.7936177850 * mp - 0.0040720468 * sp;
  const a = 1.9779984951 * lp - 2.4285922050 * mp + 0.4505937099 * sp;
  const bb = 0.0259040371 * lp + 0.7827717662 * mp - 0.8086757660 * sp;

  // Convert to OKLCH
  const C = Math.sqrt(a * a + bb * bb);
  const h = Math.atan2(bb, a) * 180 / Math.PI;
  const H = h < 0 ? h + 360 : h;

  return {
    l: L.toFixed(3),
    c: C.toFixed(3),
    h: H.toFixed(3)
  };
};

/**
 * Converts a hex color directly to OKLCH
 */
export const hexToOklch = (hex: string) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToOklch(rgb.r, rgb.g, rgb.b);
};

/**
 * Adjusts an OKLCH color by setting new chroma and lightness values
 */
export const adjustOklch = (oklch: { l: string | number, c: string | number, h: string | number }, 
                           newChroma: string | number, newLightness: string | number) => {
  return {
    l: typeof newLightness === 'string' ? parseFloat(newLightness) : newLightness,
    c: typeof newChroma === 'string' ? parseFloat(newChroma) : newChroma,
    h: typeof oklch.h === 'string' ? parseFloat(oklch.h) : oklch.h
  };
};

/**
 * Calculates the distance between two OKLCH colors
 */
export const oklchDistance = (color1: { l: number, c: number, h: number }, 
                             color2: { l: number, c: number, h: number }) => {
  // Calculate hue distance with proper handling of the circular nature of hue
  const dH = Math.min(Math.abs(color1.h - color2.h), 360 - Math.abs(color1.h - color2.h));
  
  // Use weighted Euclidean distance
  return Math.sqrt(
    Math.pow(color1.l - color2.l, 2) * 1.0 +   // Lightness weight
    Math.pow(color1.c - color2.c, 2) * 0.5 +   // Chroma weight
    Math.pow(dH / 360 * Math.PI * 2, 2) * 0.3  // Hue weight (normalized)
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
 * Gets a color from a Radix palette by name and shade
 */
export const getRadixColor = (paletteName: string, shade: string | number, isDark: boolean = false): string => {
  return getRadixColorShade(paletteName, shade, isDark);
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
 * Finds the closest Radix UI color palette to a given hex color
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

  const colorSet = isDark ? darkColors : lightColors;
  
  // Get all palette names for the specified mode
  const paletteNames = Object.keys(colorSet)
    .filter(name => 
      !name.includes('A') && 
      !name.includes('P3') && 
      typeof colorSet[name] === 'object'
    );

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
  const paletteNames = Object.keys(lightColors)
    .filter(name => 
      !name.includes('A') && 
      !name.includes('P3') && 
      typeof lightColors[name] === 'object'
    );
  
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