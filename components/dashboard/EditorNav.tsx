"use client";

import Link from "next/link";
import { Flex, NavLink, ScrollArea } from "@mantine/core";

/** Left column of the editor: profile, each section, social links. */
const EditorNav = ({ items, current }: { items: { key: string; label: string }[]; current: string }) => (
  <ScrollArea type="never" w={{ base: "100%", sm: 220 }}>
    {/* A scrollable row on small screens, a column next to the form on larger ones */}
    <Flex gap={2} direction={{ base: "row", sm: "column" }}>
      {items.map((item) => (
        <NavLink
          key={item.key}
          component={Link}
          href={`/dashboard/editor?s=${item.key}`}
          label={item.label}
          active={item.key === current}
          variant="light"
          fw={item.key === current ? 700 : 500}
          py={10}
          style={{ whiteSpace: "nowrap" }}
        />
      ))}
    </Flex>
  </ScrollArea>
);

export default EditorNav;
