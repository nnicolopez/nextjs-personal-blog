import AppHeader from "@/components/dashboard/AppHeader";
import DeleteAccount from "@/components/dashboard/DeleteAccount";
import ui from "@/components/ui/ui.module.css";
import { requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import styles from "@/components/dashboard/dashboard.module.css";

const SettingsPage = async () => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();

  return (
    <>
      <AppHeader title={t.navSettings} lang={lang} />
      <div className={styles.settings}>
        <div className={ui.card}>
          <div className={styles.cardTitle}>{t.account}</div>
          <label className={ui.label} htmlFor="email">{t.emailLabel}</label>
          <input id="email" type="email" className={ui.input} value={account.user.email} readOnly />
          <p className={ui.hint}>{t.emailHint}</p>
        </div>
        <div className={`${ui.card} ${styles.danger}`}>
          <div className={`${styles.cardTitle} ${styles.dangerTitle}`}>{t.dangerZone}</div>
          <p>{t.dangerDesc}</p>
          <DeleteAccount t={t} />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
