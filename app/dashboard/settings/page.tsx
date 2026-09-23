import { Paper, Stack, Text, TextInput } from "@mantine/core";
import AppHeader from "@/components/dashboard/AppHeader";
import DeleteAccount from "@/components/dashboard/DeleteAccount";
import ThemePicker from "@/components/dashboard/ThemePicker";
import { getThemeId } from "@/lib/appearance";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { THEMES } from "@/themes";

const SettingsPage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const themeId = await getThemeId();

  return (
    <>
      <AppHeader title={t.navSettings} lang={lang} />
      <Stack gap={20} maw={520}>
        <Paper p={26}>
          <Text fz={15} fw={700} mb={18}>{t.account}</Text>
          <TextInput label={t.emailLabel} value={account.user.email} readOnly description={t.emailHint} inputWrapperOrder={["label", "input", "description"]} />
        </Paper>
        <Paper p={26}>
          <Text fz={15} fw={700} mb={4}>{t.appearance}</Text>
          <Text fz={13} c="dimmed" mb={16}>{t.appearanceHint}</Text>
          <ThemePicker
            current={themeId}
            options={THEMES.map((theme) => ({ id: theme.id, label: theme.label[lang], swatches: theme.swatches }))}
          />
        </Paper>
        <Paper p={26} style={{ borderColor: "var(--pc-danger)" }}>
          <Text fz={15} fw={700} mb={8} c="var(--pc-danger)">{t.dangerZone}</Text>
          <Text fz={13} c="dimmed" mb={16}>{t.dangerDesc}</Text>
          <DeleteAccount t={t} />
        </Paper>
      </Stack>
    </>
  );
};

export default SettingsPage;
