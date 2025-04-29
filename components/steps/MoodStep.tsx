import { Flex, Text, RadioGroup } from "@radix-ui/themes"
import { useFontOptions } from "../../hooks/useFontOptions"

const moodOptions = [
  { value: "caregiver", label: "Caregiver" },
  { value: "creator", label: "Creator" },
  { value: "ruler", label: "Ruler" },
  { value: "innocent", label: "Innocent" },
  { value: "explorer", label: "Explorer" },
  { value: "sage", label: "Sage" },
  { value: "hero", label: "Hero" },
  { value: "outlaw", label: "Outlaw" },
  { value: "magician", label: "Magician" },
  { value: "everyman", label: "Everyman" },
  { value: "lover", label: "Lover" },
  { value: "jester", label: "Jester" },

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

MoodStep.getMoodValues = function (mood) {
  const fontOptions = useFontOptions()
  const fontMap = fontOptions.reduce((acc, option) => {
    acc[option.label] = option.value
    return acc
  }, {})

  switch (mood) {
    case "caregiver":
      return {
        font: fontMap["Nunito"],
        buttonStyle: "full",
        cardStyle: "raised",
        heroLayout: "header1",
        featureLayout: "event2",
      }
    case "creator":
      return {
        font: fontMap["Fredoka"],
        buttonStyle: "none",
        cardStyle: "flat",
        heroLayout: "header5",
        featureLayout: "layout396",
      }
    case "ruler":
      return {
        font: fontMap["Source Serif 4"],
        buttonStyle: "small",
        cardStyle: "shadow",
        heroLayout: "header11",
        featureLayout: "layout398",
      }
    case "innocent":
      return {
        font: fontMap["Labrada"],
        buttonStyle: "medium",
        cardStyle: "bordered",
        heroLayout: "header26",
        featureLayout: "event2",
      }
    case "explorer":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout396",
      }
    case "sage":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "event2",
      }
    case "hero":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout398",
      }
    case "outlaw":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout396",
      }
    case "magician":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout398",
      }
    case "everyman":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout396",
      }
    case "lover":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "layout398",
      }
    case "jester":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header5",
        featureLayout: "event2",
      }
    default:
      return {}
  }
}

