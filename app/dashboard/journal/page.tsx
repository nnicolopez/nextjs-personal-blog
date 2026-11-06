import { Badge, Box, Divider, Group, Paper, Stack, Text } from "@mantine/core";
import { deleteEntryAction, toggleEntryAction } from "@/app/practice-actions";
import AppHeader from "@/components/dashboard/AppHeader";
import { DeleteEntryButton, EntryForm } from "@/components/dashboard/JournalForms";
import { formatDay } from "@/components/public/practices/format";
import { AnchorLink, ButtonLink } from "@/components/ui/Links";
import SubmitButton from "@/components/ui/SubmitButton";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { PRACTICE_HEX, todayIso } from "@/lib/practices";

interface Props {
  searchParams: Promise<{ e?: string }>;
}

const JournalPage = async ({ searchParams }: Props) => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const { e: editId } = await searchParams;
  const { practices, instruments, entries } = account;

  if (practices.length === 0) {
    return (
      <>
        <AppHeader title={t.navJournal} lang={lang} />
        <Paper maw={520} p={28}>
          <Text mb={16}>{t.needPracticeFirst}</Text>
          <ButtonLink href="/dashboard/practices">{t.goToPractices}</ButtonLink>
        </Paper>
      </>
    );
  }

  const editing = entries.find((x) => x.id === editId);
  const practiceById = new Map(practices.map((p) => [p.id, p]));
  const instrumentById = new Map(instruments.map((i) => [i.id, i]));

  return (
    <>
      <AppHeader title={t.navJournal} lang={lang} />
      <Text fz={15} c="dimmed" maw={560} mb={24}>{t.journalSub}</Text>
      <Stack gap={24} maw={760}>
        <Paper p={24}>
          <EntryForm
            key={editing?.id ?? "new"}
            t={t}
            practices={practices.map(({ id, name }) => ({ id, name }))}
            instruments={instruments.map(({ id, name, practiceId }) => ({ id, name, practiceId }))}
            entry={
              editing ?? {
                id: null, practiceId: practices[0].id, instrumentId: null, date: todayIso(),
                kind: "note", title: "", body: "", mediaUrl: null,
              }
            }
          />
        </Paper>

        <Paper p={8}>
          {entries.length === 0 && <Text p={16} fz={14} c="dimmed">{t.noEntries}</Text>}
          {entries.map((entry, k) => {
            const practice = practiceById.get(entry.practiceId);
            const instrument = entry.instrumentId ? instrumentById.get(entry.instrumentId) : undefined;
            return (
              <Box key={entry.id}>
                {k > 0 && <Divider color="var(--pc-border)" />}
                <Group p={14} gap={14} wrap="nowrap" align="flex-start" opacity={entry.isVisible ? 1 : 0.6}>
                  <Box w={8} h={8} mt={7} style={{ borderRadius: "50%", flexShrink: 0, background: practice ? PRACTICE_HEX[practice.color] : undefined }} />
                  <Box flex={1} miw={0}>
                    <Group gap={8}>
                      <Text fz={13} c="dimmed">{formatDay(entry.date, lang)}</Text>
                      <Text fz={13} c="dimmed">{practice?.name}{instrument ? `, ${instrument.name}` : ""}</Text>
                      <Badge size="xs" color="gray">{t.entryKinds[entry.kind]}</Badge>
                      {!entry.isVisible && <Badge size="xs" color="gray" variant="outline">{t.hiddenTag}</Badge>}
                    </Group>
                    <AnchorLink href={`/dashboard/journal?e=${entry.id}`} fw={600} fz={15} c="var(--pc-text)">{entry.title}</AnchorLink>
                  </Box>
                  <Group gap={4} wrap="nowrap">
                    <form action={toggleEntryAction.bind(null, entry.id)}>
                      <SubmitButton variant="subtle" size="compact-xs">{entry.isVisible ? t.hideAction : t.showAction}</SubmitButton>
                    </form>
                    <DeleteEntryButton label={t.deleteEntry} confirm={t.confirmDeleteShort} action={deleteEntryAction.bind(null, entry.id)} />
                  </Group>
                </Group>
              </Box>
            );
          })}
        </Paper>
      </Stack>
    </>
  );
};

export default JournalPage;
