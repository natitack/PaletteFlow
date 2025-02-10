import React, { useState, useMemo } from 'react';
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

export const ColorPalette = () => {
  const [color, setColor] = useState('#000000');

  const { lightPalette, darkPalette, paletteName } = useMemo(() => {
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

    return {
      lightPalette: lightColors[closestPaletteName],
      darkPalette: darkColors[`${closestPaletteName}Dark`],
      paletteName: closestPaletteName
    };
  }, [color]);

  const renderPalette = (palette: Record<string, string>, title: string) => {
    if (!palette) return null;

    const swatches = Object.entries(palette).filter(
      ([key]) => !key.includes('A') && !key.includes('P3')
    );

    return (
      <div>
        <h3>{title}</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {swatches.map(([shade, color]) => (
            <div key={shade} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: color 
              }} />
              <span style={{ fontSize: '12px' }}>{shade}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div
        style={{ 
          width: '100px', 
          height: '100px', 
          backgroundColor: color 
        }}
        onClick={() => {
          const newColor = prompt('Enter a hex color (e.g., #FF0000)');
          if (newColor) {
            setColor(newColor);
          }
        }}
      />
      <p>{color}</p>

      {paletteName && (
        <div>
          <h2>Matching Palette: {paletteName}</h2>
          {renderPalette(lightPalette, 'Light Variant')}
          {renderPalette(darkPalette, 'Dark Variant')}
        </div>
      )}
    </div>
  );
};

export default ColorPalette;