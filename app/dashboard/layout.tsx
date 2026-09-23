import DashboardShell from "@/components/dashboard/DashboardShell";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const account = await requireAccount();
  const { t } = await getDictionary();

  return (
    <DashboardShell
      items={[
        { href: "/dashboard", label: t.navSummary },
        { href: "/dashboard/editor", label: t.navEditPage },
        { href: "/dashboard/template", label: t.navTemplatePage },
        { href: "/dashboard/settings", label: t.navSettings },
      ]}
      publicPage={{ href: `/${account.user.username}`, label: t.navViewPublic }}
      logoutLabel={t.navLogout}
    >
      {children}
    </DashboardShell>
  );
}
