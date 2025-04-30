import { useState, useEffect } from "react"
import { Flex, Text, Box, Button, Card } from "@radix-ui/themes"

// Feature layout options
const featureLayouts = [
  { value: "event2", label: "List Layout" },
  { value: "layout396", label: "Row Layout" },
  { value: "layout398", label: "Grid Layout" },
]


export function FeatureLayoutStep({ value, onChange }) {
  const initialIndex = featureLayouts.findIndex((layout) => layout.value === value) || 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    onChange(featureLayouts[currentIndex].value) // Ensure changes persist globally
  }, [currentIndex])


  return (
    <Flex direction="column" gap="6" align="center">
      <Text size="5" weight="bold">Choose your feature layout</Text>

      <Card
        className="p-4"
        style={{
          maxHeight: "80vh",
          overflowY: "auto", // Enable vertical scrolling
          scrollbarWidth: "thin", // Thin scrollbar for better aesthetics
        }}
      >
        {featureLayouts.map((layout, index) => (
          <Button
            key={layout.value}
            variant={currentIndex === index ? "soft" : "outline"}
            style={{
              display: "grid",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "12px",
              cursor: "pointer",
              marginBottom: "1rem",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              width: "fit-content", // Ensure consistent width
              height: "fit-content", // Set a minimum height for consistency
            }}
            onClick={() => setCurrentIndex(index)}
          >
            <Box
              style={{
                border: "1px solid",
                width: "100%", // Ensure consistent width
                height: "100%", // Ensure consistent height
              }}
            >
              <img
                src={`/images/previews/feature/${layout.value}.png`}
                alt={`${layout.label} preview`}

              />
            </Box>
            <Text size="4" weight="medium" align="center">
              {layout.label}
            </Text>
          </Button>
        ))}
      </Card>
    </Flex>
  )
}