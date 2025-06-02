import { Flex, Box, Text,} from "@radix-ui/themes"
import { useColorScales } from "../hooks/useColorScales"
import { RelumeHeroWrapper } from "./heroelements/RelumeHeroWrapper"
import { RelumeFeatureWrapper } from "./featureelelemts/RelumeFeatureWrapper"
import { useChoices } from "../context/ChoicesContext";
import { getRadixColor,  } from '../components/utils/color-utils';


export function LivePreview() {
  const { choices, updateChoice } = useChoices();

  const { colorScale } = useColorScales(choices.color)


  return (
    <Flex direction="column" gap="4">

      {/* <Box style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="2" onClick={() => themeManager.toggleDarkMode()}>Toggle Dark Mode</Button>
      </Box> */}
      <Box
        style={{
          width: "100%",
          height: "64px",
          borderRadius: "12px",
          background: getRadixColor(choices.color, choices.shade) || "#f3f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          paddingRight: "1rem", // Added internal right padding
        }}
      >
        <Text
          size="6"
          weight="bold"
          style={{
            color: "#fff",
            letterSpacing: "0.5px",
            textShadow: "0 0 0 2px #000, 0 1px 4px rgba(0,0,0,0.25)",
            padding: "0.25em 0.75em",
            borderRadius: "8px",
            background: "rgba(0,0,0,0.2)",
            boxSizing: "border-box",
          }}
        >
          Live Preview
        </Text>
      </Box>

      <Box className={choices.font?.value}>
        {/* Hero Section -Use RelumeHeroWrapper */}
        <Box >
          <RelumeHeroWrapper />
        </Box>

        {/* Feature Section */}
        <Box style={{ marginBottom: "2rem" }}>
          <RelumeFeatureWrapper layout={choices.featureLayout} choices={{ ...choices, colorScale }} />
        </Box>

      </Box>
    </Flex>
  )
}
