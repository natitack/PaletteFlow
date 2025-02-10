import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { generateColorScale } from "./ColorPalette"
import { useEffect, useState } from "react"

export function LivePreview({ choices }) {
  const {
    color = "#6366f1", // Default indigo color
    mood = "modern",
    font = "system-ui",
    buttonStyle = "rounded",
    cardStyle = "flat",
    heroLayout = "centered",
    featureLayout = "grid",
  } = choices || {}

  const [colorScale, setColorScale] = useState([])
  const [mainColor, setMainColor] = useState(color)

  useEffect(() => {
    const newColorScale = generateColorScale(color)
    setColorScale(newColorScale)
    setMainColor(color) // Use the selected color directly as main color
  }, [color])

  // Rest of the component remains the same...
  const buttonStyles = {
    rounded: { borderRadius: "4px" },
    square: { borderRadius: "0" },
    pill: { borderRadius: "9999px" },
  }

  const cardStyles = {
    flat: {},
    shadow: { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
    outlined: { border: "1px solid #ccc" },
  }

  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Live Preview
      </Text>
      <Box style={{ fontFamily: font }}>
        {/* Hero Section */}
        <Box style={{ marginBottom: "2rem" }}>
          {heroLayout === "centered" && (
            <Flex direction="column" align="center" gap="2">
              <Heading size="8" style={{ color: mainColor }}>
                Welcome to Your Brand
              </Heading>
              <Text size="3" color="gray">
                This is your {mood} brand
              </Text>
              <Button size="3" style={{ ...buttonStyles[buttonStyle], backgroundColor: mainColor }}>
                Call to Action
              </Button>
            </Flex>
          )}
          {/* ... rest of the hero layouts ... */}
        </Box>

        {/* Feature Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem", color: mainColor }}>
            Features
          </Heading>
          {/* ... feature layouts ... */}
        </Box>

        {/* Color Palette Preview */}
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">
            Color Palette
          </Text>
          <Flex gap="1">
            {colorScale.map((color, index) => (
              <Box
                key={index}
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: color,
                  borderRadius: "4px",
                }}
              />
            ))}
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}