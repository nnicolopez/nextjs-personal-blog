import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Alert, Box, Group, Text } from "@mantine/core";
import { auth } from "@/auth";
import PublicPage from "@/components/public/PublicPage";
import { ButtonLink } from "@/components/ui/Links";
import { getAccountByUsername, getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";
import { normalizeUsername } from "@/lib/validation";

interface Props {
  params: Promise<{ username: string }>;
}

/** The page, if the viewer may see it: published, or a draft seen by its owner. */
const loadPage = cache(async (rawUsername: string) => {
  const account = await getAccountByUsername(normalizeUsername(decodeURIComponent(rawUsername)));
  if (!account) return null;
  const session = await auth();
  const isOwner = session?.user?.email?.toLowerCase() === account.user.email;
  if (!account.page.isPublished && !isOwner) return null;
  return { account, isOwner };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadPage((await params).username);
  return { title: result ? `${result.account.page.fullName} · PersonalCMS` : "PersonalCMS" };
}

const UserPage = async ({ params }: Props) => {
  const result = await loadPage((await params).username);
  if (!result) notFound();

  const { account, isOwner } = result;
  const { t } = await getDictionary();
  const host = await getSiteHost();

  return (
    <Box mih="100vh" display="flex" style={{ flexDirection: "column" }}>
      {isOwner && (
        <Group justify="space-between" px="6vw" py={20}>
          <Text fz={13} c="dimmed" ff="monospace">{host}/{account.user.username}</Text>
          <ButtonLink href="/dashboard" variant="default" size="compact-md">{t.backToDashboard}</ButtonLink>
        </Group>
      )}
      {isOwner && !account.page.isPublished && (
        <Alert mx="6vw" radius="md" variant="light" ta="center">{t.draftBanner}</Alert>
      )}
      <Box component="main" flex={1} pt={20}>
        <PublicPage data={toPublicPageData(account)} />
      </Box>
      <Text component="footer" ta="center" p={24} fz={13} c="dimmed" style={{ borderTop: "1px solid var(--pc-border)" }}>
        {t.madeWith}
      </Text>
    </Box>
  );
};

export default UserPage;
