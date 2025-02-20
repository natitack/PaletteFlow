import { Flex, Box, Text, Button, Card, Heading } from "@radix-ui/themes"
import Image from "next/image"
import { useEffect, useState } from "react"




export function CenteredHero({ choices }) {
    const {
        color = "indigo", // Default indigo color
        mood = "modern",
        font = "system-ui",
        buttonStyle = "none",
        cardStyle = "flat",
        heroLayout = "centered",
        featureLayout = "grid",
      } = choices || {}
      
    return (
        <Flex direction="column" align="center" gap="2">
            <Heading size="4">Centered Hero</Heading>
            <Text>Subtitle text goes here</Text>
            <Button radius={buttonStyle as "none" | "small" | "medium" | "large" | "full"} style={{ fontFamily: font }}>Call to Action</Button>
        </Flex>
    )
}

export function SplitHero({ choices }) {
    const {
        color = "indigo", // Default indigo color
        mood = "modern",
        font = "system-ui",
        buttonStyle = "rounded",
        cardStyle = "none",
        heroLayout = "centered",
        featureLayout = "grid",
      } = choices || {}
      
    return (
        <Flex>
            <Box style={{ flex: 1 }}>
                <Heading size="4">Split Hero</Heading>
                <Text>Subtitle text goes here</Text>
                <Button radius={buttonStyle as "none" | "small" | "medium" | "large" | "full"} style={{ fontFamily: font }}>Call to Action</Button>
                </Box>
            <Box style={{ flex: 1 }}>
                <Image src="/placeholder.svg" alt="Placeholder" width="300" height="300" />
            </Box>
        </Flex>
    )
}

export function FullWidthHero({ choices }) {
    const {
        color = "indigo", // Default indigo color
        mood = "modern",
        font = "system-ui",
        buttonStyle = "rounded",
        cardStyle = "flat",
        heroLayout = "centered",
        featureLayout = "grid",
      } = choices || {}
      
    return (
        <Flex direction="column" align="center" gap="2">
            <Heading size="4">Full Width Hero</Heading>
            <Text>Subtitle text goes here</Text>
            <Button radius={buttonStyle as "none" | "small" | "medium" | "large" | "full"} style={{ fontFamily: font }}>Call to Action</Button>
        </Flex>
    )
}

