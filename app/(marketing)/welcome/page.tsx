import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthCard from "@/components/marketing/AuthCard";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import WelcomeForm from "@/components/marketing/WelcomeForm";
import { getAccount, getSiteHost } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { suggestUsername } from "@/lib/validation";

/** First sign-in: pick a name and username, which creates the account and page. */
const WelcomePage = async () => {
  if (await getAccount()) redirect("/dashboard");

  const session = await auth();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();

  return (
    <>
      <MarketingHeader lang={lang} t={t} />
      <AuthCard title={t.welcomeTitle} sub={t.welcomeSub}>
        <WelcomeForm
          t={t}
          host={host}
          defaultName={session?.user?.name ?? ""}
          defaultUsername={suggestUsername(session?.user?.email ?? "")}
        />
      </AuthCard>
    </>
  );
};

export default WelcomePage;
