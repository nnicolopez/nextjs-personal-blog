import { Box, Group, Text } from "@mantine/core";
import { getDictionary } from "@/lib/i18n";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getDictionary();
  return (
    <Box mih="100vh" display="flex" style={{ flexDirection: "column" }}>
      {children}
      <Group
        component="footer"
        justify="space-between"
        px="6vw"
        py={36}
        mt="auto"
        style={{ borderTop: "1px solid var(--pc-border)" }}
      >
        <Text fw={800} fz={20}>PersonalCMS</Text>
        <Text fz={14} c="dimmed">{t.footerTag}</Text>
      </Group>
    </Box>
  );
}
