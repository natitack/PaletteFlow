import { Header1 } from "./Header1";
import { Header2 } from "./Header2";
import { Header5 } from "./Header5";
import { Header26 } from "./Header26";
import { Header11 } from "./Header11";

// Map of available Relume header components
const heroLayouts = {
  header1: Header1,
  header2: Header2,
  header5: Header5,
  header26: Header26,
  header11: Header11,
};

export function RelumeHeroWrapper({ layout, choices }) {
    const SelectedHero = heroLayouts[layout] || Header1;
  
    const {
      color = "indigo",
      buttonStyle = "full",
      buttons = [],
      colorScale = {},
    } = choices || {};

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