import Link from "next/link";
import { Badge, Box, Divider, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import AppHeader from "@/components/dashboard/AppHeader";
import { PublishButton } from "@/components/dashboard/ActionButtons";
import { SectionSwitch } from "@/components/dashboard/SectionToggles";
import PagePreview from "@/components/public/PagePreview";
import { ButtonLink } from "@/components/ui/Links";
import { getSiteHost, requireAccount } from "@/lib/data";
import { getDictionary, timeAgo } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";

const Stat = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Paper p={20} radius={16}>
    <Text fz={12} c="dimmed" mb={8}>{label}</Text>
    {children}
  </Paper>
);

const DashboardPage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const { page, user, sections } = account;

  if (!page.publishedAt) {
    const steps = [
      { text: t.step1, action: <ButtonLink href="/dashboard/editor" variant="subtle" size="compact-sm">{t.go}</ButtonLink> },
      { text: t.step2, action: <ButtonLink href="/dashboard/template" variant="subtle" size="compact-sm">{t.go}</ButtonLink> },
      { text: t.step3, action: <PublishButton isPublished={false} label={t.publishGo} variant="subtle" size="compact-sm" /> },
    ];
    return (
      <>
        <AppHeader title={t.navSummary} lang={lang} />
        <Paper maw={560} p={32}>
          <Text fz={12} fw={700} c="var(--pc-accent1)" mb={8}>{t.startHere}</Text>
          <Title order={2} fz={20} mb={18}>{t.threeSteps}</Title>
          <Stack gap={12}>
            {steps.map((step, i) => (
              <Group key={step.text} gap={12} p={14} bg="var(--pc-surface-alt)" style={{ borderRadius: 12 }} wrap="nowrap">
                <ThemeIcon radius="xl" size={24} fz={13} fw={700}>{i + 1}</ThemeIcon>
                <Text fz={14} flex={1}>{step.text}</Text>
                {step.action}
              </Group>
            ))}
          </Stack>
        </Paper>
      </>
    );
  }

  return (
    <>
      <AppHeader title={t.navSummary} lang={lang} />
      <Group gap={14} mb={28}>
        <Text fz={15} c="dimmed">{t.hello} {page.fullName} 👋</Text>
        <Badge color={page.isPublished ? "primary" : "gray"}>{page.isPublished ? t.published : t.draft}</Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 3 }} spacing={16} mb={28}>
        <Stat label={t.lastEdit}>
          <Text fz={20} fw={700}>{timeAgo(page.updatedAt, lang, t.justNow)}</Text>
        </Stat>
        <Stat label={t.visibleSections}>
          <Text fz={26} fw={700}>{sections.filter((s) => s.isVisible).length}/{sections.length}</Text>
        </Stat>
        <Stat label={t.publishing}>
          <PublishButton
            isPublished={page.isPublished}
            label={page.isPublished ? t.moveToDraft : t.publish}
            variant={page.isPublished ? "default" : "filled"}
            size="compact-md"
          />
        </Stat>
      </SimpleGrid>

      <Group align="flex-start" gap={24}>
        <Link href={`/${user.username}`} style={{ flex: "1 1 380px", minWidth: 0, textDecoration: "none" }}>
          <PagePreview data={toPublicPageData(account)} address={`${host}/${user.username}`} height={300} scale={0.45} />
        </Link>
        <Paper flex="1 1 300px" miw={0} p={22}>
          <Text fz={14} fw={700} mb={14}>{t.sections}</Text>
          <Stack gap={0}>
            {sections.map((section, i) => (
              <Box key={section.id}>
                {i > 0 && <Divider color="var(--pc-border)" />}
                <Box py={9}>
                  <SectionSwitch sectionId={section.id} visible={section.isVisible} label={t.sectionLabels[section.type]} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Group>
    </>
  );
};

export default DashboardPage;
