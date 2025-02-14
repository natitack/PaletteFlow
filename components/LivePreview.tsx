import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import * as lightColors from '../components/light';

export function LivePreview({ choices }) {
  const {
    color = "indigo", // Default indigo color
    mood = "modern",
    font = "system-ui",
    buttonStyle = "rounded",
    cardStyle = "flat",
    heroLayout = "centered",
    featureLayout = "grid",
  } = choices || {}

  const [mainColor, setMainColor] = useState(color)
  const [colorScale, setColorScale] = useState(lightColors[color])

  useEffect(() => {
    setMainColor(color)
    setColorScale(lightColors[color])
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
                    <Heading size="8" style={{ color: colorScale[`${color}11`]}}>
                    Welcome to Your Brand 
                    </Heading>
              <Text size="3" color="gray">
                This is your {mood} brand
              </Text>
              <Button size="3" style={{ ...buttonStyles[buttonStyle], color:colorScale[`${color}12`], backgroundColor: colorScale[`${color}3`] }}>
                Call to Action
              </Button>
            </Flex>
          )}
          {/* ... rest of the hero layouts ... */}
        </Box>

        {/* Feature Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem", color: colorScale[`${color}11`]}}>
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
            {Object.keys(colorScale).map((key) => (
              <Box key={key} style={{ backgroundColor: colorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}



          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}