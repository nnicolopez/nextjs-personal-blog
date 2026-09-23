"use client";

import { useOptimistic, useTransition } from "react";
import { ColorSwatch, Group, Radio, SimpleGrid, Text } from "@mantine/core";
import { setThemeAction } from "@/app/actions";

interface Props {
  current: string;
  options: { id: string; label: string; swatches: [string, string] }[];
}

/** Picks one of the app themes in themes/; the choice lives in a cookie. */
const ThemePicker = ({ current, options }: Props) => {
  const [selected, setSelected] = useOptimistic(current);
  const [, startTransition] = useTransition();

  return (
    <Radio.Group
      value={selected}
      onChange={(id) =>
        startTransition(async () => {
          setSelected(id);
          await setThemeAction(id);
        })
      }
    >
      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
        {options.map((option) => (
          <Radio.Card key={option.id} value={option.id} p="md" radius="md">
            <Group wrap="nowrap" gap="sm">
              <Radio.Indicator />
              <Group gap={4}>
                {option.swatches.map((color) => (
                  <ColorSwatch key={color} color={color} size={18} />
                ))}
              </Group>
              <Text fz={14} fw={600}>{option.label}</Text>
            </Group>
          </Radio.Card>
        ))}
      </SimpleGrid>
    </Radio.Group>
  );
};

export default ThemePicker;
