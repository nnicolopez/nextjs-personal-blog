import { Box, Button, Paper, Stack, Text, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import { auth, isAllowed, signIn } from "@/auth";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

const LoginPage = async ({ searchParams }: Props) => {
  const session = await auth();
  if (isAllowed(session?.user?.email)) redirect("/");

  const { error } = await searchParams;

  return (
    <Box mih="100vh" display="grid" style={{ placeItems: "center" }} p="md">
      <Paper withBorder radius="md" p="xl" maw={380} w="100%">
        <Stack gap="md">
          <div>
            <Title order={3} mb={4}>PersonalCMS</Title>
            <Text size="sm" c="dimmed">
              Private access. Sign in with a Google account on the allowlist.
            </Text>
          </div>
          {error && (
            <Text size="sm" c="red">
              {error === "AccessDenied"
                ? "This account doesn't have access."
                : "Something went wrong signing in. Try again."}
            </Text>
          )}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button type="submit" fullWidth size="md">
              Continue with Google
            </Button>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
