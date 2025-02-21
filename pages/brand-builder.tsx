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


const STEPS = [
  { id: "mood", component: MoodStep, title: "Brand Personality" },
  { id: "color", component: ColorPickerStep, title: "Color Palette" },
  { id: "heroLayout", component: HeroLayoutStep, title: "Hero Layout" },
  { id: "featureLayout", component: FeatureLayoutStep, title: "Feature Layout" },
  { id: "font", component: FontStep, title: "Font Style" },
  { id: "buttonStyle", component: ButtonStyleStep, title: "Button Style" },
  { id: "cardStyle", component: CardStyleStep, title: "Card Style" },
]

export default function BrandBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()

  const [choices, setChoices] = useState({
    color: "indigo",
    mood: "modern",
    font: "system-ui",
    buttonStyle: "rounded",
    cardStyle: "flat",
    heroLayout: "centered",
    featureLayout: "grid",
  })

  const updateChoice = useCallback((key: string, value: string) => {
    setChoices((prev) => {
      let newChoices = { ...prev, [key]: value }
      if (key === "mood") {
        // Assuming the MoodStep component provides the new values for other steps
        const moodValues = MoodStep.getMoodValues(value)
        newChoices = { ...newChoices, ...moodValues }
      }
      if (key === "color") {
        // Update the theme
        themeManager.setTheme(value);
      }
      localStorage.setItem("brandChoices", JSON.stringify(newChoices)); // Save to localStorage
      console.log("Updated choices:", newChoices) // Debug log
      return newChoices
    })
  }, [])

  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(choices.color);


  const CurrentStepComponent = STEPS[currentStep].component
  const currentStepId = STEPS[currentStep].id

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

  return (
    <Flex direction="column" gap="4" className="min-h-screen bg-gray-50 p-8">
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-300 ease-in-out"
        style={{ 
        backgroundColor: colorScale[`${choices.color}9`],
        width: `${((currentStep + 1) / STEPS.length) * 100}%`,
        }}
      />
      </div>

      <Text size="5" weight="bold">
        Step {currentStep + 1}: {STEPS[currentStep].title}
      </Text>

      <Flex gap="8">
        <Flex direction="column" className="w-1/4">
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

            <Flex justify="between" mt="4">
            <Button 
              onClick={handlePrevious} 
              disabled={currentStep === 0} 
            >
              Previous
            </Button>
            {currentStep === STEPS.length - 1 ? (
              <Button 
              onClick={handleFinish} 
              >
              Finish
              </Button>
            ) : (
              <Button 
              onClick={handleNext} 
              >
              Next
              </Button>
            )}
            </Flex>
          </Flex>

        <div className="w-1/2">
          <LivePreview choices={choices} />
        </div>
      </Flex>
    </Flex>
  )
}

