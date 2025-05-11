import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { useColorScales } from "../hooks/useColorScales"
import { RelumeHeroWrapper } from "./heroelements/RelumeHeroWrapper"
import { RelumeFeatureWrapper } from "./featureelelemts/RelumeFeatureWrapper"
import themeManager from "../lib/themeManager"
import { useChoices } from "../context/ChoicesContext";


export function LivePreview() {
   const { choices, updateChoice } = useChoices();

  const { colorScale } = useColorScales(choices.color)

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

      <Box className={choices.font}>
        {/* Hero Section - Now Uses RelumeHeroWrapper */}
        <Box >
          <RelumeHeroWrapper layout={choices.heroLayout} choices={{ ...choices, colorScale }} />
        </Box>

        {/* Feature Section - now with relume */}
        <Box style={{ marginBottom: "2rem" }}>
          <RelumeFeatureWrapper layout={choices.featureLayout} choices={{ ...choices, colorScale }} />
        </Box>

        {/* Card Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <Heading size="6" style={{ marginBottom: "1rem" }} className={choices.font}>
            Cards
          </Heading>
          <Flex gap="4">
            <Card style={{ ...cardStyles[choices.cardStyle] }} className={choices.font}>
              <Text size="3" style={{ color: colorScale[`${choices.color}11`] }}>Card 1</Text>
            </Card>
            <Card style={{ ...cardStyles[choices.cardStyle] }} className={choices.font}>
              <Text size="3" style={{ color: colorScale[`${choices.color}11`] }}>Card 2</Text>
            </Card>
            <Card style={{ ...cardStyles[choices.cardStyle] }} className={choices.font}>
              <Text size="3" style={{ color: colorScale[`${choices.color}11`] }}>Card 3</Text>
            </Card>
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}
