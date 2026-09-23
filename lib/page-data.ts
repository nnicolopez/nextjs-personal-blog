import type { PublicPageData } from "@/components/public/PublicPage";
import type { Account } from "./data";

/** What the public page shows: visible sections that have some content. */
export function toPublicPageData({ page, sections }: Pick<Account, "page" | "sections">): PublicPageData {
  return {
    fullName: page.fullName,
    bio: page.bio,
    avatarUrl: page.avatarUrl,
    socialLinks: page.socialLinks,
    template: page.template,
    sections: sections
      .filter((section) => section.isVisible && section.content.trim())
      .map(({ id, title, content }) => ({ id, title, content })),
  };
}
