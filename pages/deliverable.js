"use client"

import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Button, Flex, Text, Box, Card, Heading } from "@radix-ui/themes"
import { useColorScales } from "../hooks/useColorScales"
import { CenteredHero, SplitHero, FullWidthHero } from "../components/heroelements/OldHeaders"
import { Header1 } from "../components/heroelements/RelumeHeader1"

export default function Deliverable() {
  const router = useRouter()
  const [canAccess, setCanAccess] = useState(false)
  const [brandChoices, setBrandChoices] = useState({
    color: "indigo9",
    font: "system-ui",
    buttonStyle: "rounded",
    cardStyle: "flat",
    heroLayout: "centered",
    featureLayout: "grid"
  }) 
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isComplete = localStorage.getItem("brandBuilderComplete")
    const choices = localStorage.getItem("brandChoices")

    if (!isComplete) {
      router.push("/brand-builder") // Redirect if not completed
    } else {
      setCanAccess(true)
      if (choices) {
        setBrandChoices(JSON.parse(choices))
      }
    }
  }, [])

  const { colorScale = {}, darkModeColorScale = {} } = useColorScales(brandChoices.color) || {}

  if (!canAccess) return <p className="text-center mt-10">Redirecting...</p>

  return (
    <div className={darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}>
      {/* Header */}
      <header className="p-6 border-b flex justify-between items-center">
        <Text size="6" weight="bold">Brand Style Guide</Text>
        <Button onClick={() => setDarkMode(!darkMode)}>Try {darkMode ? "Light" : "Dark"} Mode</Button>
      </header>

      <main className="p-8 space-y-12">
        {/* Hero Section */}
        <Box style={{ marginBottom: "2rem" }}>
          {brandChoices.heroLayout === "centered" && <CenteredHero choices={brandChoices} />}
          {brandChoices.heroLayout === "split" && <SplitHero choices={brandChoices} />}
          {brandChoices.heroLayout === "fullWidth" && <FullWidthHero choices={brandChoices} />}
          {brandChoices.heroLayout === "header1" && <Header1 />}
        </Box>

        {/* Color Palette */}
        <section className="p-6">
          <Text size="6" weight="bold">Color Palette</Text>
          <div className="flex space-x-4">
            {Object.keys(colorScale).length > 0 &&
              Object.keys(colorScale).map((key) => (
                <Box key={key} style={{ backgroundColor: colorScale[key], width: "3rem", height: "3rem", borderRadius: "4px" }} />
              ))
            }
          </div>
        </section>

        {/* Typography Section */}
        <section className="p-8 bg-gray-50 rounded-lg flex flex-col space-y-10">
          {/* Section Title */}
          <Text size="6" weight="bold">Typography</Text>

          {/* Font Family Display */}
          <div className="flex flex-col items-start gap-2 border-b pb-6">
            <Text size="9" weight="bold" style={{ fontFamily: brandChoices.font }}>
              Aa
            </Text>
            <Text size="5" style={{ fontFamily: brandChoices.font }}>
              {brandChoices.font}
            </Text>
          </div>

          {/* Headline Section */}
          <div className="flex flex-col space-y-4 border-b pb-6">
            <Text size="5" weight="bold">Headlines</Text>

            {/* <Text as="h1" size="9" weight="bold" style={{ fontFamily: brandChoices.font }}>
              Display (72px, Bold)
            </Text> */}

            <Text as="h1" size="8" weight="bold" style={{ fontFamily: brandChoices.font }}>
              H1 (48px, Bold)
            </Text>

            <Text as="h2" size="7" weight="medium" style={{ fontFamily: brandChoices.font }}>
              H2 (36px, Medium)
            </Text>

            <Text as="h3" size="6" weight="medium" style={{ fontFamily: brandChoices.font }}>
              H3 (28px, Medium)
            </Text>
          </div>

          {/* Paragraph Section */}
          <div className="flex flex-col space-y-4">
            <Text size="5" weight="bold">Body Text</Text>

            <Text size="4" style={{ fontFamily: brandChoices.font }}>
              P1 (16px, Regular)
            </Text>

            {/* Example Paragraph */}
            <Text size="4" style={{ fontFamily: brandChoices.font, lineHeight: "1.75" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
            </Text>
          </div>
        </section>

        {/* Feature Section */}
        <section className="grid grid-cols-3 gap-6">
          <div className={`p-6 border rounded-lg ${brandChoices.featureLayout === "grid" ? "bg-gray-100" : "bg-gray-200"}`}>
            <Text size="5" weight="bold">Feature One</Text>
            <p style={{ fontFamily: brandChoices.font }}>A key highlight of your brand</p>
          </div>
          <div className={`p-6 border rounded-lg ${brandChoices.featureLayout === "grid" ? "bg-gray-100" : "bg-gray-200"}`}>
            <Text size="5" weight="bold">Feature Two</Text>
            <p style={{ fontFamily: brandChoices.font }}>Another important aspect</p>
          </div>
          <div className={`p-6 border rounded-lg ${brandChoices.featureLayout === "grid" ? "bg-gray-100" : "bg-gray-200"}`}>
            <Text size="5" weight="bold">Feature Three</Text>
            <p style={{ fontFamily: brandChoices.font }}>More about your brand</p>
          </div>
        </section>
      </main>
      
      {/* Sticky Export Button */}
      <Box className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg">
        <Button size="lg" onClick={() => console.log("Export to Figma")}>
          Export to Figma
        </Button>
      </Box>
    </div>
  )
}