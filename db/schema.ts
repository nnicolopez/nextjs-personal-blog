import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * MVP schema: one user has one page, one page has many sections.
 * See docs/DATABASE.md for the design notes.
 */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Google account email, the identity Auth.js gives us
  email: text("email").notNull().unique(),
  // For the public URL (yourdomain.com/username)
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type SocialLinks = Partial<Record<"linkedin" | "github" | "instagram", string>>;

// "practices" shows practices, instruments and the journal instead of sections
export const TEMPLATES = ["profile", "grid", "practices"] as const;
export type Template = (typeof TEMPLATES)[number];

// Fixed set of section types for the MVP, in their default order
export const SECTION_TYPES = ["about", "projects", "skills", "experience", "education", "contact"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // Basic info
  fullName: text("full_name").notNull(),
  bio: text("bio").notNull().default(""),
  // Big line at the top of the "practices" template; falls back to the name
  headline: text("headline").notNull().default(""),
  avatarUrl: text("avatar_url"),
  socialLinks: jsonb("social_links").$type<SocialLinks>().notNull().default({}),
  // Public page layout: "profile" (centered, stacked) or "grid" (sidebar + cards)
  template: text("template").$type<Template>().notNull().default("profile"),

  // Publishing
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const sections = pgTable(
  "sections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),

    // Section type, e.g. "about", "projects", "skills"
    type: text("type").$type<SectionType>().notNull(),
    title: text("title").notNull(),
    content: text("content").notNull().default(""),
    order: integer("order").notNull().default(0),
    isVisible: boolean("is_visible").notNull().default(true),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (t) => [index("sections_page_order").on(t.pageId, t.order)],
);

/*
 * Practices, instruments and journal (design v2, docs/design/v2/README.md).
 * A practice is something the owner does (music, training...). An instrument
 * is something they built to practice better: an app, a printed part, a
 * generated document or a routine. Journal entries log the process and feed
 * the public sequencer (entries per practice per week).
 */

export const PRACTICE_COLORS = ["brass", "iron", "blueprint", "plum", "teal", "graphite"] as const;
export type PracticeColor = (typeof PRACTICE_COLORS)[number];

export const practices = pgTable(
  "practices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").$type<PracticeColor>().notNull().default("brass"),
    description: text("description").notNull().default(""),
    order: integer("order").notNull().default(0),
    showInSequencer: boolean("show_in_sequencer").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (t) => [index("practices_page_order").on(t.pageId, t.order)],
);

export const INSTRUMENT_KINDS = ["app", "hardware", "document", "routine"] as const;
export type InstrumentKind = (typeof INSTRUMENT_KINDS)[number];

export const INSTRUMENT_STATUSES = ["in-use", "prototype", "building", "archived"] as const;
export type InstrumentStatus = (typeof INSTRUMENT_STATUSES)[number];

export const DEMO_KINDS = ["video", "embed", "images"] as const;
export type DemoKind = (typeof DEMO_KINDS)[number];

export type InstrumentDemo = { kind: DemoKind; url: string };
export type InstrumentImage = { url: string; caption: string };
export type InstrumentLink = { label: string; url: string };

export const instruments = pgTable(
  "instruments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    // A practice with instruments can't be deleted; the dashboard asks to move them first
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id),
    // Public URL: /username/slug
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    kind: text("kind").$type<InstrumentKind>().notNull().default("app"),
    status: text("status").$type<InstrumentStatus>().notNull().default("building"),
    summary: text("summary").notNull().default(""),
    problem: text("problem").notNull().default(""),
    // One item per line, shown side by side on the public page
    byMe: text("by_me").notNull().default(""),
    byAi: text("by_ai").notNull().default(""),
    materials: jsonb("materials").$type<string[]>().notNull().default([]),
    demo: jsonb("demo").$type<InstrumentDemo | null>(),
    images: jsonb("images").$type<InstrumentImage[]>().notNull().default([]),
    // No repository link by default: only what the owner adds here is public
    links: jsonb("links").$type<InstrumentLink[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    isVisible: boolean("is_visible").notNull().default(true),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex("instruments_page_slug").on(t.pageId, t.slug), index("instruments_page_order").on(t.pageId, t.order)],
);

export const ENTRY_KINDS = ["note", "video", "audio", "photo"] as const;
export type EntryKind = (typeof ENTRY_KINDS)[number];

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    practiceId: uuid("practice_id")
      .notNull()
      .references(() => practices.id),
    // Optional: an entry can belong to an instrument's build log
    instrumentId: uuid("instrument_id").references(() => instruments.id, { onDelete: "set null" }),
    date: date("date", { mode: "string" }).notNull(),
    kind: text("kind").$type<EntryKind>().notNull().default("note"),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    mediaUrl: text("media_url"),
    isVisible: boolean("is_visible").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (t) => [index("entries_page_date").on(t.pageId, t.date)],
);
