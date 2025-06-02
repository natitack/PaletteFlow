import { Header1 } from "./Header1";
import { Header2 } from "./Header2";
import { Header5 } from "./Header5";
import { Header26 } from "./Header26";
import { Header11 } from "./Header11";
import { useChoices } from "../../context/ChoicesContext";
import themeManager from "../../lib/themeManager";
import { useColorScales } from "../../hooks/useColorScales";

// Map of available Relume header components
// Displayed names for hero layouts handled in ../steps/HeroLayoutStep.tsx
const heroLayouts = {
  header1: Header1,
  header2: Header2,
  header5: Header5,
  header26: Header26,
  header11: Header11,
};

// Tailwind button radius classes
const buttonRadiusClasses = {
  none: "rounded-none",
  small: "rounded-sm",
  medium: "rounded-md",
  large: "rounded-lg",
  full: "rounded-full",
};

// Applies dynamic styles to relume buttons based on the button's variant
function getButtonStyles({ variant, color, colorScale, buttonStyle }) {
  // creates a base tailwind class to apply styling
  const className = `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`;

  // stores styling
  const style: React.CSSProperties = {
    border: `2px solid ${colorScale[`${color}11`] || "#4f46e5"}`,
  };

  // determines styling based on radix button variant
  if (variant === "primary") {
    style.backgroundColor = colorScale[`${color}9`] || "#6366f1";
    style.color = "white";
  } else if (variant === "secondary") {
    style.backgroundColor = "transparent";
    style.color = colorScale[`${color}11`] || "#4f46e5";
  }

  // return the collective style
  return {
    className,
    style,
  };
}

export function RelumeHeroWrapper() {
  const { updateChoice, choices } = useChoices();
  const { color = "indigo", buttonStyle = "full", heroLayout } = choices || {};

  // Get's the color scale, depreciated?
  const {
    colorScale,
    darkModeColorScale,
    grayColorScale,
    darkGrayColorScale,
  } = useColorScales(color);

  // retrieves the hero component from the heroLayouts mapping
  const SelectedHero = heroLayouts[heroLayout as keyof typeof heroLayouts] || Header1;

  // makes an array of buttons
  const buttons = Array.isArray(choices.buttonStyle) ? choices.buttonStyle : [];

  // Adjust button title based on its variant in relume
  const baseButtons =
    buttons.length > 0
      ? buttons
      : [
        { title: "Primary", variant: "primary" },
        { title: "Secondary", variant: "secondary" },
      ];

  // maps the buttons and applies styling to each
  const updatedButtons = baseButtons.map((button) => ({
    ...button,
    ...getButtonStyles({ ...button, color, colorScale, buttonStyle }),
  }));

  return <SelectedHero {...choices} buttons={updatedButtons} />;
}
