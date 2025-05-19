import * as lightColors from '../light';

/**
 * Converts a hex color code to RGB values
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
export const findClosestRadixPalette = (color: string) => {
  let closestDistance = Infinity;
  let closestPaletteName = '';

  Object.entries(lightColors).forEach(([name, palette]) => {
    if (name.includes('A') || name.includes('P3')) return;

    Object.entries(palette).forEach(([_, paletteColor]) => {
      const distance = getColorDistance(color, paletteColor as string);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPaletteName = name;
      }
    });
  });

  return closestPaletteName;
};

/**
 * Gets a representative color from the middle of a palette
 */
export const getPaletteColor = (paletteName: string): string => {
  if (!paletteName || !lightColors[paletteName]) return '#000000';
  const colors = Object.values(lightColors[paletteName]) as string[];
  return colors[Math.floor(colors.length / 2)] || colors[0] || '#000000';
};