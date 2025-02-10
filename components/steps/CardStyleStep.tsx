import { Flex, Text, RadioGroup, Card } from "@radix-ui/themes"

const cardStyles = [
  { value: "flat", label: "Flat" },
  { value: "shadow", label: "Shadow" },
  { value: "outlined", label: "Outlined" },
]

export function CardStyleStep({ value, onChange }) {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your card style
      </Text>
      <RadioGroup.Root value={value} onValueChange={onChange}>
        {cardStyles.map((style) => (
          <Flex key={style.value} align="center" gap="2">
            <RadioGroup.Item value={style.value} />
            <Card
              style={{
                boxShadow: style.value === "shadow" ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                border: style.value === "outlined" ? "1px solid #ccc" : "none",
              }}
            >
              <Text>{style.label}</Text>
            </Card>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}

