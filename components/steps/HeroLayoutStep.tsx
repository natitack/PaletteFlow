import { useState } from "react"
import { Flex, Text, Box, Button } from "@radix-ui/themes"
import { RelumeHeader } from "../heroelements/RelumeHeader"
import { CenteredHero, SplitHero, FullWidthHero } from "../heroelements/OldHeaders"

// Hero layout options
const heroLayouts = [
  { value: "header1", label: "Hero Layout 1" },
  { value: "header2", label: "Hero Layout 2" },
  { value: "header3", label: "Hero Layout 3" },
  { value: "header4", label: "Hero Layout 4" },
]

export function HeroLayoutStep({ value, onChange, choices }) {
  const initialIndex = heroLayouts.findIndex((layout) => layout.value === value) || 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

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