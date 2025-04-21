import { Event2 } from "./Event2";
import { Layout396 } from "./Layout396";
import { Layout398 } from "./Layout398";

// Map of available Relume feature components
const featureLayouts = {
  event2: Event2,
  layout396: Layout396,
  layout398: Layout398,
};

export function RelumeFeatureWrapper({ layout, choices }) {
    const SelectedFeature = featureLayouts[layout] || Event2;
  
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

    return <SelectedFeature {...choices} buttons={updatedButtons} />;
}