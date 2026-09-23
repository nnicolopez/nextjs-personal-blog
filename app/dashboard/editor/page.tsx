import { Flex, Paper } from "@mantine/core";
import AppHeader from "@/components/dashboard/AppHeader";
import EditorNav from "@/components/dashboard/EditorNav";
import { ProfileForm, SectionForm, SocialForm } from "@/components/dashboard/EditorForms";
import { VisibilityChip } from "@/components/dashboard/SectionToggles";
import { getSiteHost, requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { displayUrl } from "@/lib/validation";

interface Props {
  searchParams: Promise<{ s?: string }>;
}

const EditorPage = async ({ searchParams }: Props) => {
  const account = await requireAccount();
  const { lang, t } = await getDictionary();
  const host = await getSiteHost();
  const { s = "profile" } = await searchParams;
  const { page, user, sections } = account;

  const navItems = [
    { key: "profile", label: t.profile },
    ...sections.map((section) => ({ key: section.type as string, label: t.sectionLabels[section.type] })),
    { key: "social", label: t.socialLinks },
  ];
  const current = navItems.some((item) => item.key === s) ? s : "profile";
  const section = sections.find((item) => item.type === current);

  return (
    <>
      <AppHeader title={t.navEditPage} lang={lang} />
      <Flex gap={28} align="flex-start" direction={{ base: "column", sm: "row" }}>
        <EditorNav items={navItems} current={current} />
        <Paper flex={1} w="100%" maw={560} p={28}>
          {current === "profile" && (
            <ProfileForm
              t={t}
              host={host}
              avatarUrl={page.avatarUrl}
              values={{ fullName: page.fullName, username: user.username, bio: page.bio }}
            />
          )}
          {current === "social" && (
            <SocialForm
              t={t}
              values={{
                linkedin: displayUrl(page.socialLinks.linkedin),
                github: displayUrl(page.socialLinks.github),
                instagram: displayUrl(page.socialLinks.instagram),
              }}
            />
          )}
          {section && (
            <SectionForm
              key={section.id}
              t={t}
              sectionId={section.id}
              heading={t.sectionLabels[section.type]}
              visibility={
                <VisibilityChip sectionId={section.id} visible={section.isVisible} labels={{ visible: t.visible, hidden: t.hidden }} />
              }
              values={{ title: section.title, content: section.content }}
            />
          )}
        </Paper>
      </Flex>
    </>
  );
};

export default EditorPage;
