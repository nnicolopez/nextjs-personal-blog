import { Badge, Box, Group, NavLink, Paper, Stack, Text } from "@mantine/core";
import Link from "next/link";
import AppHeader from "@/components/dashboard/AppHeader";
import InstrumentEditor, { type InstrumentDraft } from "@/components/dashboard/InstrumentEditor";
import { ButtonLink } from "@/components/ui/Links";
import { getSiteHost, requireAccount, type Instrument } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPracticesData } from "@/lib/page-data";
import { PRACTICE_HEX } from "@/lib/practices";

interface Props {
  searchParams: Promise<{ i?: string }>;
}

function toDraft(i: Instrument): InstrumentDraft {
  return {
    id: i.id,
    name: i.name,
    slug: i.slug,
    practiceId: i.practiceId,
    kind: i.kind,
    status: i.status,
    summary: i.summary,
    problem: i.problem,
    byMe: i.byMe,
    byAi: i.byAi,
    materials: i.materials,
    demoKind: i.demo?.kind ?? "video",
    demoUrl: i.demo?.url ?? "",
    images: i.images,
    links: i.links,
    featured: i.featured,
    isVisible: i.isVisible,
  };
}

const InstrumentsPage = async ({ searchParams }: Props) => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const { i: selectedId } = await searchParams;
  const { practices, instruments } = account;
  const data = toPracticesData(account, t, lang);

  if (practices.length === 0) {
    return (
      <>
        <AppHeader title={t.navInstruments} lang={lang} />
        <Paper maw={520} p={28}>
          <Text mb={16}>{t.needPracticeFirst}</Text>
          <ButtonLink href="/dashboard/practices">{t.goToPractices}</ButtonLink>
        </Paper>
      </>
    );
  }

  const selected = instruments.find((i) => i.id === selectedId);
  const isNew = selectedId === "new" || (!selected && instruments.length === 0);
  const current = selected ?? (isNew ? undefined : instruments[0]);
  const draft: InstrumentDraft = current
    ? toDraft(current)
    : {
        id: null, name: "", slug: "", practiceId: practices[0].id, kind: "app", status: "building",
        summary: "", problem: "", byMe: "", byAi: "", materials: [], demoKind: "video", demoUrl: "",
        images: [], links: [], featured: false, isVisible: true,
      };
  const practiceColor = new Map(practices.map((p) => [p.id, PRACTICE_HEX[p.color]]));

  return (
    <>
      <AppHeader title={t.navInstruments} lang={lang} />
      <Text fz={15} c="dimmed" maw={560} mb={24}>{t.instrumentsSub}</Text>
      <Group align="flex-start" gap={24} wrap="nowrap" style={{ flexWrap: "wrap" }}>
        <Stack component="nav" aria-label={t.navInstruments} gap={2} w={{ base: "100%", md: 230 }} style={{ flexShrink: 0 }}>
          <ButtonLink href="/dashboard/instruments?i=new" variant={isNew ? "filled" : "default"} mb={10}>{t.newInstrument}</ButtonLink>
          {instruments.length === 0 && <Text fz={13} c="dimmed">{t.noInstruments}</Text>}
          {instruments.map((i) => (
            <NavLink
              key={i.id}
              component={Link}
              href={`/dashboard/instruments?i=${i.id}`}
              active={i.id === current?.id}
              variant="light"
              label={i.name}
              description={data.labels.kind[i.kind]}
              leftSection={<Box w={8} h={8} style={{ borderRadius: "50%", background: practiceColor.get(i.practiceId) }} />}
              rightSection={
                !i.isVisible ? <Badge size="xs" color="gray">{t.hiddenTag}</Badge>
                  : i.featured ? <Badge size="xs">{t.featuredTag}</Badge> : null
              }
            />
          ))}
        </Stack>
        <Box flex={1} miw={0} w="100%">
          <InstrumentEditor
            key={current?.id ?? "new"}
            t={t}
            labels={data.labels}
            initial={draft}
            practices={practices.map(({ id, name, color }) => ({ id, name, color }))}
            buildLog={current ? data.entries.filter((e) => e.instrumentId === current.id) : []}
            fullName={account.page.fullName}
            basePath={data.basePath}
            host={host}
          />
        </Box>
      </Group>
    </>
  );
};

export default InstrumentsPage;
