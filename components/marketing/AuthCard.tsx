import { Center, Paper, Text, Title } from "@mantine/core";

/** Centered card used by the login and onboarding screens. */
const AuthCard = ({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) => (
  <Center component="main" flex={1} px="6vw" pt={40} pb={90}>
    <Paper w="100%" maw={420} radius={22} px={{ base: 22, xs: 36 }} py={40} style={{ boxShadow: "var(--pc-shadow)" }}>
      <Title order={1} fz={28} mb={8} style={{ letterSpacing: "-0.01em" }}>{title}</Title>
      <Text fz={15} c="dimmed" mb={28}>{sub}</Text>
      {children}
    </Paper>
  </Center>
);

export default AuthCard;
