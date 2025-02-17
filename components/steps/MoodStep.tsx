import { Flex, Text, RadioGroup } from "@radix-ui/themes"

const moodOptions = [
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "playful", label: "Playful" },
  { value: "elegant", label: "Elegant" },
  { value: "minimalist", label: "Minimalist" },
]

export function MoodStep({ value, onChange }) {
  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Select your brand personality
      </Text>
      <RadioGroup.Root defaultValue={value} onValueChange={onChange}>
        {moodOptions.map((option) => (
          <Flex key={option.value} align="center" gap="2">
            <RadioGroup.Item value={option.value} />
            <Text>{option.label}</Text>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  )
}

MoodStep.getMoodValues = function(mood) {
  switch (mood) {
    case "modern":
      return {
        color: "blue",
        font: "sans-serif",
        buttonStyle: "square",
        cardStyle: "raised",
        heroLayout: "fullWidth",
        featureLayout: "list",
      }
    case "classic":
      return {
        color: "red",
        font: "serif",
        buttonStyle: "rounded",
        cardStyle: "flat",
        heroLayout: "centered",
        featureLayout: "grid",
      }
    case "playful":
      return {
        color: "yellow",
        font: "cursive",
        buttonStyle: "pill",
        cardStyle: "shadow",
        heroLayout: "split",
        featureLayout: "alternating",
      }
    case "elegant":
      return {
        color: "purple",
        font: "serif",
        buttonStyle: "rounded",
        cardStyle: "bordered",
        heroLayout: "centered",
        featureLayout: "grid",
      }
    case "minimalist":
      return {
        color: "gray",
        font: "monospace",
        buttonStyle: "square",
        cardStyle: "split",
        heroLayout: "fullWidth",
        featureLayout: "list",
      }
    default:
      return {}
  }
}

