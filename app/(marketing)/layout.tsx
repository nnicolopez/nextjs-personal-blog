import { getDictionary } from "@/lib/i18n";
import styles from "@/components/marketing/marketing.module.css";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { t } = await getDictionary();
  return (
    <div className={styles.shell}>
      {children}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>PersonalCMS</div>
        <div className={styles.footerTag}>{t.footerTag}</div>
      </footer>
    </div>
  );
}
