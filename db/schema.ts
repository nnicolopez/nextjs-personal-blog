import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
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

export const TEMPLATES = ["profile", "grid"] as const;
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
