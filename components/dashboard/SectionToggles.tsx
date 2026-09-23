"use client";

import { useOptimistic, useTransition } from "react";
import { Chip, Switch } from "@mantine/core";
import { toggleSectionAction } from "@/app/actions";

/** Flips a section's visibility right away and saves it in the background. */
function useSectionVisibility(sectionId: string, visible: boolean) {
  const [optimistic, setOptimistic] = useOptimistic(visible);
  const [pending, startTransition] = useTransition();
  const toggle = () =>
    startTransition(async () => {
      setOptimistic(!optimistic);
      await toggleSectionAction(sectionId);
    });
  return { visible: optimistic, pending, toggle };
}

export const SectionSwitch = ({ sectionId, visible, label }: { sectionId: string; visible: boolean; label: string }) => {
  const state = useSectionVisibility(sectionId, visible);
  return (
    <Switch
      checked={state.visible}
      onChange={state.toggle}
      disabled={state.pending}
      aria-label={label}
      label={label}
      labelPosition="left"
      styles={{ body: { justifyContent: "space-between" }, labelWrapper: { flex: 1 }, label: { paddingLeft: 0, fontSize: 14 } }}
    />
  );
};

export const VisibilityChip = ({ sectionId, visible, labels }: { sectionId: string; visible: boolean; labels: { visible: string; hidden: string } }) => {
  const state = useSectionVisibility(sectionId, visible);
  return (
    <Chip checked={state.visible} onChange={state.toggle} disabled={state.pending} size="xs" variant="light">
      {state.visible ? labels.visible : labels.hidden}
    </Chip>
  );
};
