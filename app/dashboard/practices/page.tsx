import { Stack, Text } from "@mantine/core";
import AppHeader from "@/components/dashboard/AppHeader";
import { PracticeCard } from "@/components/dashboard/PracticeForms";
import SubmitButton from "@/components/ui/SubmitButton";
import { createPracticeAction } from "@/app/practice-actions";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

const PracticesPage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const list = account.practices;

  return (
    <>
      <AppHeader title={t.navPractices} lang={lang} />
      <Text fz={15} c="dimmed" maw={560} mb={24}>{t.practicesSub}</Text>
      <Stack gap={18} maw={640}>
        {list.length === 0 && <Text fz={14}>{t.noPractices}</Text>}
        {list.map((practice, i) => (
          <PracticeCard
            key={practice.id}
            t={t}
            practice={practice}
            counts={{
              instruments: account.instruments.filter((x) => x.practiceId === practice.id).length,
              entries: account.entries.filter((x) => x.practiceId === practice.id).length,
            }}
            isFirst={i === 0}
            isLast={i === list.length - 1}
          />
        ))}
        <form action={createPracticeAction}>
          <SubmitButton variant="default">{t.newPractice}</SubmitButton>
        </form>
      </Stack>
    </>
  );
};

export default PracticesPage;
