import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import PublicPage from "@/components/public/PublicPage";
import ui from "@/components/ui/ui.module.css";
import { getAccountByUsername, getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { toPublicPageData } from "@/lib/page-data";
import { normalizeUsername } from "@/lib/validation";
import styles from "@/components/public/PublicPage.module.css";

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
    <div className={styles.page}>
      {isOwner && (
        <div className={styles.ownerBar}>
          <span>{host}/{account.user.username}</span>
          <Link href="/dashboard" className={ui.btnSecondary}>{t.backToDashboard}</Link>
        </div>
      )}
      {isOwner && !account.page.isPublished && <div className={styles.draftBanner}>{t.draftBanner}</div>}
      <main className={styles.content}>
        <PublicPage data={toPublicPageData(account)} />
      </main>
      <footer className={styles.footer}>{t.madeWith}</footer>
    </div>
  );
};

export default UserPage;
