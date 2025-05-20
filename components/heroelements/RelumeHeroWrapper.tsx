import { Header1 } from "./Header1";
import { Header2 } from "./Header2";
import { Header5 } from "./Header5";
import { Header26 } from "./Header26";
import { Header11 } from "./Header11";
import { useChoices } from "../../context/ChoicesContext";
import { getRadixColor } from '../utils/radix-color-utils';
import themeManager from '../../lib/themeManager';

// Map of available Relume header components
const heroLayouts = {
  header1: Header1,
  header2: Header2,
  header5: Header5,
  header26: Header26,
  header11: Header11,
};

export function RelumeHeroWrapper() {
    const { updateChoice, choices } = useChoices();
    const isDarkMode = themeManager.getCurrentTheme().darkMode;

    const SelectedHero = heroLayouts[choices.heroLayout as keyof typeof heroLayouts] || Header1;

    const {
      color = "indigo",
      buttonStyle = "full",
      shade = "9",
    } = choices || {};

    // Safely get buttons array from choices, fallback to empty array if not present
    const buttons = (choices && 'buttons' in choices && Array.isArray((choices as any).buttons))
      ? (choices as any).buttons
      : [];

    // Define Tailwind classes for button radius
    const buttonRadiusClasses = {
      none: "rounded-none",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
      full: "rounded-full",
    };

    // Get primary color from Radix palettes
    const getPrimaryColor = () => {
      return getRadixColor(color, shade, isDarkMode);
    };

    // Get accent color (darker shade for borders, etc.)
    const getAccentColor = () => {
      // Try to get a deeper shade for accent
      const accentShade = Math.min(parseInt(shade) + 1, 12).toString();
      return getRadixColor(color, accentShade, isDarkMode);
    };

    // Get text color for buttons (white for dark backgrounds, color for light backgrounds)
    const getButtonTextColor = () => {
      // For Radix colors, generally shades 9+ are dark enough for white text
      // Shades 1-8 typically need dark text
      const shadeNum = parseInt(shade);
      return shadeNum >= 9 ? "white" : getRadixColor(color, "12", isDarkMode);
    };

    // Get primary and accent colors
    const primaryColor = getPrimaryColor();
    const accentColor = getAccentColor();
    const buttonTextColor = getButtonTextColor();

    // Ensure buttons array is valid and apply dynamic color styles
    const updatedButtons = buttons.length
        ? buttons.map((button) => ({
            ...button,
            ...(button.variant === "primary"
                ? {
                    style: {
                      backgroundColor: primaryColor,
                      color: buttonTextColor,
                      border: `2px solid ${accentColor}`,
                    },
                    className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
                }
                : {
                    style: {
                      backgroundColor: "transparent",
                      color: primaryColor,
                      border: `2px solid ${primaryColor}`,
                    },
                    className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
                }), 
            }))
        : [
            {
                title: "Primary",
                variant: "primary",
                style: {
                  backgroundColor: primaryColor,
                  color: buttonTextColor,
                  border: `2px solid ${accentColor}`,
                },
                className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
            },
            {
                title: "Secondary",
                variant: "secondary", 
                style: {
                  backgroundColor: "transparent",
                  color: primaryColor,
                  border: `2px solid ${primaryColor}`,
                },
                className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
            },
        ];

    return <SelectedHero {...choices} buttons={updatedButtons} />;
}