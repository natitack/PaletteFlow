import { useState, useEffect } from 'react';
import * as lightColors from '../components/light';
import * as darkColors from '../components/dark';
import { grayPairs } from '../components/gray';
import { buildColorScale, getGrayPair } from '../components/utils/radix-color-utils';

export const useColorScales = (colorPalette: string) => {
  const [colorScale, setColorScale] = useState({});
  const [darkModeColorScale, setDarkModeColorScale] = useState({});
  const [grayColorScale, setGrayColorScale] = useState({});
  const [darkGrayColorScale, setDarkGrayColorScale] = useState({});

  useEffect(() => {
    if (!colorPalette) return;
    
    // Build light mode color scale for the selected palette
    const lightScale = buildColorScale(colorPalette, false);
    setColorScale(lightScale);
    
    // Build dark mode color scale for the selected palette
    const darkScale = buildColorScale(colorPalette, true);
    setDarkModeColorScale(darkScale);
    
    // Get the paired gray scale
    const grayPalette = getGrayPair(colorPalette);
    
    // Build light mode gray scale
    const lightGrayScale = buildColorScale(grayPalette, false);
    setGrayColorScale(lightGrayScale);
    
    // Build dark mode gray scale
    const darkGrayScale = buildColorScale(grayPalette, true);
    setDarkGrayColorScale(darkGrayScale);
    
  }, [colorPalette]);

  return {
    colorScale,
    darkModeColorScale,
    grayColorScale,
    darkGrayColorScale
  };
};