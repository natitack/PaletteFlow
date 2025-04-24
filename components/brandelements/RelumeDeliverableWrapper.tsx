"use client";

import { Layout381, Layout381Defaults } from "./Layout381";

export function RelumeDeliverableWrapper({ choices }) {
  const {
    color = "indigo",
    buttonStyle = "full",
    font = "system-ui",
    colorScale = {},
  } = choices || {};

  const buttonRadiusClasses = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full",
  };

  const styledButtons = (buttons) =>
    buttons.map((button) => ({
      ...button,
      className: `${buttonRadiusClasses[buttonStyle] || "rounded-md"} px-4 py-2 font-semibold`,
    }));

  const formattedProps = {
    ...Layout381Defaults,
    bigCard: {
      ...Layout381Defaults.bigCard,
      buttons: styledButtons(Layout381Defaults.bigCard.buttons),
    },
    smallCard: {
      ...Layout381Defaults.smallCard,
      button: styledButtons([Layout381Defaults.smallCard.button])[0],
    },
    featureSections: Layout381Defaults.featureSections.map((f) => ({
      ...f,
      button: styledButtons([f.button])[0],
    })),
  };

  return (
    <div style={{ fontFamily: font }}>
      <Layout381 {...formattedProps} />
    </div>
  );
}
