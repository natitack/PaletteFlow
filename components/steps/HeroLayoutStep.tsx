import { Flex, Text, RadioGroup, Box, Heading, Button } from "@radix-ui/themes"
import Image from "next/image"
import { createElement } from "react"

const heroLayouts = [
  { value: "centered", label: "Centered", component: heroCentered },
  { value: "split", label: "Split", component: heroSplit },
  { value: "fullWidth", label: "Full Width", component: heroFullwidth },
]

function heroCentered() {
  return (
    <Box style={{ position: "relative", height: "150px" }}>
      <Image src="/placeholder.svg" alt="Placeholder" layout="fill" objectFit="cover" />
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Heading size="4">Full Width Hero</Heading>
        <Text>Subtitle text goes here</Text>
        <Button>Call to Action</Button>
      </Box>
    </Box>
  )
}

export function heroSplit() {
  return (
    <Flex direction="column" align="center" gap="2">
      <Heading size="4">Centered Hero</Heading>
      <Text>Subtitle text goes here</Text>
      <Button>Call to Action</Button>
    </Flex>
  )
}

function heroFullwidth() {
  return (
    <Flex>
      <Box style={{ width: "50%" }}>
        <Heading size="4">Split Hero</Heading>
        <Text>Subtitle text goes here</Text>
        <Button>Call to Action</Button>
      </Box>
      <Box style={{ width: "50%" }}>
        <Image src="/placeholder.svg" alt="Placeholder" width={200} height={100} />
      </Box>
    </Flex>
  )
}

export function HeroLayoutStep({ value, onChange }) {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your hero layout
      </Text>
      <RadioGroup.Root value={value} onValueChange={onChange}>
        {heroLayouts.map((layout) => (
          <Flex key={layout.value} direction="column" gap="2">
            <Box
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              {createElement(layout.component)}
              
            </Box>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}

