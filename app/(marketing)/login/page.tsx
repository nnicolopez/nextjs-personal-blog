import { redirect } from "next/navigation";
import { auth, isAllowed, signIn } from "@/auth";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { getDictionary } from "@/lib/i18n";
import styles from "@/components/marketing/marketing.module.css";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const LoginPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (isAllowed(session?.user?.email)) redirect("/dashboard");

  const { error } = await searchParams;
  const { lang, t } = await getDictionary();

  return (
    <>
      <MarketingHeader lang={lang} t={t} />
      <main className={styles.authMain}>
        <div className={styles.authCard}>
          <h1>{t.loginTitle}</h1>
          <p className={styles.authSub}>{t.loginSub}</p>
          {error && (
            <p className={styles.authError} role="alert">
              {error === "AccessDenied" ? t.accessDenied : t.loginError}
            </p>
          )}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/dashboard" });
            }}
          >
            <button type="submit" className={styles.googleButton}>
              <GoogleIcon />
              {t.google}
            </button>
          </form>
          <p className={styles.authNote}>{t.privateNote}</p>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
