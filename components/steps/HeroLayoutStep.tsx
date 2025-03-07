import { useState, useEffect } from "react"
import { Flex, Text, Box, Button } from "@radix-ui/themes"
import { RelumeHeroWrapper } from "../heroelements/RelumeHeroWrapper"

// Define hero layout options
const heroLayouts = [
  { value: "header1", label: "Header 1" },
  { value: "header2", label: "Header 2" },
  { value: "header5", label: "Header 5" },
  { value: "header26", label: "Header 26" },
  { value: "header11", label: "Header 11" },
]

export function HeroLayoutStep({ value, onChange, choices }) {
  const initialIndex = heroLayouts.findIndex((layout) => layout.value === value)
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0)

  useEffect(() => {
    onChange(heroLayouts[currentIndex].value) // Ensure changes persist globally
  }, [currentIndex])

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % heroLayouts.length
    setCurrentIndex(newIndex)
    onChange(heroLayouts[newIndex].value)
  }

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + heroLayouts.length) % heroLayouts.length
    setCurrentIndex(newIndex)
    onChange(heroLayouts[newIndex].value)
  }

  return (
    <Flex direction="column" gap="6" align="center">
      <Text size="5" weight="bold">Choose your hero layout</Text>

      {/* Carousel Controls */}
      <Flex justify="between" className="w-full max-w-sm">
        <Button onClick={handlePrev} variant="soft">←</Button>
        <Text size="4" weight="medium">{heroLayouts[currentIndex].label}</Text>
        <Button onClick={handleNext} variant="soft">→</Button>
      </Flex>
    </Flex>
  )
}
