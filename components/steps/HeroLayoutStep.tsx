import { Flex, Text, RadioGroup, Box, Heading, Button } from "@radix-ui/themes"
import Image from "next/image"
import { useState } from "react"
import { Header1} from "../heroelements/RelumeHeader1"
import { CenteredHero, SplitHero, FullWidthHero } from "../heroelements/OldHeaders"

const heroLayouts = [
  { value: "centered", label: "Centered", component: CenteredHero },
  { value: "split", label: "Split", component: SplitHero },
  { value: "fullWidth", label: "Full Width", component: FullWidthHero },
  { value: "header1", label: "Header 1", component: (props) => <Header1 {...props} /> },

]

export function HeroLayoutStep({ value, onChange }) {
  const [selectedLayout, setSelectedLayout] = useState(value);

  const handleLayoutChange = (newLayout) => {
    setSelectedLayout(newLayout);
    onChange(newLayout);
  };
  
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your hero layout
      </Text>
      <RadioGroup.Root value={value} onValueChange={handleLayoutChange}>
        {heroLayouts.map((layout) => (
          <Flex key={layout.value} direction="column" gap="2">
            <RadioGroup.Item value={layout.value}/>
            <Box
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              <layout.component choices={[]} />                     
            </Box>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}
