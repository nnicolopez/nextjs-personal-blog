import Link from "next/link";
import ui from "@/components/ui/ui.module.css";
import { getDictionary } from "@/lib/i18n";
import styles from "@/components/public/PublicPage.module.css";

const NotFound = async () => {
  const { t } = await getDictionary();
  return (
    <main className={styles.notFound}>
      <div className={styles.notFoundCode}>404</div>
      <h1>{t.notFoundTitle}</h1>
      <p>{t.notFoundSub}</p>
      <Link href="/" className={ui.btnPrimary}>{t.backHome}</Link>
    </main>
  );
};

export default NotFound;
