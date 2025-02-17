import { Flex, Text, RadioGroup, Box, Heading } from "@radix-ui/themes"
import Image from "next/image"

const featureLayouts = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "alternating", label: "Alternating" },
]

export function FeatureLayoutStep({ value, onChange }) {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your feature layout
      </Text>
      <RadioGroup.Root value={value} onValueChange={onChange}>
        {featureLayouts.map((layout) => (
          <Flex key={layout.value} direction="column" gap="2">
            <RadioGroup.Item value={layout.value} />
            <Box
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "4px",
              }}
            >
              {layout.value === "grid" && (
                <Flex wrap="wrap" gap="2">
                  {[1, 2, 3, 4].map((i) => (
                    <Box key={i} style={{ width: "calc(50% - 0.5rem)" }}>
                      <Image src="/components/steps/placeholder.svg" alt="Placeholder" width={50} height={50} />
                      <Heading size="2">Feature {i}</Heading>
                      <Text size="1">Description</Text>
                    </Box>
                  ))}
                </Flex>
              )}
              {layout.value === "list" && (
                <Flex direction="column" gap="2">
                  {[1, 2, 3].map((i) => (
                    <Flex key={i} gap="2">
                      <Image src="/placeholder.svg" alt="Placeholder" width={50} height={50} />
                      <Box>
                        <Heading size="2">Feature {i}</Heading>
                        <Text size="1">Description</Text>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              )}
              {layout.value === "alternating" && (
                <Flex direction="column" gap="2">
                  {[1, 2].map((i) => (
                    <Flex key={i} gap="2" direction={i % 2 === 0 ? "row-reverse" : "row"}>
                      <Image src="/placeholder.svg" alt="Placeholder" width={100} height={100} />
                      <Box>
                        <Heading size="2">Feature {i}</Heading>
                        <Text size="1">Description</Text>
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}

