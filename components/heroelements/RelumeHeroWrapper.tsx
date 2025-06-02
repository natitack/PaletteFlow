import { Header1 } from "./Header1";
import { Header2 } from "./Header2";
import { Header5 } from "./Header5";
import { Header26 } from "./Header26";
import { Header11 } from "./Header11";
import { useChoices } from "../../context/ChoicesContext";
import { getRadixColor } from '../utils/color-utils';
import themeManager from '../../lib/themeManager';
import { useColorScales } from "../../hooks/useColorScales";


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
      const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(choices.color);
    

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


    // Ensure buttons array is valid and apply dynamic color styles
 const updatedButtons = buttons.length
        ? buttons.map((button) => ({
            ...button,
            ...(button.variant === "primary"
                ? {
                    style: {
                      backgroundColor: colorScale[`${color}9`] || "#6366f1", // Default to Indigo-600
                      color: "white",
                      border: `2px solid ${colorScale[`${color}11`] || "#4f46e5"}`,
                    },
                    className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
                }
                : {
                    style: {
                      backgroundColor: "transparent",
                      color: colorScale[`${color}11`] || "#4f46e5",
                      border: `2px solid ${colorScale[`${color}11`] || "#4f46e5"}`,
                    },
                    className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
                }), 
            }))
        : [
            {
                title: "Primary",
                variant: "primary",
                style: {
                  backgroundColor: colorScale[`${color}9`] || "#6366f1",
                  color: "white",
                  border: `2px solid ${colorScale[`${color}11`] || "#4f46e5"}`,
                },
                className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
            },
            {
                title: "Secondary",
                variant: "secondary", 
                style: {
                  backgroundColor: "transparent",
                  color: colorScale[`${color}11`] || "#4f46e5",
                  border: `2px solid ${colorScale[`${color}11`] || "#4f46e5"}`,
                },
                className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
            },
        ];

    return <SelectedHero {...choices} buttons={updatedButtons} />;
}