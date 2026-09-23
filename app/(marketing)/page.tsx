import { Anchor, Badge, Box, Container, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import Parallax from "@/components/marketing/Parallax";
import { samplePage } from "@/components/marketing/sample";
import PagePreview from "@/components/public/PagePreview";
import { ButtonLink } from "@/components/ui/Links";
import { getDictionary } from "@/lib/i18n";
import classes from "@/components/marketing/marketing.module.css";

const SectionHead = ({ title, sub }: { title: string; sub: string }) => (
  <Stack gap={14} maw={640} mx="auto" mb={48} ta="center">
    <Title order={2} fz={34}>{title}</Title>
    <Text fz={17} c="dimmed">{sub}</Text>
  </Stack>
);

const LandingPage = async () => {
  const { lang, t } = await getDictionary();

  return (
    <>
      <MarketingHeader lang={lang} t={t} landing />
      <main>
        <section className={classes.hero}>
          <Parallax />
          <Group className={classes.heroContent} gap={60} align="center">
            <Box className={classes.heroCopy}>
              <Badge size="lg" mb={22} className={classes.heroChip} tt="none">{t.heroChip}</Badge>
              <Title order={1} className={classes.heroTitle}>{t.heroTitle}</Title>
              <Text fz={19} lh={1.6} maw={480} mb={34} c="var(--pc-hero-text-muted)">{t.heroSub}</Text>
              <Group gap={16}>
                <ButtonLink href="/dashboard" size="lg">{t.heroCta}</ButtonLink>
                <Anchor href="#plantilla" fw={600} fz={16} c="var(--pc-hero-text)">{t.heroCta2}</Anchor>
              </Group>
            </Box>
            <Box className={classes.heroMock}>
              <PagePreview data={samplePage(lang)} address="personalcms.com/nico" height={300} scale={0.45} />
            </Box>
          </Group>
        </section>

        <Box component="section" id="quienes" py={70} px="6vw" bg="var(--pc-surface-alt)">
          <SectionHead title={t.whoTitle} sub={t.whoSub} />
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={22} maw={1100} mx="auto">
            {t.who.map((item) => (
              <Paper key={item.title} p={28} radius={20}>
                <Text fw={700} fz={17} mb={8}>{item.title}</Text>
                <Text fz={15} c="dimmed" lh={1.55}>{item.desc}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Box>

        <Box component="section" id="features" py={90} px="6vw">
          <SectionHead title={t.featTitle} sub={t.featSub} />
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing={26} maw={1150} mx="auto">
            {t.features.map((item, i) => (
              <Box key={item.title} p={8}>
                <ThemeIcon size={44} radius={12} color={i % 2 ? "secondary" : "primary"} />
                <Title order={3} fz={18} mt={18} mb={8}>{item.title}</Title>
                <Text fz={15} c="dimmed" lh={1.55}>{item.desc}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        <Box component="section" id="plantilla" pt={30} pb={100} px="6vw">
          <SectionHead title={t.tplTitle} sub={t.tplSub} />
          <Paper maw={1100} mx="auto" p={26} radius={26} withBorder={false} bg="var(--pc-surface-alt)">
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing={22}>
              <PagePreview data={samplePage(lang, "profile")} height={420} scale={0.6} />
              <PagePreview data={samplePage(lang, "grid")} height={420} scale={0.6} />
            </SimpleGrid>
          </Paper>
        </Box>

        <Container component="section" py={80} ta="center">
          <Title order={2} fz={32} mb={20}>{t.ctaTitle}</Title>
          <ButtonLink href="/dashboard" size="lg">{t.heroCta}</ButtonLink>
        </Container>
      </main>
    </>
  );
};

export default LandingPage;
