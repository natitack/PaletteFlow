import { useState } from "react"
import { Flex, Text, Box, Button } from "@radix-ui/themes"
import { motion, AnimatePresence } from "framer-motion"
import { RelumeFeatureWrapper } from "../featureelements/RelumeFeatureWrapper"

// Feature layout options
const featureLayouts = [
  { value: "event2", label: "List Layout" },
  { value: "layout396", label: "Row Layout" },
  { value: "layout398", label: "Grid Layout" },
]

// Abstract representations of feature layouts
const FeatureLayoutAbstract = ({ layout }) => {
  return (
    <Box className="w-full h-40 bg-gray-200 rounded-lg flex flex-col justify-center items-center relative">
      {/* Common Header Block */}
      <Box className="w-3/4 h-6 bg-gray-400 rounded-md" />

      {/* Different Layout Structures */}
      {layout === "grid" && (
        <Flex wrap="wrap" className="mt-4 gap-2">
          <Box className="w-1/3 h-8 bg-gray-500 rounded-md" />
          <Box className="w-1/3 h-8 bg-gray-400 rounded-md" />
          <Box className="w-1/3 h-8 bg-gray-500 rounded-md" />
          <Box className="w-1/3 h-8 bg-gray-400 rounded-md" />
        </Flex>
      )}

      {layout === "list" && (
        <Flex className="w-3/4 flex-col mt-4 gap-2">
          <Box className="w-full h-6 bg-gray-500 rounded-md" />
          <Box className="w-full h-6 bg-gray-400 rounded-md" />
          <Box className="w-full h-6 bg-gray-500 rounded-md" />
        </Flex>
      )}

      {layout === "alternating" && (
        <Flex className="w-full mt-4 justify-between px-6">
          <Box className="w-1/3 h-10 bg-gray-500 rounded-md" />
          <Box className="w-1/3 h-10 bg-gray-300 rounded-md" />
        </Flex>
      )}
    </Box>
  )
}

export function FeatureLayoutStep({ value, onChange }) {
  const initialIndex = featureLayouts.findIndex((layout) => layout.value === value) || 0
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % featureLayouts.length
    setCurrentIndex(newIndex)
    onChange(featureLayouts[newIndex].value) // Auto-select new layout
  }

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + featureLayouts.length) % featureLayouts.length
    setCurrentIndex(newIndex)
    onChange(featureLayouts[newIndex].value) // Auto-select new layout
  }

  return (
    <Flex direction="column" gap="6" align="center">
      <Text size="5" weight="bold">
        Choose your feature layout
      </Text>

      {/* Carousel Controls */}
      <Flex justify="between" className="w-full max-w-sm">
        <Button onClick={handlePrev} variant="soft">←</Button>
        <Text size="4" weight="medium">{featureLayouts[currentIndex].label}</Text>
        <Button onClick={handleNext} variant="soft">→</Button>
      </Flex>
    </Flex>
  )
}