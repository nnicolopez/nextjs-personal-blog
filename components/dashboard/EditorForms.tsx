"use client";

import { useActionState, useEffect, useState } from "react";
import { saveProfileAction, saveSectionAction, saveSocialAction, type FormState } from "@/app/actions";
import FieldError from "@/components/ui/FieldError";
import SubmitButton from "@/components/ui/SubmitButton";
import ui from "@/components/ui/ui.module.css";
import type { Dictionary } from "@/lib/i18n";
import styles from "./dashboard.module.css";

/** Shows "Saved ✓" next to the button for a few seconds after a save. */
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
    <div className={styles.saveRow}>
      <SubmitButton>{t.saveChanges}</SubmitButton>
      {showSaved && <span className={styles.saved} role="status">{t.saved}</span>}
    </div>
  );
};

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
      <div className={styles.cardTitle}>{t.profile}</div>
      <div className={styles.avatarRow}>
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" width={72} height={72} referrerPolicy="no-referrer" />
        ) : (
          <div className={styles.avatarPlaceholder} />
        )}
        <span>{t.avatarHint}</span>
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="fullName">{t.fullNameLabel}</label>
        <input id="fullName" name="fullName" className={ui.input} defaultValue={state.values?.fullName ?? values.fullName} required maxLength={80} />
        <FieldError message={state.errors?.fullName} />
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="username">{t.usernameLabel}</label>
        <div className={ui.prefixed}>
          <span>{host}/</span>
          <input id="username" name="username" defaultValue={state.values?.username ?? values.username} required maxLength={30} autoComplete="off" spellCheck={false} />
        </div>
        <FieldError message={state.errors?.username} />
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="bio">{t.bioLabel}</label>
        <textarea id="bio" name="bio" className={ui.textarea} rows={3} defaultValue={state.values?.bio ?? values.bio} maxLength={600} />
        <FieldError message={state.errors?.bio} />
      </div>
      <SaveRow state={state} t={t} />
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
      <div className={styles.cardTitle}>{t.socialLinks}</div>
      {SOCIAL_FIELDS.map((field) => (
        <div key={field.key} className={ui.field}>
          <label className={ui.label} htmlFor={field.key}>{field.label}</label>
          <input
            id={field.key}
            name={field.key}
            className={ui.input}
            defaultValue={state.values?.[field.key] ?? values[field.key]}
            placeholder={field.placeholder}
            maxLength={200}
            inputMode="url"
            autoComplete="off"
          />
          <FieldError message={state.errors?.[field.key]} />
        </div>
      ))}
      <SaveRow state={state} t={t} />
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
    <>
      {/* Outside the form: the visibility toggle is its own form, and forms can't nest */}
      <div className={styles.sectionHead}>
        <div className={styles.cardTitle}>{heading}</div>
        {visibility}
      </div>
      <form action={formAction}>
        <input type="hidden" name="sectionId" value={sectionId} />
        <div className={ui.field}>
          <label className={ui.label} htmlFor="title">{t.titleLabel}</label>
          <input id="title" name="title" className={ui.input} defaultValue={state.values?.title ?? values.title} required maxLength={80} />
          <FieldError message={state.errors?.title} />
        </div>
        <div className={ui.field}>
          <label className={ui.label} htmlFor="content">{t.contentLabel}</label>
          <textarea id="content" name="content" className={ui.textarea} rows={6} defaultValue={state.values?.content ?? values.content} maxLength={5000} />
          <FieldError message={state.errors?.content} />
        </div>
        <SaveRow state={state} t={t} />
      </form>
    </>
  );
};
