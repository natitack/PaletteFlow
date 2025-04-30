import { useState, useEffect } from "react"
import { Flex, Text, Box, Button, Card } from "@radix-ui/themes"
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

      <Card
        className="p-4"
        style={{
          maxHeight: "80vh",
          overflowY: "auto", // Enable vertical scrolling
          scrollbarWidth: "thin", // Thin scrollbar for better aesthetics
        }}
      >
        {heroLayouts.map((layout, index) => (
          <Button
        key={layout.value}
        variant={currentIndex === index ? "soft" : "outline"}
        style={{
          display: "grid",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          padding: "12px",
          cursor: "pointer",
          marginBottom: "1rem",
          transition: "transform 0.2s ease, background-color 0.2s ease",
          width: "fit-content", // Ensure consistent width
          height: "fit-content", // Set a minimum height for consistency
        }}
        onClick={() => setCurrentIndex(index)}
          >
        <Box
          style={{
            border: "1px solid",
            width: "100%", // Ensure consistent width
            height: "100%", // Ensure consistent height
          }}
        >
          <img
            src={`/images/previews/hero/${layout.value}.png`}
            alt={`${layout.label} preview`}
            
          />
        </Box>
        <Text size="4" weight="medium" align="center">
          {layout.label}
        </Text>
          </Button>
        ))}
      </Card>
    </Flex>
  )
}
