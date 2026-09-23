"use client";

import Link from "next/link";
import { Anchor, Button, type AnchorProps, type ButtonProps } from "@mantine/core";

/**
 * Mantine Button / Anchor rendered as a Next.js Link. They live in a client
 * file because server components can't pass `component={Link}` to Mantine.
 */

export const ButtonLink = ({ href, ...props }: ButtonProps & { href: string; children?: React.ReactNode }) => (
  <Button component={Link} href={href} {...props} />
);

export const AnchorLink = ({ href, ...props }: AnchorProps & { href: string; children?: React.ReactNode }) => (
  <Anchor component={Link} href={href} {...props} />
);

export const Logo = ({ size = 26 }: { size?: number }) => (
  <Anchor component={Link} href="/" underline="never" c="var(--pc-text)" fw={800} fz={size} style={{ letterSpacing: 0.3 }}>
    PersonalCMS
  </Anchor>
);
