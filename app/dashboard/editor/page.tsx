import Link from "next/link";
import AppHeader from "@/components/dashboard/AppHeader";
import { VisibilityChip } from "@/components/dashboard/ActionButtons";
import { ProfileForm, SectionForm, SocialForm } from "@/components/dashboard/EditorForms";
import ui from "@/components/ui/ui.module.css";
import { getSiteHost, requireAccount } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { displayUrl } from "@/lib/validation";
import styles from "@/components/dashboard/dashboard.module.css";

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
      <div className={styles.editor}>
        <nav className={styles.editorNav}>
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={`/dashboard/editor?s=${item.key}`}
              className={`${styles.navItem} ${item.key === current ? styles.navItemActive : ""}`}
              aria-current={item.key === current ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={`${ui.card} ${styles.editorCard}`}>
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
                <VisibilityChip
                  sectionId={section.id}
                  visible={section.isVisible}
                  label={section.isVisible ? t.visible : t.hidden}
                />
              }
              values={{ title: section.title, content: section.content }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default EditorPage;
