import { Flex, Text, RadioGroup, Button } from "@radix-ui/themes"

const buttonStyles = [
  { value: "none", label: "none" },
  { value: "small", label: "Small " },
  { value: "medium", label: "Medium " },
  { value: "large", label: "Large " },
  { value: "full", label: "Full " },
]

export function ButtonStyleStep({ value, onChange }) {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your button style
      </Text>
      <RadioGroup.Root value={value} onValueChange={onChange}>
        {buttonStyles.map((style) => (
          <Flex key={style.value} align="center" gap="2">
            <RadioGroup.Item value={style.value} />
            <Button radius={style.value as "none" | "small" | "medium" | "large" | "full"}>
              {style.label}
            </Button>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}
