import { useState } from "react"
import { Flex, Text, Box, Button } from "@radix-ui/themes"
import { Header1 } from "../heroelements/RelumeHeader"
import { CenteredHero, SplitHero, FullWidthHero } from "../heroelements/OldHeaders"

// Hero layout options
const heroLayouts = [
  { value: "centered", label: "Centered Hero" },
  { value: "split", label: "Split Hero" },
  { value: "fullWidth", label: "Full Width Hero" },
  { value: "header1", label: "Header 1" },
]

const layoutComponents = {
  centered: CenteredHero,
  split: SplitHero,
  fullWidth: FullWidthHero,
  header1: Header1,
}

export function HeroLayoutStep({ value, onChange }) {
  const initialIndex = heroLayouts.findIndex((layout) => layout.value === value) || 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % heroLayouts.length
    setCurrentIndex(newIndex)
    onChange(heroLayouts[newIndex].value) // Auto-select new layout
  }

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + heroLayouts.length) % heroLayouts.length
    setCurrentIndex(newIndex)
    onChange(heroLayouts[newIndex].value) // Auto-select new layout
  }

  const CurrentHero = layoutComponents[heroLayouts[currentIndex].value]

  return (
    <Flex direction="column" gap="6" align="center">
      <Text size="5" weight="bold">
        Choose your hero layout
      </Text>

      {/* Carousel Controls */}
      <Flex justify="between" className="w-full max-w-sm">
        <Button onClick={handlePrev} variant="soft">←</Button>
        <Text size="4" weight="medium">{heroLayouts[currentIndex].label}</Text>
        <Button onClick={handleNext} variant="soft">→</Button>
      </Flex>
    </Flex>
  )
}
