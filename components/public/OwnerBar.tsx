import { Alert, Group, Text } from "@mantine/core";
import { ButtonLink } from "@/components/ui/Links";
import type { Dictionary } from "@/lib/i18n";

/** Shown above a public page only to its owner: the page link, a way back and the draft notice. */
const OwnerBar = ({ address, isPublished, t }: { address: string; isPublished: boolean; t: Dictionary }) => (
  <>
    <Group justify="space-between" px="6vw" py={20}>
      <Text fz={13} c="dimmed" ff="monospace">{address}</Text>
      <ButtonLink href="/dashboard" variant="default" size="compact-md">{t.backToDashboard}</ButtonLink>
    </Group>
    {!isPublished && (
      <Alert mx="6vw" mb={20} radius="md" variant="light" ta="center">{t.draftBanner}</Alert>
    )}
  </>
);

export default OwnerBar;
