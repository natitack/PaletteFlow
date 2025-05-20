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
import { getRadixColor } from '../components/utils/radix-color-utils';

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
  const isDarkMode = themeManager.getCurrentTheme().darkMode;

  // Get the brand color from Radix palette based on the selected color and shade
  const getBrandColor = (shadeOffset = 0) => {
    const { color = "indigo", shade = "9" } = choices;
    
    // Calculate the shade with offset, ensuring it stays within 1-12 range
    const targetShade = Math.max(1, Math.min(12, parseInt(shade) + shadeOffset));
    
    // Get the color from Radix palette
    return getRadixColor(color, targetShade.toString(), isDarkMode);
  };

  // Get the appropriate background color
  const getBackgroundColor = () => {
    return themeManager.getCurrentTheme().darkMode
      ? darkModeColorScale[`${choices.color}1`] || "#111111"
      : colorScale[`${choices.color}1`] || "#ffffff";
  };

  const getProgressBarColor = () => {
    return themeManager.getCurrentTheme().darkMode
      ? darkModeColorScale[`${choices.color}9`] || "#444444"
      : colorScale[`${choices.color}9`] || "#888888";
  };



  // Handle button styling with Radix colors
  const getButtonStyle = (isPrimary) => {
    const { buttonStyle = "full" } = choices;
    
    // Define button radius classes
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
          backgroundColor: getBrandColor(0),  // Primary color
          color: "white",
          border: `2px solid ${getBrandColor(1)}`, // Slightly darker for border
        },
        className: `${radiusClass} px-4 py-2 font-semibold shadow`
      };
    } else {
      return {
        style: {
          backgroundColor: "transparent",
          color: getBrandColor(0),
          border: `2px solid ${getBrandColor(0)}`,
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
        style={{ color: isDarkMode ? "#ffffff" : getRadixColor(choices.color, "12", false) }}
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