import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useColorScales } from "../hooks/useColorScales";
import { Header1 } from "./heroelements/RelumeHeader1"
import { CenteredHero, SplitHero, FullWidthHero } from "./heroelements/OldHeaders"


export function LivePreview({ choices }) {
  const {
    color = "indigo", // Default indigo color
    mood = "modern",
    font = "system-ui",
    buttonStyle = "full",
    cardStyle = "flat",
    heroLayout = "centered",
    featureLayout = "grid",
  } = choices || {}

  const { colorScale, darkModeColorScale, grayColorScale, darkGrayColorScale } = useColorScales(color);


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
<Box className={font}>

        {/* Hero Section */}
        <Box style={{ marginBottom: "2rem" }}>
          {heroLayout === "centered" && (
            <CenteredHero choices={choices} />
          )}
          {heroLayout === "split" && (
            <SplitHero choices={choices} />
          )}
          {heroLayout === "fullWidth" && (
            <FullWidthHero choices={choices} />
          )}
          {heroLayout === "header1" && (
            <Header1 />
          )}
        </Box>

        {/* Card Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }} className={font}>
            Cards
          </Heading>
          <Flex gap="4">
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>
                Card 1
              </Text>
            </Card>
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>
                Card 2
              </Text>
            </Card>
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>
                Card 3
              </Text>
            </Card>
          </Flex>
        </Box>

        {/* Feature Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }} className={font}>
            Features
          </Heading>
          {featureLayout === "grid" && (
            <Flex wrap="wrap" gap="2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} style={{ ...cardStyles[cardStyle], width: "calc(50% - 0.5rem)" }} className={font}>
                  <Image src="/placeholder.svg" alt="Placeholder" width={50} height={50} />
                  <Heading size="2" className={font}>
                    Feature {i}
                  </Heading>
                  <Text size="1">Description</Text>
                </Card>
              ))}
            </Flex>
          )}
          {featureLayout === "list" && (
            <Flex direction="column" gap="2">
              {[1, 2, 3].map((i) => (
                <Card key={i} style={{ ...cardStyles[cardStyle] }} className={font}>
                  <Flex gap="2">
                    <Image src="/placeholder.svg" alt="Placeholder" width={50} height={50} />
                    <Box>
                      <Heading size="2" className={font}>
                        Feature {i}
                      </Heading>
                      <Text size="1">Description</Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
          {featureLayout === "alternating" && (
            <Flex direction="column" gap="2">
              {[1, 2].map((i) => (
                <Card key={i} style={{ ...cardStyles[cardStyle] }} className={font}>
                  <Flex gap="2" direction={i % 2 === 0 ? "row-reverse" : "row"}>
                    <Image src="/placeholder.svg" alt="Placeholder" width={100} height={100} />
                    <Box>
                      <Heading size="2" className={font}>
                        Feature {i}
                      </Heading>
                      <Text size="1">Description</Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}
        </Box>

        {/* Color Palette Preview */}
        <Flex direction="column" gap="2">
            <Text size="2" weight="bold" className={font}>
            Accessible Color Palette
            </Text>
          <Flex gap="1">
            {Object.keys(colorScale).map((key) => (
              <Box key={key} style={{ backgroundColor: colorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>
        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">
          </Text>
          <Flex gap="1">
            {Object.keys(darkModeColorScale).map((key) => (
              <Box key={key} style={{ backgroundColor: darkModeColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">
          </Text>
          <Flex gap="1">
            {Object.keys(grayColorScale).map((key) => (
              <Box key={key} style={{ backgroundColor: grayColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>

        <Flex direction="column" gap="2">
          <Text size="2" weight="bold">
          </Text>
          <Flex gap="1">
            {Object.keys(darkGrayColorScale).map((key) => (
              <Box key={key} style={{ backgroundColor: darkGrayColorScale[key], width: "2rem", height: "2rem", borderRadius: "4px" }} />
            ))}
          </Flex>
        </Flex>

        
      </Box>
    </Flex>
  )
}