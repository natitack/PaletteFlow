import { Header1 } from "./Header1"
import { Header2 } from "./Header2"
import { Header5 } from "./Header5"
import { Header26 } from "./Header26"
import { Header11 } from "./Header11"

// Map of available Relume header components
const heroLayouts = {
  header1: Header1,
  header2: Header2,
  header5: Header5,
  header26: Header26,
  header11: Header11,
}

export function RelumeHeroWrapper({ layout, choices }) {
    const SelectedHero = heroLayouts[layout] || Header1
  
    const {
      color = "indigo",
      buttonStyle = "full",
      buttons = [],
    } = choices || {}
  
    // Define Tailwind classes for button styles
    const buttonRadiusClasses = {
      none: "rounded-none",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
      full: "rounded-full",
    }
  
    // Define Tailwind color classes (adjust based on the available styles)
    const buttonColorClasses = {
      indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
      blue: "bg-blue-600 text-white hover:bg-blue-700",
      gray: "bg-gray-600 text-white hover:bg-gray-700",
      red: "bg-red-600 text-white hover:bg-red-700",
      green: "bg-green-600 text-white hover:bg-green-700",
      yellow: "bg-yellow-500 text-black hover:bg-yellow-600",
    }
  
    // Ensure buttons array is valid
    const updatedButtons = buttons.length
        ? buttons.map((button) => ({
            ...button,
            ...(button.variant === "primary"
                ? {
                    className: `${buttonColorClasses[color] || "bg-indigo-600 text-white"} ${
                    buttonRadiusClasses[buttonStyle] || "rounded-md"
                    } px-4 py-2 font-semibold shadow`,
                }
                : {
                    className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"
                    } px-4 py-2 font-semibold shadow`,
                }), 
            }))
        : [
            {
                title: "Primary",
                variant: "primary",
                className: `${buttonColorClasses[color] || "bg-indigo-600 text-white"} ${
                buttonRadiusClasses[buttonStyle] || "rounded-md"
                } px-4 py-2 font-semibold shadow`,
            },
            {
                title: "Secondary",
                variant: "secondary", 
                className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"
                } px-4 py-2 font-semibold shadow`,
            },
            ]

    // TODO: Ensure input box and sign up buttons match style
  
    // Pass updated buttons with correct styles
    return <SelectedHero {...choices} buttons={updatedButtons} />
  }