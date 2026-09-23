"use client";

import { useActionState, useState } from "react";
import { createAccountAction } from "@/app/actions";
import FieldError from "@/components/ui/FieldError";
import SubmitButton from "@/components/ui/SubmitButton";
import ui from "@/components/ui/ui.module.css";
import type { Dictionary } from "@/lib/i18n";
import styles from "./marketing.module.css";

interface Props {
  t: Dictionary;
  host: string;
  defaultName: string;
  defaultUsername: string;
}

const WelcomeForm = ({ t, host, defaultName, defaultUsername }: Props) => {
  const [state, formAction] = useActionState(createAccountAction, {});
  const [username, setUsername] = useState(defaultUsername);

  return (
    <form action={formAction}>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="fullName">{t.fullNameLabel}</label>
        <input id="fullName" name="fullName" className={ui.input} defaultValue={state.values?.fullName ?? defaultName} required maxLength={80} />
        <FieldError message={state.errors?.fullName} />
      </div>
      <div className={ui.field}>
        <label className={ui.label} htmlFor="username">{t.pickUsername}</label>
        <div className={ui.prefixed}>
          <span>{host}/</span>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            maxLength={30}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <FieldError message={state.errors?.username} />
        <p className={styles.yourPage}>{t.yourPage} {host}/{username || "…"}</p>
      </div>
      <SubmitButton className={`${ui.btnPrimary} ${ui.btnBlock}`}>{t.welcomeSubmit}</SubmitButton>
    </form>
  );
};

export default WelcomeForm;
