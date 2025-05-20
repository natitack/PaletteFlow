import { Header1 } from "./Header1";
import { Header2 } from "./Header2";
import { Header5 } from "./Header5";
import { Header26 } from "./Header26";
import { Header11 } from "./Header11";
import { useChoices } from "../../context/ChoicesContext";
import { themeColors } from '../tailwindcolors';

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

    const SelectedHero = heroLayouts[choices.heroLayout as keyof typeof heroLayouts] || Header1;

    const {
      color = "indigo",
      buttonStyle = "full",
      buttons = [],
      colorScale = {},
      tailwindColor = "indigo",
      brandNumber = "500",
    } = choices || {};

    // Define Tailwind classes for button radius
    const buttonRadiusClasses = {
      none: "rounded-none",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
      full: "rounded-full",
    };

    // Get colors from tailwind theme based on the selected tailwindColor and brandNumber
    const getPrimaryColor = () => {
      // Try to get the selected tailwind color and shade
      if (tailwindColor && brandNumber && themeColors[tailwindColor]?.[brandNumber]) {
        return themeColors[tailwindColor][brandNumber];
      }
      // Fallback to indigo-600 if the selected color is not available
      return themeColors.indigo["600"];
    };

    // Get accent color (darker shade for borders, etc.)
    const getAccentColor = () => {
      // Try to get a darker shade (700) of the selected tailwind color
      const accentShade = parseInt(brandNumber) < 700 ? "700" : brandNumber;
      if (tailwindColor && themeColors[tailwindColor]?.[accentShade]) {
        return themeColors[tailwindColor][accentShade];
      }
      // Fallback to indigo-700
      return themeColors.indigo["700"];
    };

    // Get text color for buttons (white for dark backgrounds, color for light backgrounds)
    const getButtonTextColor = () => {
      // Determine if the background is dark (lower lightness in OKLCH)
      // This is a simplification - for a complete solution, 
      // you'd want to extract the lightness from OKLCH and compare
      const shade = parseInt(brandNumber);
      return shade >= 500 ? "white" : themeColors[tailwindColor]["900"] || "#1e1b4b";
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