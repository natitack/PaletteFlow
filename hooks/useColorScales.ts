import { useState, useEffect } from "react";
import * as lightColors from '../components/light';
import * as darkColors from '../components/dark';
import { grayPairs } from '../components/gray';

export function useColorScales(color: string) {
  const [colorScale, setColorScale] = useState(lightColors[color]);
  const [darkModeColorScale, setDarkModeColorScale] = useState(darkColors[`${color}Dark`]);
  const [grayColorScale, setGrayColorScale] = useState(lightColors[grayPairs[color] || "gray"]);
  const [darkGrayColorScale, setDarkGrayColorScale] = useState(darkColors[`${grayPairs[color]}Dark`] || "grayDark");

  useEffect(() => {
    setColorScale(lightColors[color]);
    setGrayColorScale(lightColors[grayPairs[color] || "gray"]);
    setDarkGrayColorScale(darkColors[`${grayPairs[color]}Dark`] || "grayDark");
    setDarkModeColorScale(darkColors[`${color}Dark`]);
  }, [color]);

  return { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale };
}