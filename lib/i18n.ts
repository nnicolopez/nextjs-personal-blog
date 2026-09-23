import { cookies } from "next/headers";
import type { SectionType } from "@/db/schema";

/**
 * UI copy, taken from design/PersonalCMS.html.
 * The chosen language lives in the "lang" cookie; Spanish is the default.
 */

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

const es = {
  navWho: "Para quién es", navFeatures: "Funciones", navTemplate: "La plantilla",
  headerLogin: "Ingresar", headerSignup: "Crear mi página",
  heroChip: "Tu página, sin escribir código",
  heroTitle: "Contá quién sos, en tu propia página.",
  heroSub: "PersonalCMS te da un dashboard simple para armar tu portfolio o página personal — dev, músico, deportista, profe — y publicarla en minutos con tu propio link.",
  heroCta: "Crear mi página gratis", heroCta2: "Ver la plantilla →",
  whoTitle: "Para cualquier cosa que hagas", whoSub: "Una sola plantilla, flexible para distintas identidades — no hace falta ser diseñador.",
  who: [
    { title: "Desarrollador", desc: "“Full-stack, 6 años de experiencia. Proyectos, stack y contacto en un solo lugar.”" },
    { title: "Músico", desc: "“Bandas, shows y grabaciones. Todo lo que tocás, en una página que suena a vos.”" },
    { title: "Deportista", desc: "“Entrenamientos, logros y progreso. Un lugar para mostrar tu disciplina.”" },
    { title: "Profe / entrenador", desc: "“Clases, horarios y testimonios de alumnos, para que te encuentren fácil.”" },
  ],
  featTitle: "Simple para vos, prolijo para todos", featSub: "Todo lo que necesitás para publicar tu página, nada de lo que no.",
  features: [
    { title: "Secciones a medida", desc: "About, proyectos, skills, experiencia, educación o contacto — activá solo las que uses." },
    { title: "Tu propio link", desc: "Elegís tu usuario y tu página vive en tu propio link." },
    { title: "Dashboard sin vueltas", desc: "Formularios simples, vista previa en vivo y estado publicado / borrador." },
    { title: "Publicá cuando quieras", desc: "Guardá borradores y hacé pública tu página el día que estés listo." },
  ],
  tplTitle: "La plantilla, en detalle", tplSub: "Hoy lanzamos con dos plantillas — cálidas, prolijas y listas para cualquier rubro.",
  ctaTitle: "Tu página te está esperando.",
  footerTag: "Hecho con Next.js y mucho café. © 2026",

  loginTitle: "Bienvenido", loginSub: "Ingresá con tu cuenta de Google para armar tu página.",
  google: "Continuar con Google",
  privateNote: "Acceso privado por ahora: solo pueden entrar los emails autorizados.",
  accessDenied: "Esta cuenta no tiene acceso.", loginError: "Algo salió mal al ingresar. Probá de nuevo.",

  welcomeTitle: "Creá tu página", welcomeSub: "Elegí tu nombre y tu usuario. Lo podés cambiar después.",
  fullNameLabel: "Nombre completo", pickUsername: "Elegí tu usuario", yourPage: "Tu página:", welcomeSubmit: "Crear mi página",

  navSummary: "Resumen", navEditPage: "Editar página", navTemplatePage: "Plantilla", navSettings: "Configuración",
  navViewPublic: "Ver página pública", navLogout: "Cerrar sesión",
  startHere: "EMPEZÁ ACÁ", threeSteps: "Completá tu página en 3 pasos",
  step1: "Completá tu perfil y tus secciones", step2: "Elegí una plantilla", step3: "Publicá tu página",
  go: "Ir →", publishGo: "Publicar →",
  hello: "Hola,", lastEdit: "Última edición", visibleSections: "Secciones visibles", publishing: "Publicación",
  published: "Publicado", draft: "Borrador", moveToDraft: "Pasar a borrador", publish: "Publicar",
  sections: "Secciones",
  profile: "Perfil", avatarHint: "Por ahora se usa la foto de tu cuenta de Google.", usernameLabel: "Usuario", bioLabel: "Bio",
  socialLinks: "Redes sociales", titleLabel: "Título", contentLabel: "Contenido", saveChanges: "Guardar cambios", saved: "Guardado ✓",
  visible: "Visible", hidden: "Oculta",
  tplPageSub: "Elegí cómo se ve tu página pública. Podés cambiarla cuando quieras.",
  templates: {
    profile: { name: "Perfil", desc: "Centrada, cálida, foco en tu bio y tus secciones apiladas." },
    grid: { name: "Grid", desc: "Perfil fijo a un costado, secciones en tarjetas — más portfolio." },
  },
  inUse: "EN USO", useTemplate: "Usar esta plantilla",
  account: "Cuenta", emailLabel: "Email", emailHint: "Es el email de tu cuenta de Google.",
  dangerZone: "Zona de peligro",
  dangerDesc: "Eliminar tu cuenta borra tu página y todo su contenido. No se puede deshacer.", deleteAccount: "Eliminar cuenta",
  confirmDelete: "Sí, eliminar todo", cancel: "Cancelar",
  draftBanner: "Borrador: solo vos ves esta página hasta que la publiques.",
  backToDashboard: "Volver al dashboard", madeWith: "Hecho con PersonalCMS",
  notFoundTitle: "Esta página no existe", notFoundSub: "El usuario que buscás no existe o todavía no publicó su página.", backHome: "Volver al inicio",
  justNow: "recién",
  errors: {
    usernameFormat: "Entre 3 y 30 caracteres: letras minúsculas, números y guiones.",
    usernameTaken: "Ese usuario ya está tomado.",
    usernameReserved: "Ese usuario está reservado, elegí otro.",
    fullNameRequired: "Poné tu nombre.",
    tooLong: "Es demasiado largo.",
    badUrl: "No parece un link válido.",
    titleRequired: "La sección necesita un título.",
  },
  sectionLabels: { about: "About", projects: "Proyectos", skills: "Skills", experience: "Experiencia", education: "Educación", contact: "Contacto" } satisfies Record<SectionType, string>,
  sectionDefaults: { about: "Sobre mí", projects: "Proyectos", skills: "Skills", experience: "Experiencia", education: "Educación", contact: "Contacto" } satisfies Record<SectionType, string>,
};

