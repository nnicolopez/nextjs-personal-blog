"use client";

import { useActionState, useEffect, useState } from "react";
import { Avatar, Group, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { saveProfileAction, saveSectionAction, saveSocialAction, type FormState } from "@/app/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import UsernameInput from "@/components/ui/UsernameInput";
import type { Dictionary } from "@/lib/i18n";

/** Save button plus a "Saved ✓" note for a few seconds after a save. */
const SaveRow = ({ state, t }: { state: FormState; t: Dictionary }) => {
  // Each save returns a new state object; remember which one already timed out
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const showSaved = state.ok && dismissed !== state;
  useEffect(() => {
    if (!state.ok) return;
    const timer = setTimeout(() => setDismissed(state), 2500);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <Group gap={14} mt={6}>
      <SubmitButton>{t.saveChanges}</SubmitButton>
      {showSaved && <Text fz={13} fw={600} c="var(--pc-accent1)" role="status">{t.saved}</Text>}
    </Group>
  );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <Text fz={16} fw={700}>{children}</Text>
);

interface ProfileProps {
  t: Dictionary;
  host: string;
  avatarUrl: string | null;
  values: { fullName: string; username: string; bio: string };
}

export const ProfileForm = ({ t, host, avatarUrl, values }: ProfileProps) => {
  const [state, formAction] = useActionState(saveProfileAction, {});
  return (
    <form action={formAction}>
      <Stack gap="md">
        <CardTitle>{t.profile}</CardTitle>
        <Group gap={16} wrap="nowrap">
          <Avatar src={avatarUrl} name={values.fullName} size={72} color="initials" imageProps={{ referrerPolicy: "no-referrer" }} />
          <Text fz={13} c="dimmed">{t.avatarHint}</Text>
        </Group>
        <TextInput
          label={t.fullNameLabel}
          name="fullName"
          defaultValue={state.values?.fullName ?? values.fullName}
          required
          maxLength={80}
          error={state.errors?.fullName}
        />
        <UsernameInput
          label={t.usernameLabel}
          host={host}
          defaultValue={state.values?.username ?? values.username}
          error={state.errors?.username}
        />
        <Textarea
          label={t.bioLabel}
          name="bio"
          rows={3}
          autosize
          minRows={3}
          defaultValue={state.values?.bio ?? values.bio}
          maxLength={600}
          error={state.errors?.bio}
        />
        <SaveRow state={state} t={t} />
      </Stack>
    </form>
  );
};

interface SocialProps {
  t: Dictionary;
  values: { linkedin: string; github: string; instagram: string };
}

const SOCIAL_FIELDS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/usuario" },
  { key: "github", label: "GitHub", placeholder: "github.com/usuario" },
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/usuario" },
] as const;

export const SocialForm = ({ t, values }: SocialProps) => {
  const [state, formAction] = useActionState(saveSocialAction, {});
  return (
    <form action={formAction}>
      <Stack gap="md">
        <CardTitle>{t.socialLinks}</CardTitle>
        {SOCIAL_FIELDS.map((field) => (
          <TextInput
            key={field.key}
            label={field.label}
            name={field.key}
            defaultValue={state.values?.[field.key] ?? values[field.key]}
            placeholder={field.placeholder}
            maxLength={200}
            inputMode="url"
            autoComplete="off"
            error={state.errors?.[field.key]}
          />
        ))}
        <SaveRow state={state} t={t} />
      </Stack>
    </form>
  );
};

interface SectionProps {
  t: Dictionary;
  sectionId: string;
  heading: string;
  visibility: React.ReactNode;
  values: { title: string; content: string };
}

export const SectionForm = ({ t, sectionId, heading, visibility, values }: SectionProps) => {
  const [state, formAction] = useActionState(saveSectionAction, {});
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <CardTitle>{heading}</CardTitle>
        {visibility}
      </Group>
      <form action={formAction}>
        <input type="hidden" name="sectionId" value={sectionId} />
        <Stack gap="md">
          <TextInput
            label={t.titleLabel}
            name="title"
            defaultValue={state.values?.title ?? values.title}
            required
            maxLength={80}
            error={state.errors?.title}
          />
          <Textarea
            label={t.contentLabel}
            name="content"
            autosize
            minRows={6}
            maxRows={16}
            defaultValue={state.values?.content ?? values.content}
            maxLength={5000}
            error={state.errors?.content}
          />
          <SaveRow state={state} t={t} />
        </Stack>
      </form>
    </Stack>
  );
};
