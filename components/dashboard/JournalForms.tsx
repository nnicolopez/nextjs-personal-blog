"use client";

import { useActionState, useState } from "react";
import { Button, Group, SegmentedControl, Select, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { saveEntryAction } from "@/app/practice-actions";
import SubmitButton from "@/components/ui/SubmitButton";
import type { EntryKind } from "@/db/schema";
import type { Dictionary } from "@/lib/i18n";
import { SaveRow } from "./EditorForms";
import { ButtonLink } from "@/components/ui/Links";
import UploadButton from "./UploadButton";

interface Props {
  t: Dictionary;
  username: string;
  practices: { id: string; name: string }[];
  instruments: { id: string; name: string; practiceId: string }[];
  entry: {
    id: string | null;
    practiceId: string;
    instrumentId: string | null;
    date: string;
    kind: EntryKind;
    title: string;
    body: string;
    mediaUrl: string | null;
  };
}

/** New or existing journal entry. Instruments are filtered by the chosen practice. */
export const EntryForm = ({ t, username, practices, instruments, entry }: Props) => {
  const [state, formAction] = useActionState(saveEntryAction, {});
  const [practiceId, setPracticeId] = useState(state.values?.practiceId ?? entry.practiceId);
  const [instrumentId, setInstrumentId] = useState<string | null>(state.values?.instrumentId ?? entry.instrumentId);
  const [kind, setKind] = useState<EntryKind>(entry.kind);
  const [mediaUrl, setMediaUrl] = useState(state.values?.mediaUrl ?? entry.mediaUrl ?? "");
  const err = state.errors ?? {};
  const options = instruments.filter((i) => i.practiceId === practiceId);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={entry.id ?? ""} />
      <input type="hidden" name="kind" value={kind} />
      <Stack gap="md">
        <Text fw={700}>{entry.id ? t.editLabel : t.newEntry}</Text>
        <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="sm">
          <Select
            label={t.practiceLabel}
            name="practiceId"
            data={practices.map((p) => ({ value: p.id, label: p.name }))}
            value={practiceId}
            onChange={(v) => { if (v) { setPracticeId(v); setInstrumentId(null); } }}
            allowDeselect={false}
            error={err.practiceId}
          />
          <Select
            label={t.instrumentOptional}
            name="instrumentId"
            data={options.map((i) => ({ value: i.id, label: i.name }))}
            value={options.some((i) => i.id === instrumentId) ? instrumentId : null}
            onChange={setInstrumentId}
            placeholder={t.none}
            clearable
            disabled={options.length === 0}
            error={err.instrumentId}
          />
          <TextInput type="date" label={t.dateLabel} name="date" defaultValue={state.values?.date ?? entry.date} required error={err.date} />
        </SimpleGrid>
        <div>
          <Text fz={13} fw={600} mb={7}>{t.entryKindLabel}</Text>
          <SegmentedControl
            value={kind}
            onChange={(v) => setKind(v as EntryKind)}
            data={(Object.keys(t.entryKinds) as EntryKind[]).map((k) => ({ value: k, label: t.entryKinds[k] }))}
          />
        </div>
        <TextInput label={t.titleLabel} name="title" defaultValue={state.values?.title ?? entry.title} required maxLength={120} error={err.title} />
        <Textarea label={t.entryBodyLabel} name="body" autosize minRows={3} maxRows={12} defaultValue={state.values?.body ?? entry.body} maxLength={3000} error={err.body} />
        {kind !== "note" && (
          <Stack gap={8}>
            <TextInput label={t.mediaUrlLabel} name="mediaUrl" value={mediaUrl} onChange={(e) => setMediaUrl(e.currentTarget.value)} inputMode="url" maxLength={300} error={err.mediaUrl} />
            {(kind === "photo" || kind === "audio") && (
              <UploadButton
                username={username}
                folder="bitacora"
                kind={kind === "audio" ? "audio" : "image"}
                label={kind === "audio" ? t.uploadAudio : t.uploadPhoto}
                labels={{ uploading: t.uploading, tooBig: t.tooBig, failed: t.uploadFailed }}
                onUploaded={(url) => setMediaUrl(url)}
              />
            )}
          </Stack>
        )}
        {entry.id ? (
          <Group gap={10}>
            <SaveRow state={state} t={t} />
            <ButtonLink href="/dashboard/journal" variant="default" mt={6}>{t.cancel}</ButtonLink>
          </Group>
        ) : (
          <Group mt={6}><SubmitButton>{t.createEntry}</SubmitButton></Group>
        )}
      </Stack>
    </form>
  );
};

export const DeleteEntryButton = ({ label, confirm, action }: { label: string; confirm: string; action: () => Promise<void> }) => {
  const [asking, setAsking] = useState(false);
  if (!asking) return <Button variant="subtle" color="red" size="compact-xs" onClick={() => setAsking(true)}>{label}</Button>;
  return (
    <form action={action}>
      <Group gap={6} wrap="nowrap">
        <Text fz={12}>{confirm}</Text>
        <SubmitButton color="red" size="compact-xs">{label}</SubmitButton>
      </Group>
    </form>
  );
};
