import type { Template } from "@/db";
import type { PublicPageData } from "@/components/public/PublicPage";
import type { Lang } from "@/lib/i18n";

/** Example page used for the landing mockups (content from the design). */
export function samplePage(lang: Lang, template: Template = "profile"): PublicPageData {
  const es = lang === "es";
  return {
    fullName: "Nico López",
    bio: es ? "Dev, músico y deportista. Esta es mi página personal." : "Dev, musician and athlete. This is my personal page.",
    avatarUrl: null,
    template,
    socialLinks: { linkedin: "https://linkedin.com/in/nnicolopez", github: "https://github.com/nnicolopez" },
    sections: [
      {
        id: "about",
        title: es ? "Sobre mí" : "About me",
        content: es
          ? "Full-stack developer con 6 años de experiencia en UI, hoy metido de lleno en React y Next.js."
          : "Full-stack developer with 6 years of UI experience, now deep into React and Next.js.",
      },
      {
        id: "projects",
        title: es ? "Proyectos" : "Projects",
        content: es
          ? "PersonalCMS — un CMS open source para crear páginas personales sin código."
          : "PersonalCMS — an open-source CMS to build personal pages with no code.",
      },
      { id: "skills", title: "Skills", content: "TypeScript, React, Next.js, Node.js, PostgreSQL." },
      { id: "contact", title: es ? "Contacto" : "Contact", content: "nico@ejemplo.com" },
    ],
  };
}
