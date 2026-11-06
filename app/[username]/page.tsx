import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Text } from "@mantine/core";
import OwnerBar from "@/components/public/OwnerBar";
import PublicPage from "@/components/public/PublicPage";
import { getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";
import { loadPublicAccount as loadPage } from "@/lib/public-page";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await loadPage((await params).username);
  return { title: result ? `${result.account.page.fullName} · PersonalCMS` : "PersonalCMS" };
}

const UserPage = async ({ params }: Props) => {
  const result = await loadPage((await params).username);
  if (!result) notFound();

  const { account, isOwner } = result;
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const data = toPublicPageData(account, t, lang);
  const ownerBar = isOwner && (
    <OwnerBar address={`${host}/${account.user.username}`} isPublished={account.page.isPublished} t={t} />
  );

  // The practices template brings its own header, footer and background
  if (data.template === "practices") {
    return (
      <>
        {ownerBar}
        <PublicPage data={data} />
      </>
    );
  }

  return (
    <Box mih="100vh" display="flex" style={{ flexDirection: "column" }}>
      {ownerBar}
      <Box component="main" flex={1} pt={20}>
        <PublicPage data={data} />
      </Box>
      <Text component="footer" ta="center" p={24} fz={13} c="dimmed" style={{ borderTop: "1px solid var(--pc-border)" }}>
        {t.madeWith}
      </Text>
    </Box>
  );
};

export default UserPage;
