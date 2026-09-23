"use client";

import { useActionState, useState } from "react";
import { Stack, Text, TextInput } from "@mantine/core";
import { createAccountAction } from "@/app/actions";
import SubmitButton from "@/components/ui/SubmitButton";
import UsernameInput from "@/components/ui/UsernameInput";
import type { Dictionary } from "@/lib/i18n";

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
      <Stack gap="md">
        <TextInput
          label={t.fullNameLabel}
          name="fullName"
          defaultValue={state.values?.fullName ?? defaultName}
          required
          maxLength={80}
          error={state.errors?.fullName}
        />
        <div>
          <UsernameInput
            label={t.pickUsername}
            host={host}
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value.toLowerCase())}
            error={state.errors?.username}
          />
          <Text fz={13} c="var(--pc-accent1)" mt={6} style={{ wordBreak: "break-all" }}>
            {t.yourPage} {host}/{username || "…"}
          </Text>
        </div>
        <SubmitButton fullWidth size="md" mt="xs">{t.welcomeSubmit}</SubmitButton>
      </Stack>
    </form>
  );
};

export default WelcomeForm;
