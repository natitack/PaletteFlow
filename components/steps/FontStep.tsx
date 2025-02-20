import { Flex, Text, Select } from "@radix-ui/themes"
import { Work_Sans, Inclusive_Sans, Labrada, Fira_Code, Inria_Sans, Source_Serif_4, Fredoka, Roboto, Open_Sans, Reddit_Mono } from "next/font/google"
import { useFontOptions } from "../../hooks/useFontOptions"


export function FontStep({ value, onChange }) {
  const fontOptions = useFontOptions()

  return (
    <Flex direction="column" gap="4">
      <Text size="5" weight="bold">
        Choose your typography
      </Text>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger />
        <Select.Content>
          {fontOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Text size="3" className={value}>
        This is a sample text in the selected font.
      </Text>
    </Flex>
  )
}

