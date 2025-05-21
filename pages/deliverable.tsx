"use client";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useChoices } from "../context/ChoicesContext";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import { useColorScales } from '../hooks/useColorScales';
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

  // Use the same color scales hook as in ColorPickerStep
  const colorPalette = choices.color || "indigo";
  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(colorPalette);

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

  // Convert color scale objects to arrays for consistent rendering
  const colorScaleArray = Object.values(colorScale);
  const darkModeColorScaleArray = Object.values(darkModeColorScale);
  const grayColorScaleArray = Object.values(grayColorScale);
  const darkGrayColorScaleArray = Object.values(darkGrayColorScale);

  // Create shade labels for the colors
  const createShadeLabels = (prefix) => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: `${prefix} ${i + 1}`
    }));
  };

  const primaryShadeLabels = createShadeLabels("Primary");
  const secondaryShadeLabels = createShadeLabels("Secondary");

  // Get color shade value based on index
  const getColorShade = (shadeIndex, colorArray) => {
    return colorArray[shadeIndex] || colorArray[8]; // Default to shade 9 (index 8)
  };

  // Use the color shade selected from choices, defaulting to 9
  const colorShade = choices.shade || '9';
  const shadeIndex = parseInt(colorShade, 10) - 1; // Convert to 0-based index

  // Get primary colors from the color scales
  const primaryColorValue = colorScaleArray[shadeIndex];
  const primaryMidColorValue = colorScaleArray[5]; // Shade 6
  const secondaryColorValue = grayColorScaleArray[shadeIndex];

  // Font should be derived from choices
  const fontClass = choices.font?.value || "system-ui";
  const fontLabel = choices.font?.label || "System UI";

  // Map buttonStyle string to allowed radius values
  const buttonRadiusMap = {
    "None": "none",
    "Small": "small",
    "Medium": "medium",
    "Large": "large",
    "Full": "full",
    "Rounded": "large", // fallback for "Rounded"
  };
  const buttonRadius =
    buttonRadiusMap[choices.buttonStyle] || "large";

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
              style={{ backgroundColor: primaryColorValue as string }}
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
          <div style={{ height: "20px" }} />

        <main className="p-8 max-w-6xl mx-auto">
          {/* Main Colors section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Brand Colors</h2>
            <div className="flex gap-2">
              <div
                className="flex-1 h-32 flex items-center justify-center rounded-md mx-0.5"
                style={{ backgroundColor: primaryColorValue as string }}
              >
                <span className="text-white font-bold text-xl">
                  {primaryColorValue as string}
                </span>
              </div>
              <div
                className="flex-1 h-32 flex items-center justify-center rounded-md mx-0.5"
                style={{ backgroundColor: primaryMidColorValue as string }}
              >
                <span className="text-white font-bold text-xl">
                  {primaryMidColorValue as string}
                </span>
              </div>
              <div
                className="flex-1 h-32 flex items-center justify-center rounded-md mx-0.5"
                style={{ backgroundColor: secondaryColorValue as string }}
              >
                <span className="text-white font-bold text-xl">
                  {secondaryColorValue as string}
                </span>
              </div>
            </div>
          </section>
        </main>



        {/* Color Palette section - Updated for better rendering within 816px width */}
        <section className="mb-12 px-4">
          <h2 className="text-2xl font-bold mb-6">Color Palette</h2>

          {/* Primary color palette */}
          <div className="mb-8">
            <h4 className="text-lg font-medium mb-4">Primary Colors</h4>
            <div className="grid grid-cols-12 gap-1 mb-1">
              {/* Shade numbers row */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={`shade-${i + 1}`} className="flex justify-center">
                  <span className="text-xs font-medium">{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Light colors row */}
            <div className="flex items-center mb-2">
              <div className="w-16 pr-2">
                <span className="text-xs font-medium">Light</span>
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {colorScaleArray.map((color, index) => (
                  <div
                    key={`primary-${index}`}
                    className="aspect-square rounded-md"
                    style={{
                      backgroundColor: color as string,
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Dark colors row */}
            <div className="flex items-center">
              <div className="w-16 pr-2">
                <span className="text-xs font-medium">Dark</span>
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {darkModeColorScaleArray.map((color, index) => (
                  <div
                    key={`dark-primary-${index}`}
                    className="aspect-square rounded-md"
                    style={{
                      backgroundColor: color as string,
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary color palette */}
          <div>
            <h4 className="text-lg font-medium mb-4">Secondary Colors</h4>
            <div className="grid grid-cols-12 gap-1 mb-1">
              {/* Shade numbers row */}
              {Array.from({ length: 12 }, (_, i) => (
                <div key={`sec-shade-${i + 1}`} className="flex justify-center">
                  <span className="text-xs font-medium">{i + 1}</span>
                </div>
              ))}
            </div>

            {/* Light colors row */}
            <div className="flex items-center mb-2">
              <div className="w-16 pr-2">
                <span className="text-xs font-medium">Light</span>
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {grayColorScaleArray.map((color, index) => (
                  <div
                    key={`secondary-${index}`}
                    className="aspect-square rounded-md"
                    style={{
                      backgroundColor: color as string,
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Dark colors row */}
            <div className="flex items-center">
              <div className="w-16 pr-2">
                <span className="text-xs font-medium">Dark</span>
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {darkGrayColorScaleArray.map((color, index) => (
                  <div
                    key={`dark-secondary-${index}`}
                    className="aspect-square rounded-md"
                    style={{
                      backgroundColor: color as string,
                      width: '100%',
                      paddingBottom: '100%',
                      position: 'relative'
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Add significant vertical space between sections */}
        <div style={{ height: "120px" }} />
        {/* Typography section */}
        <section className="p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Typography</h2>

          {/* Font display cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary font card */}
            <div
              className="p-6 rounded-lg flex flex-col"
              style={{ backgroundColor: grayColorScaleArray[0] as string}}
            >
              <div className="mb-1">
                <h3 className="text-lg font-medium">{fontLabel}</h3>
                <p className="text-sm text-gray-600">Primary Font</p>
              </div>
              <div className="text-5xl mt-auto">AaBbCcDdEe</div>
            </div>

            {/* Secondary font card */}
            <div
              className="p-6 rounded-lg flex flex-col text-white"
              style={{ backgroundColor: darkGrayColorScaleArray[0]  as string}}
            >
              <div className="mb-1">
                <h3 className="text-lg font-medium">{fontLabel}</h3>
                <p className="text-sm text-gray-400">Secondary Font</p>
              </div>
              <div className="text-6xl mt-auto">Aa</div>
            </div>
          </div>

          {/* Font weights */}
          <div className="mt-8">
            <h4 className="text-xl font-bold mb-4">Font Weights</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="font-thin">Thin</div>
              <div className="font-extralight">ExtraLight</div>
              <div className="font-light">Light</div>
              <div className="font-normal">Regular</div>
              <div className="font-semibold">Semi Bold</div>
              <div className="font-bold">Bold</div>
              <div className="font-extrabold">Extra Bold</div>
              <div className="font-black">Black</div>
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
                  style={{ backgroundColor: primaryColorValue as string }}
                >
                  Primary
                </button>
                <button
                  className="px-4 py-2 border rounded-md w-32"
                  style={{
                    borderColor: primaryColorValue as string,
                    color: primaryColorValue as string
                  }}
                >
                  Secondary
                </button>
                <button
                  className="px-4 py-2 underline w-32"
                  style={{ color: primaryColorValue as string }}
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

        {/* Color Information Section - Updated to use colorScaleArrays */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Color Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Primary Color</h3>
              <p className="text-lg">Palette: {colorPalette}</p>
              <p className="text-lg">Shade: {colorShade}</p>
              <p className="text-lg">Value: {primaryColorValue as string}</p>
              <div
                className="h-24 w-48 mt-2 rounded-md"
                style={{ backgroundColor: primaryColorValue as string }}
              ></div>
              <p className="mt-2 text-gray-600">
                This color represents the brand's connection to nature and
                stability.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Secondary Color</h3>
              <p className="text-lg">Palette: {getGrayPair(colorPalette)}</p>
              <p className="text-lg">Value: {secondaryColorValue as string}</p>
              <div
                className="h-24 w-48 mt-2 rounded-md"
                style={{ backgroundColor: secondaryColorValue as string }}
              ></div>
              <p className="mt-2 text-gray-600">
                This color complements the primary color and is used for
                supporting elements.
              </p>
            </div>
          </div>
        </section>

        {/* Empty section to replace the removed Dark Mode Colors section */}
      </div>
    </div>
  );
};

export default Deliverable;