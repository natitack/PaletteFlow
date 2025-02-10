import { Flex, Text, RadioGroup, Button } from "@radix-ui/themes"

const buttonStyles = [
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "pill", label: "Pill" },
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
            <Button
              style={{
                borderRadius: style.value === "rounded" ? "4px" : style.value === "square" ? "0" : "9999px",
              }}
            >
              {style.label}
            </Button>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}

