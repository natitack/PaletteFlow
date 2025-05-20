"use client";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useChoices } from "../context/ChoicesContext";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import * as lightColors from '../components/light';
import * as darkColors from '../components/dark';
import { getRadixColor, getGrayPair } from '../components/utils/radix-color-utils';

const Deliverable = () => {
  const targetRef = useRef(null);
  const { choices, setAllChoices } = useChoices();
  const [hydrated, setHydrated] = useState(false);

  // Sync choices from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brandChoices");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAllChoices(parsed);
      }
      setHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For debugging - this will help you see what's actually in the choices object
  useEffect(() => {
    if (hydrated) {
      console.log("Current choices:", choices);
    }
  }, [choices, hydrated]);

  if (!hydrated) {
    // Optionally, show a loading spinner here
    return <div>Loading...</div>;
  }

  const exportPDF = async () => {
    const element = targetRef.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "letter");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = (pdf.internal.pageSize.getWidth());
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 5, 0, (pdfWidth - 10), (pdfHeight - 10));

    // If the content is taller than the page, add a second page and continue
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
      let position = pdf.internal.pageSize.getHeight();
      while (position < pdfHeight) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        5,
        -position,
        (pdfWidth - 10),
        (pdfHeight - 10)
      );
      position += pdf.internal.pageSize.getHeight();
      }
    }
    pdf.save("paletteflow-deliverable.pdf");
  };

  // Get color from Radix palette
  const getColor = (paletteName, shade, isDark = false) => {
    return getRadixColor(paletteName, shade, isDark);
  };

  // Generate color shades using the Radix color system
  const generateColorShades = (paletteName, labelPrefix = "Shade", isDark = false) => {
    // Use standard shade values
    const shades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    
    return shades.map((shade) => {
      return {
        value: getColor(paletteName, shade, isDark),
        label: `${labelPrefix} ${shade}`
      };
    });
  };

  // Use choices from context for colors
  const colorPalette = choices.color || "indigo";
  const colorShade = choices.shade || "9";
  const primaryColorValue = getColor(colorPalette, colorShade);

  // Create shade palettes using Radix color system
  const primaryColorShades = generateColorShades(colorPalette, "Primary");
  
  // Get the appropriate gray palette based on the color
  const grayPalette = getGrayPair(colorPalette);
  const secondaryColorShades = generateColorShades(grayPalette, "Secondary");

  // Font should be derived from choices
  const fontClass = choices.font?.value || "system-ui";
  const fontLabel = choices.font?.label || "System UI";


  // Map buttonStyle string to allowed radius values
  const buttonRadiusMap: { [key: string]: "small" | "none" | "medium" | "large" | "full" } = {
    "None": "none",
    "Small": "small",
    "Medium": "medium",
    "Large": "large",
    "Full": "full",
    "Rounded": "large", // fallback for "Rounded"
  };
  const buttonRadius =
    buttonRadiusMap[choices.buttonStyle as string] || "large";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div
        className={`bg-white text-gray-900 min-h-screen ${fontClass} m-4`}
        ref={targetRef}
        style={{ width: "816px" }} // 8.5in * 96dpi = 816px (letter paper width)
      >
        {/* Header with export button */}
        <header className="p-6 border-b flex justify-between items-center">
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full mr-3"
              style={{ backgroundColor: primaryColorValue }}
            ></div>
            <h1 className="text-3xl font-bold">Brand Style Guide</h1>
          </div>
          <Button
            onClick={exportPDF}
            radius={buttonRadius}
            className={fontClass}
          >
            Export PDF
          </Button>
        </header>

        <main className="p-8 max-w-6xl mx-auto">
          {/* Main Colors section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Logo</h2>
            <div className="flex gap-4">
              <div
                className="w-48 h-32 flex items-center justify-center rounded-md"
                style={{ backgroundColor: primaryColorValue }}
              >
                <span className="text-white font-bold text-xl">
                  {colorPalette} {colorShade}
                </span>
              </div>
              <div className="w-48 h-32 flex items-center justify-center rounded-md bg-gray-900">
                <span className="text-white font-bold text-xl">
                  {colorPalette} {colorShade}
                </span>
              </div>
              <div className="w-48 h-32 flex items-center justify-center rounded-md bg-gray-100 border">
                <span className="text-gray-900 font-bold text-xl">
                  {colorPalette} {colorShade}
                </span>
              </div>
            </div>
          </section>
        </main>

        {/* Typography section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Typography</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">{fontLabel}</h3>
              <p className="text-sm text-gray-600 mb-4">Primary Font</p>
              <div className="text-5xl mb-4">AaBbCcDdEe</div>
            </div>

            <div className="bg-gray-900 text-white p-4 rounded-md">
              <h3 className="text-lg font-medium mb-2">{fontLabel}</h3>
              <p className="text-sm text-gray-400 mb-4">Secondary Font</p>
              <div className="text-6xl">Aa</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Font Weights</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg mb-2">{fontLabel}</h4>
                <ul className="space-y-2">
                  <li>Extra Light</li>
                  <li>Light</li>
                  <li>Regular</li>
                  <li>Medium</li>
                  <li>Semi Bold</li>
                  <li>Bold</li>
                  <li>Extra Bold</li>
                  <li>Black</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg mb-2">{fontLabel}</h4>
                <ul className="space-y-2">
                  <li>Thin</li>
                  <li>ExtraLight</li>
                  <li>Light</li>
                  <li>Regular</li>
                  <li>Medium</li>
                  <li>Semi Bold</li>
                  <li className="font-bold">Bold</li>
                  <li className="font-bold">Extra Bold</li>
                  <li className="font-black">Black</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Color Palette section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Color Palette</h2>

          {/* Primary color palette */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Primary Colors</h3>
            <div className="flex flex-wrap gap-1">
              {primaryColorShades.map((shade, index) => (
                <div key={`primary-${index}`} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-md border border-gray-200"
                    style={{
                      backgroundColor: shade.value,
                    }}
                  ></div>
                  <span className="text-xs mt-1">{shade.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary color palette */}
          <div>
            <h3 className="text-lg font-medium mb-4">Secondary Colors</h3>
            <div className="flex flex-wrap gap-1">
              {secondaryColorShades.map((shade, index) => (
                <div key={`secondary-${index}`} className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-md border border-gray-200"
                    style={{
                      backgroundColor: shade.value,
                    }}
                  ></div>
                  <span className="text-xs mt-1">{shade.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Attributes section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Brand Attributes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Brand Mood</h3>
              <p className="text-lg">{choices.mood || "Adventurous & Welcoming"}</p>
              <p className="mt-2 text-gray-600">
                The brand conveys a sense of exploration while maintaining a
                friendly, approachable stance. It balances bold visuals with
                trustworthy messaging.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Brand Values</h3>
              <ul className="space-y-2">
                <li>• Innovation without compromising tradition</li>
                <li>• Environmental stewardship</li>
                <li>• Community-focused development</li>
                <li>• Authentic storytelling</li>
              </ul>
            </div>
          </div>
        </section>

        {/* UI Elements section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">UI Elements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Button Style</h3>
              <p className="mb-4">Style: {choices.buttonStyle || "Rounded"}</p>

              <div className="space-y-3">
                <button
                  className="px-4 py-2 text-white rounded-md w-32"
                  style={{ backgroundColor: primaryColorValue }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 border rounded-md w-32"
                  style={{
                    borderColor: primaryColorValue,
                    color: primaryColorValue
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 underline w-32"
                  style={{ color: primaryColorValue }}
                >
                  Tertiary
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Card Style</h3>
              <p className="mb-4">Style: {choices.cardStyle || "Rounded with subtle shadow"}</p>

              <div className="bg-white border rounded-md shadow-sm p-4">
                <h4 className="font-bold mb-2">Sample Card</h4>
                <p className="text-sm text-gray-600">
                  This card demonstrates the standard styling for content
                  containers across the brand's digital products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Layouts section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Layouts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Hero Layout</h3>
              <p className="mb-2">{choices.heroLayout || "Centered with overlay text"}</p>

              <div className="relative h-48 rounded-md overflow-hidden bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">Hero Title</h3>
                    <p className="text-sm">Supporting headline text</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Feature Layout</h3>
              <p className="mb-2">{choices.featureLayout || "Grid with 3-column layout"}</p>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 p-2 rounded-md aspect-square flex items-center justify-center">
                  1
                </div>
                <div className="bg-gray-200 p-2 rounded-md aspect-square flex items-center justify-center">
                  2
                </div>
                <div className="bg-gray-300 p-2 rounded-md aspect-square flex items-center justify-center">
                  3
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Information Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Color Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Primary Color</h3>
              <p className="text-lg">Palette: {colorPalette}</p>
              <p className="text-lg">Shade: {colorShade}</p>
              <p className="text-lg">Value: {primaryColorValue}</p>
              <div
                className="h-24 w-48 mt-2 rounded-md"
                style={{ backgroundColor: primaryColorValue }}
              ></div>
              <p className="mt-2 text-gray-600">
                This color represents the brand's connection to nature and
                stability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Secondary Color</h3>
              <p className="text-lg">Palette: {grayPalette}</p>
              <p className="text-lg">Value: {getColor(grayPalette, "9")}</p>
              <div
                className="h-24 w-48 mt-2 rounded-md"
                style={{ backgroundColor: getColor(grayPalette, "9") }}
              ></div>
              <p className="mt-2 text-gray-600">
                This color complements the primary color and is used for
                supporting elements.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deliverable;