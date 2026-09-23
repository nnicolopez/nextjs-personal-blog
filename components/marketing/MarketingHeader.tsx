import { Anchor, Group } from "@mantine/core";
import { ButtonLink, Logo } from "@/components/ui/Links";
import Toggles from "@/components/ui/Toggles";
import type { Dictionary, Lang } from "@/lib/i18n";
import classes from "./marketing.module.css";

interface Props {
  lang: Lang;
  t: Dictionary;
  /** The landing shows section anchors and the log in / sign up buttons */
  landing?: boolean;
}

const MarketingHeader = ({ lang, t, landing }: Props) => (
  <Group component="header" justify="space-between" gap="lg" px="6vw" py={22} className={classes.header}>
    <Logo />
    {landing && (
      <Group gap={28} visibleFrom="md">
        <Anchor href="#quienes" c="var(--pc-text)" fw={500} fz={15}>{t.navWho}</Anchor>
        <Anchor href="#features" c="var(--pc-text)" fw={500} fz={15}>{t.navFeatures}</Anchor>
        <Anchor href="#plantilla" c="var(--pc-text)" fw={500} fz={15}>{t.navTemplate}</Anchor>
      </Group>
    )}
    <Group gap={10}>
      <Toggles lang={lang} />
      {landing && (
        <>
          <ButtonLink href="/login" variant="subtle" color="gray" c="var(--pc-text)">{t.headerLogin}</ButtonLink>
          <ButtonLink href="/dashboard" size="md">{t.headerSignup}</ButtonLink>
        </>
      )}
    </Group>
  </Group>
);

export default MarketingHeader;
