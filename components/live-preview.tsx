import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { useColorScales } from "../hooks/useColorScales"
import { RelumeHeroWrapper } from "./heroelements/RelumeHeroWrapper"
import themeManager from "../lib/themeManager"

export function LivePreview({ choices }) {
  const {
    color = "indigo",
    font = "system-ui",
    buttonStyle = "full",
    cardStyle = "flat",
    heroLayout = "header1",
    featureLayout = "grid",
  } = choices || {}

  const { colorScale } = useColorScales(color)

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
      <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="2" onClick={() => themeManager.toggleDarkMode()}>Toggle Dark Mode</Button>
      </Box>

      <Box className={font}>
        {/* Hero Section - Now Uses RelumeHeroWrapper */}
        <Box style={{ marginBottom: "2rem" }}>
          <RelumeHeroWrapper layout={heroLayout} choices={{ ...choices, colorScale }} />
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
                  <Heading size="2" className={font}>Feature {i}</Heading>
                  <Text size="1">Description</Text>
                </Card>
              ))}
            </Flex>
          )}
        </Box>

        {/* Card Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }} className={font}>
            Cards
          </Heading>
          <Flex gap="4">
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>Card 1</Text>
            </Card>
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>Card 2</Text>
            </Card>
            <Card style={{ ...cardStyles[cardStyle] }} className={font}>
              <Text size="3" style={{ color: colorScale[`${color}11`] }}>Card 3</Text>
            </Card>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}
