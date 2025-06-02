"use client";

import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useChoices } from "../context/ChoicesContext";
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@radix-ui/themes";
import { useColorScales } from '../hooks/useColorScales';
import { getGrayPair } from '../components/utils/color-utils';

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
              style={{ backgroundColor: grayColorScaleArray[0] as string }}
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
              style={{ backgroundColor: darkGrayColorScaleArray[0] as string }}
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

        {/* Brand Attributes & UI Elements section */}
        <section className="p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Brand Attributes & UI Elements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Mood */}
            <div
              className="p-4 rounded-lg flex flex-col"
              style={{ backgroundColor: grayColorScaleArray[1] as string }}
            >
              <h4 className="text-base font-medium mb-1">Brand Mood</h4>
              <p className="text-base font-bold">{choices.mood || "Adventurous & Welcoming"}</p>
            </div>
            {/* Button Style */}
            <div
              className="p-4 rounded-lg flex flex-col"
              style={{ backgroundColor: grayColorScaleArray[1] as string }}
            >
              <h4 className="text-base font-medium mb-1">Button Style</h4>
              <p className="mb-2">
          Style: <span className="font-bold">{choices.buttonStyle || "Rounded"}</span>
              </p>
              <div className="flex gap-2">
          <button
            className="px-3 py-1 text-white rounded-md w-24 text-sm"
            style={{ backgroundColor: primaryColorValue as string }}
          >
            <span className={choices.buttonStyle === "Primary" ? "font-bold" : ""}>Primary</span>
          </button>
          <button
            className="px-3 py-1 border rounded-md w-24 text-sm"
            style={{
              borderColor: primaryColorValue as string,
              color: primaryColorValue as string
            }}
          >
            <span className={choices.buttonStyle === "Secondary" ? "font-bold" : ""}>Secondary</span>
          </button>
          <button
            className="px-3 py-1 underline w-24 text-sm"
            style={{ color: primaryColorValue as string }}
          >
            <span className={choices.buttonStyle === "Tertiary" ? "font-bold" : ""}>Tertiary</span>
          </button>
              </div>
            </div>
          </div>
        </section>

        {/* Layouts section */}
        <section className="p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg flex flex-col"
              style={{ backgroundColor: grayColorScaleArray[2] as string }}
            >
              <h4 className="text-base font-bold mb-2">Hero Layout </h4>
              <p className="mb-1">
          <span className="font-bold">{choices.heroLayout || "Centered with overlay text"}</span>
              </p>
              <div className="relative h-32 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          {choices.heroLayout ? (
            <img
              src={`/images/previews/hero/${choices.heroLayout}.png`}
              alt="Hero Layout Preview"
              className="object-contain h-full w-full"
            />
          ) : (
            <div className="text-center">
              <h3 className="text-lg font-bold">Hero Title</h3>
              <p className="text-xs">Supporting headline text</p>
            </div>
          )}
              </div>
            </div>
            <div
              className="p-4 rounded-lg flex flex-col"
              style={{ backgroundColor: grayColorScaleArray[2] as string }}
            >
              <h4 className="text-base font-bold mb-2">Feature Layout</h4>
              <p className="mb-1">
          <span className="font-bold">{choices.featureLayout || "Grid with 3-column layout"}</span>
              </p>
              <div className="relative h-32 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          {choices.featureLayout ? (
            <img
              src={`/images/previews/feature/${choices.featureLayout}.png`}
              alt="Feature Layout Preview"
              className="object-contain h-full w-full"
            />
          ) : (
            <div className="grid grid-cols-3 gap-1 w-full h-full">
              <div className="bg-gray-100 p-1 rounded-md aspect-square flex items-center justify-center text-xs">
                1
              </div>
              <div className="bg-gray-200 p-1 rounded-md aspect-square flex items-center justify-center text-xs">
                2
              </div>
              <div className="bg-gray-300 p-1 rounded-md aspect-square flex items-center justify-center text-xs">
                3
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deliverable;