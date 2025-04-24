"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Text } from "@radix-ui/themes";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useColorScales } from "../hooks/useColorScales";
import { RelumeDeliverableWrapper } from "../components/brandelements/RelumeDeliverableWrapper";
import { Layout381Defaults } from "../components/brandelements/Layout381";

export default function Deliverable() {
  const router = useRouter();
  const targetRef = useRef(null);

  const [canAccess, setCanAccess] = useState(false);
  const [brandChoices, setBrandChoices] = useState({
    mood: "modern",
    color: "indigo",
    font: "system-ui",
    buttonStyle: "full",
    cardStyle: "flat",
    heroLayout: "header1",
    featureLayout: "grid",
  });

  const { colorScale } = useColorScales(brandChoices.color);

  useEffect(() => {
    const isComplete = localStorage.getItem("brandBuilderComplete");
    const choices = localStorage.getItem("brandChoices");

    if (!isComplete) {
      router.push("/brand-builder");
    } else {
      setCanAccess(true);
      if (choices) {
        setBrandChoices(JSON.parse(choices));
      }
    }
  }, []);

  if (!canAccess) return <p className="text-center mt-10">Redirecting...</p>;

  const exportPDF = async () => {
    const element = targetRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("style-guide.pdf");
  };

  const headerTagline = "Style Guide";
  const headerHeading = `Your style is ${brandChoices.mood}`;
  const headerDescription =
    "This document outlines the visual identity preferences chosen during your brand building session. It includes your mood, typography, color palette, and UI styles—all compiled for quick reference and design execution.";

  return (
    <div className="min-h-screen bg-white text-gray-900" ref={targetRef}>
      <header className="p-6 border-b flex justify-between items-center">
        <Text size="6" weight="bold">
          Brand Style Guide
        </Text>
        <Button onClick={exportPDF}>Export PDF</Button>
      </header>

      <main className="p-8">
        <RelumeDeliverableWrapper
          choices={{ ...brandChoices, colorScale }}
          override={{
            tagline: headerTagline,
            heading: headerHeading,
            description: headerDescription,
          }}
        />
      </main>
    </div>
  );
}
