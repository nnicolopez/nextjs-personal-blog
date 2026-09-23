import Link from "next/link";
import { signOutAction } from "@/app/actions";
import SidebarNav from "@/components/dashboard/SidebarNav";
import ui from "@/components/ui/ui.module.css";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import styles from "@/components/dashboard/dashboard.module.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const account = await requireAccount();
  const { t } = await getDictionary();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/" className={`${ui.logo} ${styles.sidebarLogo}`}>PersonalCMS</Link>
        <SidebarNav
          items={[
            { href: "/dashboard", label: t.navSummary },
            { href: "/dashboard/editor", label: t.navEditPage },
            { href: "/dashboard/template", label: t.navTemplatePage },
            { href: "/dashboard/settings", label: t.navSettings },
          ]}
        />
        <Link href={`/${account.user.username}`} className={`${styles.navItem} ${styles.navPublic}`}>
          {t.navViewPublic}
        </Link>
        <div className={styles.sidebarSpacer} />
        <form action={signOutAction}>
          <button type="submit" className={styles.navItem}>{t.navLogout}</button>
        </form>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
