import type { SocialLinks, Template } from "@/db";
import styles from "./PublicPage.module.css";

export interface PublicPageData {
  fullName: string;
  bio: string;
  avatarUrl: string | null;
  socialLinks: SocialLinks;
  template: Template;
  sections: { id: string; title: string; content: string }[];
}

const SOCIAL_LABELS = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram" } as const;

const Avatar = ({ data, size }: { data: PublicPageData; size: number }) => {
  const initials = data.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  return data.avatarUrl ? (
    // Google profile photos; plain <img> keeps them off the image optimizer
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.avatar} src={data.avatarUrl} alt="" width={size} height={size} referrerPolicy="no-referrer" />
  ) : (
    <div className={styles.avatarFallback} style={{ width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initials}
    </div>
  );
};

const Social = ({ links, className }: { links: SocialLinks; className: string }) => {
  const entries = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).filter((key) => links[key]);
  if (!entries.length) return null;
  return (
    <div className={className}>
      {entries.map((key) => (
        <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer me">
          {SOCIAL_LABELS[key]}
        </a>
      ))}
    </div>
  );
};

/** The published page, in either of the two templates from the design. */
const PublicPage = ({ data }: { data: PublicPageData }) => {
  if (data.template === "grid") {
    return (
      <div className={styles.grid}>
        <aside className={styles.gridProfile}>
          <Avatar data={data} size={110} />
          <h1>{data.fullName}</h1>
          {data.bio && <p>{data.bio}</p>}
          <Social links={data.socialLinks} className={styles.gridSocial} />
        </aside>
        <div className={styles.gridCards}>
          {data.sections.map((section) => (
            <section key={section.id} className={styles.gridCard}>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.profileHeader}>
        <Avatar data={data} size={140} />
        <h1>{data.fullName}</h1>
        {data.bio && <p>{data.bio}</p>}
        <Social links={data.socialLinks} className={styles.profileSocial} />
      </div>
      <div className={styles.profileSections}>
        {data.sections.map((section) => (
          <section key={section.id} className={styles.profileCard}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </section>
        ))}
      </div>
    </>
  );
};

export default PublicPage;
