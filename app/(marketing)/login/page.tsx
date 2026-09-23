import { Alert, Button, Text } from "@mantine/core";
import { redirect } from "next/navigation";
import { auth, isAllowed, signIn } from "@/auth";
import AuthCard from "@/components/marketing/AuthCard";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { getDictionary } from "@/lib/i18n";

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
      <AuthCard title={t.loginTitle} sub={t.loginSub}>
        {error && (
          <Alert color="red" variant="light" mb="lg" role="alert">
            {error === "AccessDenied" ? t.accessDenied : t.loginError}
          </Alert>
        )}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/dashboard" });
          }}
        >
          <Button type="submit" variant="default" fullWidth size="md" leftSection={<GoogleIcon />}>
            {t.google}
          </Button>
        </form>
        <Text fz={13} c="dimmed" ta="center" mt={22}>{t.privateNote}</Text>
      </AuthCard>
    </>
  );
};

export default LoginPage;
