import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import WelcomeForm from "@/components/marketing/WelcomeForm";
import { getAccount, getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { suggestUsername } from "@/lib/validation";
import styles from "@/components/marketing/marketing.module.css";

/** First sign-in: pick a name and username, which creates the account and page. */
const WelcomePage = async () => {
  if (await getAccount()) redirect("/dashboard");

  const session = await auth();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();

  return (
    <>
      <MarketingHeader lang={lang} t={t} />
      <main className={styles.authMain}>
        <div className={styles.authCard}>
          <h1>{t.welcomeTitle}</h1>
          <p className={styles.authSub}>{t.welcomeSub}</p>
          <WelcomeForm
            t={t}
            host={host}
            defaultName={session?.user?.name ?? ""}
            defaultUsername={suggestUsername(session?.user?.email ?? "")}
          />
        </div>
      </main>
    </>
  );
};

export default WelcomePage;
