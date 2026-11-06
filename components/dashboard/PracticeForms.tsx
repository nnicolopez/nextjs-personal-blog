"use client";

import { useActionState, useState } from "react";
import { ActionIcon, CheckIcon, ColorSwatch, Group, Paper, Stack, Switch, Text, Textarea, TextInput, Tooltip } from "@mantine/core";
import { deletePracticeAction, movePracticeAction, savePracticeAction } from "@/app/practice-actions";
import SubmitButton from "@/components/ui/SubmitButton";
import type { PracticeColor } from "@/db/schema";
import type { Dictionary } from "@/lib/i18n";
import { PRACTICE_HEX } from "@/lib/practices";
import { SaveRow } from "./EditorForms";

interface Props {
  t: Dictionary;
  practice: { id: string; name: string; description: string; color: PracticeColor; showInSequencer: boolean };
  counts: { instruments: number; entries: number };
  isFirst: boolean;
  isLast: boolean;
}

/** One practice: name, color from the v2 palette, sequencer toggle, order and delete. */
export const PracticeCard = ({ t, practice, counts, isFirst, isLast }: Props) => {
  const [state, formAction] = useActionState(savePracticeAction, {});
  const [deleteState, deleteAction] = useActionState(deletePracticeAction, {});
  const [color, setColor] = useState<PracticeColor>(practice.color);

  return (
    <Paper p={22}>
      <Group justify="space-between" align="flex-start" mb={12} wrap="nowrap">
        <Group gap={10} wrap="nowrap">
          <ColorSwatch color={PRACTICE_HEX[color]} size={14} withShadow={false} />
          <Text fw={700}>{practice.name}</Text>
          <Text fz={13} c="dimmed">
            {counts.instruments} {counts.instruments === 1 ? t.practicesPublic.instrumentOne : t.countInstruments}, {counts.entries} {counts.entries === 1 ? t.practicesPublic.entryOne : t.countEntries}
          </Text>
        </Group>
        <Group gap={6} wrap="nowrap">
          <form action={movePracticeAction.bind(null, practice.id, -1)}>
            <Tooltip label={t.moveUp}><ActionIcon type="submit" size={30} disabled={isFirst} aria-label={t.moveUp}>↑</ActionIcon></Tooltip>
          </form>
          <form action={movePracticeAction.bind(null, practice.id, 1)}>
            <Tooltip label={t.moveDown}><ActionIcon type="submit" size={30} disabled={isLast} aria-label={t.moveDown}>↓</ActionIcon></Tooltip>
          </form>
        </Group>
      </Group>

      <form action={formAction}>
        <input type="hidden" name="id" value={practice.id} />
        <input type="hidden" name="color" value={color} />
        <Stack gap="md">
          <TextInput label={t.practiceName} name="name" defaultValue={state.values?.name ?? practice.name} required maxLength={80} error={state.errors?.name} />
          <Textarea label={t.practiceDescription} name="description" autosize minRows={2} defaultValue={state.values?.description ?? practice.description} maxLength={300} error={state.errors?.description} />
          <div>
            <Text fz={13} fw={600} mb={7} id={`color-${practice.id}`}>{t.practiceColor}</Text>
            <Group gap={8} role="radiogroup" aria-labelledby={`color-${practice.id}`}>
              {(Object.keys(PRACTICE_HEX) as PracticeColor[]).map((key) => (
                <Tooltip key={key} label={t.practiceColors[key]}>
                  <ColorSwatch
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={color === key}
                    aria-label={t.practiceColors[key]}
                    color={PRACTICE_HEX[key]}
                    onClick={() => setColor(key)}
                    style={{ color: "#fff", cursor: "pointer" }}
                  >
                    {color === key && <CheckIcon size={12} />}
                  </ColorSwatch>
                </Tooltip>
              ))}
            </Group>
          </div>
          <Switch name="showInSequencer" label={t.showInSequencer} defaultChecked={practice.showInSequencer} />
          <SaveRow state={state} t={t} />
        </Stack>
      </form>

      <form action={deleteAction}>
        <input type="hidden" name="id" value={practice.id} />
        <Group mt={14} gap={12}>
          <SubmitButton variant="subtle" color="red" size="compact-sm">{t.deletePractice}</SubmitButton>
          {deleteState.errors?.delete && <Text fz={13} c="red" role="alert">{deleteState.errors.delete}</Text>}
        </Group>
      </form>
    </Paper>
  );
};
