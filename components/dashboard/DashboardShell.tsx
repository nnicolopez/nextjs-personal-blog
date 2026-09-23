"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppShell, Box, Burger, Group, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOutAction } from "@/app/actions";
import { Logo } from "@/components/ui/Links";

interface Props {
  items: { href: string; label: string }[];
  publicPage: { href: string; label: string };
  logoutLabel: string;
  children: React.ReactNode;
}

/** Sidebar layout from the design; on small screens the sidebar opens from a burger. */
const DashboardShell = ({ items, publicPage, logoutLabel, children }: Props) => {
  const pathname = usePathname();
  const [opened, { toggle, close }] = useDisclosure();

  const isActive = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <AppShell
      navbar={{ width: 240, breakpoint: "sm", collapsed: { mobile: !opened } }}
      // The header (logo + burger) only exists on small screens
      header={{ height: { base: 60, sm: 0 } }}
      padding={0}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md" justify="space-between">
          <Logo size={18} />
          <Burger opened={opened} onClick={toggle} size="sm" aria-label="Menu" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" pt={24}>
        <Box px={12} pb={20} visibleFrom="sm">
          <Logo size={20} />
        </Box>
        <Stack gap={4}>
          {items.map((item) => (
            <NavLink
              key={item.href}
              component={Link}
              href={item.href}
              label={item.label}
              active={isActive(item.href)}
              variant="light"
              fw={isActive(item.href) ? 700 : 500}
              onClick={close}
            />
          ))}
          <NavLink component={Link} href={publicPage.href} label={publicPage.label} mt={10} c="dimmed" onClick={close} />
        </Stack>
        <Box mt="auto">
          <form action={signOutAction}>
            <NavLink component="button" type="submit" label={logoutLabel} c="dimmed" />
          </form>
        </Box>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box px={{ base: 16, sm: 44 }} py={{ base: 24, sm: 36 }}>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardShell;