export type Dictionary = typeof es;

const en: Dictionary = {
  navWho: "Who it’s for", navFeatures: "Features", navTemplate: "The template",
  headerLogin: "Log in", headerSignup: "Create my page",
  heroChip: "Your page, no code required",
  heroTitle: "Tell people who you are, on your own page.",
  heroSub: "PersonalCMS gives you a simple dashboard to build your portfolio or personal page — dev, musician, athlete, coach — and publish it in minutes with your own link.",
  heroCta: "Create my page for free", heroCta2: "See the template →",
  whoTitle: "For anything you do", whoSub: "One template, flexible for different identities — no designer needed.",
  who: [
    { title: "Developer", desc: "“Full-stack, 6 years of experience. Projects, stack and contact in one place.”" },
    { title: "Musician", desc: "“Bands, shows and recordings. Everything you play, on a page that sounds like you.”" },
    { title: "Athlete", desc: "“Training, achievements and progress. A place to show your discipline.”" },
    { title: "Coach / instructor", desc: "“Classes, schedules and student reviews, so people can find you easily.”" },
  ],
  featTitle: "Simple for you, tidy for everyone", featSub: "Everything you need to publish your page, nothing you don’t.",
  features: [
    { title: "Custom sections", desc: "About, projects, skills, experience, education or contact — turn on only what you use." },
    { title: "Your own link", desc: "Pick your username and your page lives at your own link." },
    { title: "No-fuss dashboard", desc: "Simple forms, live preview and published / draft status." },
    { title: "Publish whenever", desc: "Save drafts and make your page public the day you’re ready." },
  ],
  tplTitle: "The template, in detail", tplSub: "We’re launching with two templates — warm, tidy and ready for any field.",
  ctaTitle: "Your page is waiting for you.",
  footerTag: "Made with Next.js and lots of coffee. © 2026",

  loginTitle: "Welcome", loginSub: "Sign in with your Google account to build your page.",
  google: "Continue with Google",
  privateNote: "Private access for now: only allowlisted emails can sign in.",
  accessDenied: "This account doesn’t have access.", loginError: "Something went wrong signing in. Try again.",

  welcomeTitle: "Create your page", welcomeSub: "Pick your name and username. You can change them later.",
  fullNameLabel: "Full name", pickUsername: "Pick your username", yourPage: "Your page:", welcomeSubmit: "Create my page",

  navSummary: "Overview", navEditPage: "Edit page", navTemplatePage: "Template", navSettings: "Settings",
  navViewPublic: "View public page", navLogout: "Log out",
  startHere: "START HERE", threeSteps: "Complete your page in 3 steps",
  step1: "Complete your profile and sections", step2: "Choose a template", step3: "Publish your page",
  go: "Go →", publishGo: "Publish →",
  hello: "Hi,", lastEdit: "Last edit", visibleSections: "Visible sections", publishing: "Publishing",
  published: "Published", draft: "Draft", moveToDraft: "Move to draft", publish: "Publish",
  sections: "Sections",
  profile: "Profile", avatarHint: "Your Google account photo is used for now.", usernameLabel: "Username", bioLabel: "Bio",
  socialLinks: "Social links", titleLabel: "Title", contentLabel: "Content", saveChanges: "Save changes", saved: "Saved ✓",
  visible: "Visible", hidden: "Hidden",
  tplPageSub: "Choose how your public page looks. You can change it anytime.",
  templates: {
    profile: { name: "Profile", desc: "Centered, warm, focused on your bio and stacked sections." },
    grid: { name: "Grid", desc: "Profile fixed to one side, sections as cards — more of a portfolio." },
  },
  inUse: "IN USE", useTemplate: "Use this template",
  account: "Account", emailLabel: "Email", emailHint: "It’s your Google account email.",
  dangerZone: "Danger zone",
  dangerDesc: "Deleting your account removes your page and all its content. This can’t be undone.", deleteAccount: "Delete account",
  confirmDelete: "Yes, delete everything", cancel: "Cancel",
  draftBanner: "Draft: only you can see this page until you publish it.",
  backToDashboard: "Back to dashboard", madeWith: "Made with PersonalCMS",
  notFoundTitle: "This page doesn’t exist", notFoundSub: "The user you’re looking for doesn’t exist or hasn’t published their page yet.", backHome: "Back to home",
  justNow: "just now",
  errors: {
    usernameFormat: "3 to 30 characters: lowercase letters, numbers and hyphens.",
    usernameTaken: "That username is taken.",
    usernameReserved: "That username is reserved, pick another one.",
    fullNameRequired: "Add your name.",
    tooLong: "It’s too long.",
    badUrl: "That doesn’t look like a valid link.",
    titleRequired: "The section needs a title.",
  },
  sectionLabels: { about: "About", projects: "Projects", skills: "Skills", experience: "Experience", education: "Education", contact: "Contact" },
  sectionDefaults: { about: "About me", projects: "Projects", skills: "Skills", experience: "Experience", education: "Education", contact: "Contact" },
};

const dictionaries: Record<Lang, Dictionary> = { es, en };

export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get("lang")?.value;
  return value === "en" ? "en" : "es";
}

export async function getDictionary() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] };
}

export function timeAgo(date: Date, lang: Lang, justNow: string) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  if (seconds > -60) return justNow;
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["minute", 60], ["hour", 24], ["day", 30], ["month", 12], ["year", Infinity]];
  let value = seconds / 60;
  for (const [unit, size] of units) {
    if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
    value /= size;
  }
  return rtf.format(Math.round(value), "year");
}
