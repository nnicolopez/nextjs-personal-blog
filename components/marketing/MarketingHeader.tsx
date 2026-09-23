import Link from "next/link";
import Toggles from "@/components/ui/Toggles";
import ui from "@/components/ui/ui.module.css";
import type { Dictionary, Lang } from "@/lib/i18n";
import styles from "./marketing.module.css";

interface Props {
  lang: Lang;
  t: Dictionary;
  /** The landing shows section anchors and the log in / sign up buttons */
  landing?: boolean;
}

const MarketingHeader = ({ lang, t, landing }: Props) => (
  <header className={styles.header}>
    <Link href="/" className={ui.logo}>PersonalCMS</Link>
    {landing && (
      <nav className={styles.headerNav}>
        <a href="#quienes">{t.navWho}</a>
        <a href="#features">{t.navFeatures}</a>
        <a href="#plantilla">{t.navTemplate}</a>
      </nav>
    )}
    <div className={styles.headerActions}>
      <Toggles lang={lang} />
      {landing && (
        <>
          <Link href="/login" className={ui.btnGhost}>{t.headerLogin}</Link>
          <Link href="/dashboard" className={`${ui.btnPrimary} ${styles.headerCta}`}>{t.headerSignup}</Link>
        </>
      )}
    </div>
  </header>
);

export default MarketingHeader;
