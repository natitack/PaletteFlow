"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Button, Text, Box  } from "@radix-ui/themes";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useChoices } from "../context/ChoicesContext";
import { RelumeHeroWrapper } from "../components/heroelements/RelumeHeroWrapper"
import { RelumeFeatureWrapper } from "../components/featureelelemts/RelumeFeatureWrapper"
import { useColorScales } from "../hooks/useColorScales"

// Mood options
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

// Mood descriptions
const moodDescriptions: Record<string, string> = {
  caregiver: "Caregiver brands provide support, care, and protection. They are compassionate, nurturing, and dedicated to helping others.",
  creator: "Creator brands foster innovation, creativity, and expression. They are imaginative, artistic, and driven by the desire to create something new.",
  ruler: "Ruler brands emphasize control, order, and leadership. They are authoritative, responsible, and driven by a desire to create stability and structure.",
  innocent: "Innocent brands seek happiness, simplicity, and optimism. They are pure, optimistic, and believe in the goodness of people and life.",
  sage: "TODO",
  explorer: "Explorer brands emphasize freedom, adventure, and self-discovery. They seek new experiences and are driven by a desire to explore uncharted territories.",
  hero: "Hero brands strive for courage, achievement, and transformation. They are determined, brave, and driven to improve the world through their actions.",
  outlaw: "Outlaw brands challenge the status quo and embrace rebellion. They are disruptive, revolutionary, and seek to change the world by breaking the rules.",
  magician: "Magician brands create transformation and bring visions to life. They are visionary, charismatic, and skilled at making dreams a reality.",
  everyman: "Everyman brands seek connection, belonging, and commonality. They are relatable, friendly, and aim to make everyone feel included.",
  lover: "Lover brands value passion, intimacy, and emotional connection. They are driven by a desire to create relationships and experiences that are deeply meaningful.",
  jester: "Jester brands bring joy, humor, and light-heartedness. They are playful, witty, and enjoy entertaining others.",
};

// Utility to pick correct article
function getIndefiniteArticle(word: string): string {
  const vowels = ["a", "e", "i", "o", "u"];
  return vowels.includes(word[0].toLowerCase()) ? "an" : "a";
}

// Deliverable
export default function Deliverable() {
  const router = useRouter();
  const [canAccess, setCanAccess] = useState(false);
  const { choices, updateChoice } = useChoices();
  const targetRef = useRef<HTMLDivElement>(null);

  // Modified Const  
  const { colorScale } = useColorScales(choices.color)

  useEffect(() => {
    const isComplete = localStorage.getItem("brandBuilderComplete");
    const choices = localStorage.getItem("choices");

    if (!isComplete) {
      router.push("/brand-builder");
    } else {
      setCanAccess(true);
      if (choices) {
        const parsedChoices = JSON.parse(choices);
        if (!parsedChoices.mood) {
          parsedChoices.mood = "caregiver";
        }
        updateChoice(parsedChoices);
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
    moodOptions.find((option) => option.value === choices.mood)?.label || "Caregiver";
  const article = getIndefiniteArticle(moodLabel);
  const heading = `You are ${article} ${moodLabel}`;
  const description = moodDescriptions[choices.mood] ||
    "This archetype reflects your brand's values, tone, and energy. Use this guide to build a consistent identity.";
  const buttonRadius = choices.buttonStyle || "medium"

  return (
    <div className={`bg-white text-gray-900 ${choices.font || ''}`} ref={targetRef}>
      {/* Header */}
      <header className="p-6 border-b flex justify-between items-center">
        <Text size="6" weight="bold">
          Brand Style Guide
        </Text>
        <Button onClick={exportPDF} radius={buttonRadius} className={choices.font}>
          Export PDF
        </Button>
      </header>

      {/* Deliverable Content */}
      <main className="p-8">

        {/* Hero Section */}
        <Box>
          <RelumeHeroWrapper
          layout={choices.heroLayout}
          choices={{ ...choices, colorScale, heading, description }}
          />
        </Box>

        {/* Feature Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <RelumeFeatureWrapper layout={choices.featureLayout} choices={{ ...choices, colorScale }} />
        </Box>
      </main>
    </div>
  );
}