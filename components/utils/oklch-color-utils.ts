import { themeColors } from '../tailwindcolors';

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
 * This is a simplified conversion that approximates the OKLCH values
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
 * Parses an OKLCH string into its component values
 */
export const parseOklch = (oklchStr: string) => {
  // Handle string format: "oklch(0.637 0.237 25.331)"
  const match = /oklch\(([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\)/.exec(oklchStr);
  if (match) {
    return {
      l: parseFloat(match[1]),
      c: parseFloat(match[2]),
      h: parseFloat(match[3])
    };
  }
  return null;
};

/**
 * Create an OKLCH string from component values
 */
export const formatOklch = (l: number | string, c: number | string, h: number | string) => {
  return `oklch(${l} ${c} ${h})`;
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
 * Finds the closest Tailwind color to an OKLCH color
 */
export const findClosestTailwindColor = (oklch: { l: number, c: number, h: number }) => {
  let closestDistance = Infinity;
  let closestColorName = '';
  let closestShade = '';

  // Iterate through all Tailwind colors
  Object.entries(themeColors).forEach(([colorName, colorShades]) => {
    // Skip black and white
    if (colorName === 'black' || colorName === 'white') return;

    // Check each shade
    Object.entries(colorShades).forEach(([shade, colorValue]) => {
      const tailwindOklch = parseOklch(colorValue as string);
      if (tailwindOklch) {
        const distance = oklchDistance(oklch, tailwindOklch);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestColorName = colorName;
          closestShade = shade;
        }
      }
    });
  });

  return {
    colorName: closestColorName,
    shade: closestShade
  };
};