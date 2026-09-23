import { Anchor, Avatar, Flex, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { SocialLinks, Template } from "@/db";

export interface PublicPageData {
  fullName: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: SocialLinks;
  template: Template;
  sections: { id: string; title: string; content: string }[];
}

const SOCIAL_LABELS = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram" } as const;

const PageAvatar = ({ data, size }: { data: PublicPageData; size: number }) => (
  <Avatar
    src={data.avatarUrl}
    name={data.fullName}
    size={size}
    variant="gradient"
    gradient={{ from: "var(--pc-accent1)", to: "var(--pc-accent2)", deg: 135 }}
    imageProps={{ referrerPolicy: "no-referrer" }}
  />
);

const Social = ({ links, vertical }: { links: SocialLinks; vertical?: boolean }) => {
  const entries = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).filter((key) => links[key]);
  if (!entries.length) return null;
  return (
    <Flex gap={vertical ? 8 : 16} direction={vertical ? "column" : "row"}>
      {entries.map((key) => (
        <Anchor key={key} href={links[key]} target="_blank" rel="noopener noreferrer me" fw={600} fz={vertical ? 13 : 14} c="var(--pc-accent1)">
          {SOCIAL_LABELS[key]}
        </Anchor>
      ))}
    </Flex>
  );
};

const SectionCard = ({ title, content, compact }: { title: string; content: string; compact?: boolean }) => (
  <Paper component="section" p={compact ? 22 : 26} radius={compact ? 16 : 18}>
    <Title order={3} fz={compact ? 16 : 19} mb={compact ? 8 : 10}>{title}</Title>
    <Text fz={compact ? 14 : 15} c="dimmed" lh={1.6} style={{ whiteSpace: "pre-line" }}>{content}</Text>
  </Paper>
);

/** The published page, in either of the two templates from the design. */
const PublicPage = ({ data }: { data: PublicPageData }) => {
  if (data.template === "grid") {
    return (
      <Flex gap={36} maw={1100} mx="auto" px="6vw" pt={20} pb={80} align="flex-start" direction={{ base: "column", sm: "row" }}>
        <Stack component="aside" gap={0} w={{ base: "100%", sm: 260 }} style={{ flexShrink: 0, position: "sticky", top: 20 }}>
          <PageAvatar data={data} size={110} />
          <Title order={1} fz={26} mt={18} mb={10}>{data.fullName}</Title>
          {data.bio && <Text fz={14} c="dimmed" lh={1.6} mb={16} style={{ whiteSpace: "pre-line" }}>{data.bio}</Text>}
          <Social links={data.socialLinks} vertical />
        </Stack>
        <SimpleGrid flex={1} miw={0} w="100%" cols={{ base: 1, md: 2 }} spacing={18}>
          {data.sections.map((section) => (
            <SectionCard key={section.id} title={section.title} content={section.content} compact />
          ))}
        </SimpleGrid>
      </Flex>
    );
  }

  return (
    <>
      <Stack align="center" ta="center" gap={0} px="6vw" pt={20} pb={60}>
        <PageAvatar data={data} size={140} />
        <Title order={1} fz={38} mt={24} mb={10}>{data.fullName}</Title>
        {data.bio && <Text fz={17} c="dimmed" maw={520} lh={1.6} mb={20} style={{ whiteSpace: "pre-line" }}>{data.bio}</Text>}
        <Social links={data.socialLinks} />
      </Stack>
      <Stack gap={20} maw={760} mx="auto" px="6vw" pb={80}>
        {data.sections.map((section) => (
          <SectionCard key={section.id} title={section.title} content={section.content} />
        ))}
      </Stack>
    </>
  );
};

export default PublicPage;
