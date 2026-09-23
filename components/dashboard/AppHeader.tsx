import { Group, Title } from "@mantine/core";
import Toggles from "@/components/ui/Toggles";
import type { Lang } from "@/lib/i18n";

const AppHeader = ({ title, lang }: { title: string; lang: Lang }) => (
  <Group justify="space-between" mb={32} gap="md">
    <Title order={1} fz={24}>{title}</Title>
    <Toggles lang={lang} compact />
  </Group>
);

export default AppHeader;
