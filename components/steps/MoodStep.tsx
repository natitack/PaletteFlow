import { Flex, Text, RadioGroup } from "@radix-ui/themes"
import { useFontOptions } from "../../hooks/useFontOptions"

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
  const fontOptions = useFontOptions()
  const fontMap = fontOptions.reduce((acc, option) => {
    acc[option.label] = option.value
    return acc
  }, {})

  switch (mood) {
    case "modern":
      return {
        font: fontMap["Roboto"],
        buttonStyle: "medium",
        cardStyle: "raised",
        heroLayout: "header2",
        featureLayout: "list",
      }
    case "classic":
      return {
        font: fontMap["Source Serif 4"],
        buttonStyle: "none",
        cardStyle: "flat",
        heroLayout: "header1",
        featureLayout: "grid",
      }
    case "playful":
      return {
        font: fontMap["Fredoka"],
        buttonStyle: "full",
        cardStyle: "shadow",
        heroLayout: "header3",
        featureLayout: "alternating",
      }
    case "elegant":
      return {
        font: fontMap["Labrada"],
        buttonStyle: "medium",
        cardStyle: "bordered",
        heroLayout: "header4",
        featureLayout: "grid",
      }
    case "minimalist":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "small",
        cardStyle: "split",
        heroLayout: "header2",
        featureLayout: "list",
      }
    default:
      return {}
  }
}

