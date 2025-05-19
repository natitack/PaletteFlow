"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/router"

import { ColorPickerStep } from "../components/steps/ColorPickerStep"
import { MoodStep } from "../components/steps/MoodStep"
import { FontStep } from "../components/steps/FontStep"
import { ButtonStyleStep } from "../components/steps/ButtonStyleStep"
import { CardStyleStep } from "../components/steps/CardStyleStep"
import { HeroLayoutStep } from "../components/steps/HeroLayoutStep"
import { FeatureLayoutStep } from "../components/steps/FeatureLayoutStep"

import { LivePreview } from "../components/live-preview"
import { Button, Flex, Text } from "@radix-ui/themes"
import { motion, AnimatePresence } from "framer-motion"

import { useColorScales } from "../hooks/useColorScales";
import themeManager from '../lib/themeManager';
import { useChoices } from "../context/ChoicesContext";


import { themeColors } from '../components/tailwindcolors';

const STEPS = [
  { id: "color", component: ColorPickerStep, title: "Color Palette" },
  { id: "mood", component: MoodStep, title: "Brand Personality" },
  { id: "heroLayout", component: HeroLayoutStep, title: "Hero Layout" },
  { id: "featureLayout", component: FeatureLayoutStep, title: "Feature Layout" },
  { id: "font", component: FontStep, title: "Font Style" },
  { id: "buttonStyle", component: ButtonStyleStep, title: "Button Style" },
  { id: "cardStyle", component: CardStyleStep, title: "Card Style" },
]

export default function BrandBuilder() {
  const { choices, updateChoice } = useChoices();
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(choices.color);

  const CurrentStepComponent = STEPS[currentStep].component
  const currentStepId = STEPS[currentStep].id

  // Get colors from tailwind theme based on the selected tailwindColor and brandNumber
  const getTailwindColor = (shade) => {
    const { tailwindColor = "indigo", brandNumber = "500" } = choices;
    
    // Try to get the selected tailwind color and the requested shade
    if (tailwindColor && themeColors[tailwindColor]?.[shade]) {
      return themeColors[tailwindColor][shade];
    }
    
    // Fallback to the same color family but with default shade if the specific shade doesn't exist
    if (tailwindColor && themeColors[tailwindColor]?.[brandNumber]) {
      return themeColors[tailwindColor][brandNumber];
    }
    
    // Final fallback to indigo
    return themeColors.indigo[shade] || themeColors.indigo["500"];
  };

  // Get the appropriate background color using tailwind colors
  const getBackgroundColor = () => {
    // Use a very light shade (50 or 100) for the background
    const bgShade = themeManager.getCurrentTheme().darkMode ? "900" : "50";
    return getTailwindColor(bgShade);
  };

  // Get the appropriate progress bar color
  const getProgressBarColor = () => {
    // Use a medium-bright shade for the progress bar
    const barShade = themeManager.getCurrentTheme().darkMode ? "400" : "600";
    return getTailwindColor(barShade);
  };

  // Handle button styling with tailwind colors
  const getButtonStyle = (isPrimary) => {
    const { buttonStyle = "full" } = choices;
    
    // Define Tailwind classes for button radius
    const buttonRadiusClasses = {
      none: "rounded-none",
      small: "rounded-sm",
      medium: "rounded-md",
      large: "rounded-lg",
      full: "rounded-full",
    };
    
    const radiusClass = buttonRadiusClasses[buttonStyle] || "rounded-md";
    
    if (isPrimary) {
      return {
        style: {
          backgroundColor: getTailwindColor("600"),
          color: "white",
          border: `2px solid ${getTailwindColor("700")}`,
        },
        className: `${radiusClass} px-4 py-2 font-semibold shadow`
      };
    } else {
      return {
        style: {
          backgroundColor: "transparent",
          color: getTailwindColor("600"),
          border: `2px solid ${getTailwindColor("600")}`,
        },
        className: `${radiusClass} px-4 py-2 font-semibold`
      };
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Mark as completed
      localStorage.setItem("brandBuilderComplete", "true");
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = () => {
    // Mark as completed
    localStorage.setItem("brandBuilderComplete", "true")

    // Navigate to deliverable
    router.push("/deliverable")
  }

  // Get button styles
  const nextButtonStyle = getButtonStyle(true);
  const prevButtonStyle = getButtonStyle(true);

  return (
    <Flex 
      direction="column" 
      gap="4" 
      className="min-h-screen p-8" 
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="h-1 w-full rounded-full overflow-hidden bg-gray-200">
        <div
          className="h-full transition-all duration-300 ease-in-out"
          style={{ 
            backgroundColor: getProgressBarColor(),
            width: `${((currentStep + 1) / STEPS.length) * 100}%`,
          }}
        />
      </div>

      <Text 
        size="5" 
        weight="bold"
        style={{ color: themeManager.getCurrentTheme().darkMode ? "#ffffff" : getTailwindColor("900") }}
      >
        Step {currentStep + 1}: {STEPS[currentStep].title}
      </Text>

      <Flex gap="8">
        <Flex direction="column" className="w-1/4">
          <Flex gap="4"></Flex>
          <Flex justify="between" mt="4" mb="5">
            <Button 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              style={prevButtonStyle.style}
              className={prevButtonStyle.className}
            >
              Previous
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
              <Button 
                onClick={handleFinish}
                style={nextButtonStyle.style}
                className={nextButtonStyle.className}
              >
                Finish
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                style={nextButtonStyle.style}
                className={nextButtonStyle.className}
              >
                Next
              </Button>
            )}
          </Flex>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                value={choices[currentStepId]}
                onChange={(value: string) => updateChoice(currentStepId, value)}
              />
            </motion.div>
          </AnimatePresence>
        </Flex>

        <div className="w-3/4">
          <LivePreview />
        </div>
      </Flex>
    </Flex>
  )
}



