"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button, Text } from "@radix-ui/themes";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Layout381, Layout381Defaults } from "../components/brand-guide-layout";

const moodOptions = [
  { value: "caregiver", label: "Caregiver" },
  { value: "creator", label: "Creator" },
  { value: "ruler", label: "Ruler" },
  { value: "innocent", label: "Innocent" },
  { value: "explorer", label: "Explorer" },
  { value: "sage", label: "Sage" },
  { value: "hero", label: "Hero" },
  { value: "outlaw", label: "Outlaw" },
];

export default function Deliverable() {
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const [brandChoices, setBrandChoices] = useState<any>({});
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isComplete = localStorage.getItem("brandBuilderComplete");
    const choices = localStorage.getItem("brandChoices");

    if (!isComplete) {
      router.push("/brand-builder");
    } else {
      setCanAccess(true);
      if (choices) {
        const parsedChoices = JSON.parse(choices);
        if (!parsedChoices.mood) {
          parsedChoices.mood = "caregiver"; // fallback
        }
        setBrandChoices(parsedChoices);
      }
    }
  }, [router]);

  const exportPDF = async () => {
    const element = targetRef.current;
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("paletteflow-deliverable.pdf");
  };

  if (!canAccess) {
    return <p className="text-center mt-10">Redirecting...</p>;
  }

  const moodLabel =
    moodOptions.find((option) => option.value === brandChoices.mood)?.label || "Caregiver";

  // Optional: Override Layout381Defaults here with brandChoices if needed

  return (
    <div className="bg-white text-gray-900" ref={targetRef}>
      {/* Header */}
      <header className="p-6 border-b flex justify-between items-center">
        <Text size="6" weight="bold">
          Brand Style Guide
        </Text>
        <Button onClick={exportPDF}>Export PDF</Button>
      </header>

      {/* Deliverable Content */}
      <main className="p-8">
        <Layout381 {...Layout381Defaults} />
      </main>
    </div>
  );
}
