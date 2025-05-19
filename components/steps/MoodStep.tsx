import { Flex, Text, RadioGroup } from "@radix-ui/themes";
import { useChoices } from "../../context/ChoicesContext";
import { useFontOptions } from "../../hooks/useFontOptions";
import { hexToOklch, adjustOklch, formatOklch, findClosestTailwindColor } from "../utils/oklch-color-utils";

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
];

export function MoodStep({ value, onChange }) {
  const { updateChoice, choices } = useChoices();

  const handleChange = (newValue) => {
    const moodValues = MoodStep.getMoodValues(newValue);
    updateChoice("mood", newValue); // Update the mood in the context
    
    // Update other related values
    Object.entries(moodValues).forEach(([key, val]) => updateChoice(key, val));
    
    // Process the color transformation based on the new mood
    if (choices.originalHex) {
      processColorTransformation(choices.originalHex, moodValues.chroma, moodValues.lightness);
    }
    
    onChange(newValue);
  };

  const processColorTransformation = (hexColor, chroma, lightness) => {
    // Convert hex to OKLCH
    const oklchColor = hexToOklch(hexColor);
    
    if (oklchColor) {
      // Adjust OKLCH values based on mood
      const adjustedOklch = adjustOklch(oklchColor, chroma, lightness);
      
      // Format the new OKLCH color
      const newOklchStr = formatOklch(adjustedOklch.l, adjustedOklch.c, adjustedOklch.h);
      
      // Find the closest Tailwind color
      const closestTailwind = findClosestTailwindColor(adjustedOklch);
      
      // Update the context with the new values
      updateChoice("tailwindColor", closestTailwind.colorName);
      updateChoice("brandNumber", closestTailwind.shade);
      updateChoice("chroma", chroma.toString());
      updateChoice("lightness", lightness.toString());
      
      // Optional: Update color choice for Radix UI as well
      // This depends on whether you want to keep the original mapping or use the new one
      // For now, we'll assume we want to keep the palette based on the original hex
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">Select your brand personality</Text>
      <RadioGroup.Root defaultValue={value} onValueChange={handleChange}>
        {moodOptions.map((option) => (
          <Flex key={option.value} align="center" gap="2">
            <RadioGroup.Item value={option.value} />
            <Text>{option.label}</Text>
          </Flex>
        ))}
      </RadioGroup.Root>
    </Flex>
  );
}

MoodStep.getMoodValues = function (mood) {
  const fontOptions = useFontOptions();
  const fontMap = fontOptions.reduce((acc, option) => {
    acc[option.label] = option.value;
    return acc;
  }, {});

  switch (mood) {
    case "caregiver":
      return {
        font: fontMap["Nunito"],
        buttonStyle: "full",
        cardStyle: "raised",
        heroLayout: "header1",
        featureLayout: "event2",
        chroma: 0.16,    // Soft, comforting colors
        lightness: 0.65  // Lighter, gentle tones
      };
    case "creator":
      return {
        font: fontMap["Fredoka"],
        buttonStyle: "none",
        cardStyle: "flat",
        heroLayout: "header1",
        featureLayout: "layout396",
        chroma: 0.25,    // Vibrant, artistic colors
        lightness: 0.60  // Balanced to allow creativity
      };
    case "ruler":
      return {
        font: fontMap["Source Serif 4"],
        buttonStyle: "small",
        cardStyle: "shadow",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.18,    // Restrained, dignified colors
        lightness: 0.45  // Deeper, more serious tones
      };
    case "innocent":
      return {
        font: fontMap["Labrada"],
        buttonStyle: "medium",
        cardStyle: "bordered",
        heroLayout: "header1",
        featureLayout: "event2",
        chroma: 0.14,    // Pure, simple colors
        lightness: 0.75  // Very light, airy feel
      };
    case "explorer":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout396",
        chroma: 0.22,    // Rich, natural colors
        lightness: 0.55  // Balanced to suggest adventure
      };
    case "sage":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "event2",
        chroma: 0.15,    // Subdued, thoughtful colors
        lightness: 0.60  // Softer, contemplative tones
      };
    case "hero":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.28,    // Bold, striking colors
        lightness: 0.50  // Balanced to convey strength
      };
    case "outlaw":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout396",
        chroma: 0.30,    // Intense, disruptive colors
        lightness: 0.40  // Darker, more mysterious
      };
    case "magician":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.26,    // Vibrant, mystical colors
        lightness: 0.48  // Rich, somewhat dark
      };
    case "everyman":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout396",
        chroma: 0.18,    // Approachable, common colors
        lightness: 0.58  // Balanced, comfortable
      };
    case "lover":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "layout398",
        chroma: 0.24,    // Warm, intimate colors
        lightness: 0.62  // Soft, inviting
      };
    case "jester":
      return {
        font: fontMap["Reddit Mono"],
        buttonStyle: "medium",
        cardStyle: "split",
        heroLayout: "header1",
        featureLayout: "event2",
        chroma: 0.35,    // Playful, energetic colors
        lightness: 0.65  // Bright, attention-grabbing
      };
    default:
      return {
        chroma: 0.20,    // Default chroma
        lightness: 0.55  // Default lightness
      };
  }
};