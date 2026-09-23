import { Center, Stack, Text, Title } from "@mantine/core";
import { ButtonLink } from "@/components/ui/Links";
import { getDictionary } from "@/lib/i18n";

const NotFound = async () => {
  const { t } = await getDictionary();
  return (
    <Center component="main" mih="100vh" px="6vw">
      <Stack align="center" ta="center" gap={16}>
        <Text fz={15} fw={700} c="var(--pc-accent1)">404</Text>
        <Title order={1} fz={32}>{t.notFoundTitle}</Title>
        <Text fz={16} c="dimmed" maw={420} mb={10}>{t.notFoundSub}</Text>
        <ButtonLink href="/" size="md">{t.backHome}</ButtonLink>
      </Stack>
    </Center>
  );
};

export default NotFound;
