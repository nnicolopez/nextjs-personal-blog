import { Badge, Box, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import AppHeader from "@/components/dashboard/AppHeader";
import { TemplateButton } from "@/components/dashboard/ActionButtons";
import PagePreview from "@/components/public/PagePreview";
import { TEMPLATES } from "@/db";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";

const TemplatePage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const data = toPublicPageData(account);

  return (
    <>
      <AppHeader title={t.navTemplatePage} lang={lang} />
      <Text fz={15} c="dimmed" maw={520} mb={24}>{t.tplPageSub}</Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={22} maw={800}>
        {TEMPLATES.map((template) => {
          const inUse = account.page.template === template;
          return (
            <Paper key={template} p={20} style={{ borderWidth: 2, borderColor: inUse ? "var(--pc-accent1)" : undefined }}>
              <Box mb={16}>
                <PagePreview data={{ ...data, template }} height={170} scale={0.3} />
              </Box>
              <Group justify="space-between" mb={6}>
                <Text fz={15} fw={700}>{t.templates[template].name}</Text>
                {inUse && <Badge size="sm">{t.inUse}</Badge>}
              </Group>
              <Text fz={13} c="dimmed" mb={14}>{t.templates[template].desc}</Text>
              <TemplateButton template={template} label={t.useTemplate} disabled={inUse} />
            </Paper>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default TemplatePage;
