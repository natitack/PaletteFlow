import React from 'react';
import * as lightColors from './light';
import * as darkColors from './dark';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const getColorDistance = (color1: string, color2: string) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return Infinity;
  
  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );
};

export const generateColorScale = (baseColor: string) => {
  let closestDistance = Infinity;
  let closestPaletteName = '';
  let palette = [];

  // Find the closest matching palette
  Object.entries(lightColors).forEach(([name, colorPalette]) => {
    if (name.includes('A') || name.includes('P3')) return;

    Object.entries(colorPalette).forEach(([_, paletteColor]) => {
      const distance = getColorDistance(baseColor, paletteColor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPaletteName = name;
      }
    });
  });

  // Get the matching light palette
  const matchingPalette = lightColors[closestPaletteName];
  
  // Convert palette object to array of colors
  if (matchingPalette) {
    palette = Object.entries(matchingPalette)
      .filter(([key]) => !key.includes('A') && !key.includes('P3'))
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([_, color]) => color);
  }

  return palette;
};

export const ColorPalette: React.FC<{
  color: string;
  onChange: (color: string) => void;
}> = ({ color, onChange }) => {
  const palette = generateColorScale(color);

  return (
    <div>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        {palette.map((color, index) => (
          <div
            key={index}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: color,
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
    </div>
  );
};