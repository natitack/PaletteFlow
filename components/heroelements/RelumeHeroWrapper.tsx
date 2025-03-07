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
  } = choices || {};

  const buttonRadiusClasses = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full",
  };

  const buttonColorClasses = {
    tomato: "bg-tomato-600 text-white hover:bg-tomato-700",
    red: "bg-red-600 text-white hover:bg-red-700",
    ruby: "bg-ruby-600 text-white hover:bg-ruby-700",
    crimson: "bg-crimson-600 text-white hover:bg-crimson-700",
    pink: "bg-pink-600 text-white hover:bg-pink-700",
    plum: "bg-plum-600 text-white hover:bg-plum-700",
    purple: "bg-purple-600 text-white hover:bg-purple-700",
    violet: "bg-violet-600 text-white hover:bg-violet-700",
    iris: "bg-iris-600 text-white hover:bg-iris-700",
    indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    sky: "bg-sky-600 text-white hover:bg-sky-700",
    cyan: "bg-cyan-600 text-white hover:bg-cyan-700",
    mint: "bg-mint-600 text-white hover:bg-mint-700",
    teal: "bg-teal-600 text-white hover:bg-teal-700",
    jade: "bg-jade-600 text-white hover:bg-jade-700",
    green: "bg-green-600 text-white hover:bg-green-700",
    grass: "bg-grass-600 text-white hover:bg-grass-700",
    lime: "bg-lime-600 text-white hover:bg-lime-700",
    yellow: "bg-yellow-500 text-black hover:bg-yellow-600",
    amber: "bg-amber-600 text-white hover:bg-amber-700",
    orange: "bg-orange-600 text-white hover:bg-orange-700",
    brown: "bg-brown-600 text-white hover:bg-brown-700",
    gold: "bg-gold-600 text-black hover:bg-gold-700",
    gray: "bg-gray-600 text-white hover:bg-gray-700",  
    mauve: "bg-mauve-600 text-white hover:bg-mauve-700",
    slate: "bg-slate-600 text-white hover:bg-slate-700",
    sage: "bg-sage-600 text-white hover:bg-sage-700",
    olive: "bg-olive-600 text-white hover:bg-olive-700",
    sand: "bg-sand-600 text-white hover:bg-sand-700",
    bronze: "bg-bronze-600 text-white hover:bg-bronze-700",
  };

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
              className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
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
          className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold shadow`,
        },
      ];

  return <SelectedHero {...choices} buttons={updatedButtons} />;
}
