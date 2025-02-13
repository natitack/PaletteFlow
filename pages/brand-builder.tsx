"use client"

import { useState, useCallback } from "react"
import { ColorPalette } from "../components/ColorPalette copy"
import { MoodStep } from "../components/steps/MoodStep"
import { FontStep } from "../components/steps/FontStep"
import { ButtonStyleStep } from "../components/steps/ButtonStyleStep"
import { CardStyleStep } from "../components/steps/CardStyleStep"
import { HeroLayoutStep } from "../components/steps/HeroLayoutStep"
import { FeatureLayoutStep } from "../components/steps/FeatureLayoutStep"
import { LivePreview } from "../components/LivePreview"
import { Button, Flex, Text } from "@radix-ui/themes"
import { motion, AnimatePresence } from "framer-motion"

const STEPS = [
  { id: "color", component: ColorPalette, title: "Color Palette" },
  { id: "mood", component: MoodStep, title: "Brand Personality" },
  { id: "buttonStyle", component: ButtonStyleStep, title: "Button Style" },
  { id: "cardStyle", component: CardStyleStep, title: "Card Style" },
  { id: "heroLayout", component: HeroLayoutStep, title: "Hero Layout" },
  { id: "featureLayout", component: FeatureLayoutStep, title: "Feature Layout" },
]

export default function BrandBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [choices, setChoices] = useState({
    color: "indigo9",
    mood: "modern",
    font: "system-ui",
    buttonStyle: "rounded",
    cardStyle: "flat",
    heroLayout: "centered",
    featureLayout: "grid",
  })

  const updateChoice = useCallback((key: string, value: string) => {
    setChoices((prev) => {
      const newChoices = { ...prev, [key]: value }
      console.log("Updated choices:", newChoices) // Debug log
      return newChoices
    })
  }, [])

  const CurrentStepComponent = STEPS[currentStep].component
  const currentStepId = STEPS[currentStep].id

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <Flex direction="column" gap="4" className="min-h-screen bg-gray-50 p-8">
      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
          style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <Text size="5" weight="bold">
        Step {currentStep + 1}: {STEPS[currentStep].title}
      </Text>

      {/* Content */}
      <Flex gap="8">
        {/* Questionnaire */}
        <Flex direction="column" className="w-1/2">
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
        
        {/* Live Preview */}
        <div className="w-1/2">
          <LivePreview choices={choices} />
        </div>
      </Flex>

      {/* Progress buttons */}
      <Flex justify="between" mt="4">
        <Button onClick={handlePrevious} disabled={currentStep === 0} variant="soft">
          Previous
        </Button>
        <Button onClick={handleNext} disabled={currentStep === STEPS.length - 1}>
          {currentStep === STEPS.length - 1 ? "Finish" : "Next"}
        </Button>
      </Flex>
    </Flex>
  )
}

