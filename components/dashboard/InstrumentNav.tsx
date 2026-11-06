"use client";

import Link from "next/link";
import { Badge, Box, NavLink, Stack } from "@mantine/core";

interface Item {
  id: string;
  name: string;
  kindLabel: string;
  color: string;
  hidden: boolean;
  featured: boolean;
}

/**
 * Instrument list next to the editor. A client component because Mantine
 * can only render NavLink as a Next.js Link from the client side.
 */
const InstrumentNav = ({ items, currentId, labels }: { items: Item[]; currentId?: string; labels: { hidden: string; featured: string; nav: string } }) => (
  <Stack component="nav" aria-label={labels.nav} gap={2}>
    {items.map((i) => (
      <NavLink
        key={i.id}
        component={Link}
        href={`/dashboard/instruments?i=${i.id}`}
        active={i.id === currentId}
        variant="light"
        label={i.name}
        description={i.kindLabel}
        leftSection={<Box w={8} h={8} style={{ borderRadius: "50%", background: i.color }} />}
        rightSection={
          i.hidden ? <Badge size="xs" color="gray">{labels.hidden}</Badge> : i.featured ? <Badge size="xs">{labels.featured}</Badge> : null
        }
      />
    ))}
  </Stack>
);

export default InstrumentNav;
