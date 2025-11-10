# Database Schema Design

This document describes the database schema for PersonalCMS using PostgreSQL and Prisma ORM.

## Table of Contents

- [Overview](#overview)
- [MVP Schema](#mvp-schema)
- [Schema Diagrams](#schema-diagrams)
- [Data Models](#data-models)
- [Relationships](#relationships)
- [Indexes and Performance](#indexes-and-performance)
- [Migration Strategy](#migration-strategy)
- [Future Schema Evolution](#future-schema-evolution)

---

## Overview

**Database:** PostgreSQL 15+ (hosted on Neon.tech)
**ORM:** Prisma 5+
**Migration Strategy:** Prisma Migrate

### Design Principles

1. **Simplicity First** - Start with minimal schema for MVP
2. **Type Safety** - Leverage Prisma for TypeScript types
3. **Normalization** - Avoid data duplication where reasonable
4. **Flexibility** - Use JSON for dynamic content (carefully)
5. **Performance** - Add indexes strategically

---

## MVP Schema

The MVP schema consists of 3 main models:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique  // Clerk user ID
  email     String   @unique
  username  String   @unique  // For public URL
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  page      Page?
}

model Page {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Basic Info
  fullName    String
  bio         String   @db.Text
  avatarUrl   String?

  // Social Links (JSON for flexibility in MVP)
  socialLinks Json     @default("{}")
  // Example: { "linkedin": "url", "github": "url", "instagram": "url" }

  // Publishing
  isPublished Boolean  @default(false)
  publishedAt DateTime?

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  sections    Section[]
}

model Section {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)

  // Section Type (e.g., "about", "projects", "skills")
  type      String

  // Content
  title     String
  content   String   @db.Text

  // Ordering
  order     Int      @default(0)

  // Visibility
  isVisible Boolean  @default(true)

  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([pageId])
  @@index([order])
}
```

---

## Schema Diagrams

### Entity Relationship Diagram (MVP)

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ id (PK)         │
│ clerkId (UQ)    │
│ email (UQ)      │
│ username (UQ)   │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │ 1
         │
         │ has one
         │
         │ 1
┌────────▼────────┐
│      Page       │
├─────────────────┤
│ id (PK)         │
│ userId (FK, UQ) │
│ fullName        │
│ bio             │
│ avatarUrl       │
│ socialLinks     │──── JSON: { linkedin, github, ... }
│ isPublished     │
│ publishedAt     │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │ 1
         │
         │ has many
         │
         │ N
┌────────▼────────┐
│    Section      │
├─────────────────┤
│ id (PK)         │
│ pageId (FK)     │
│ type            │
│ title           │
│ content         │
│ order           │
│ isVisible       │
│ createdAt       │
│ updatedAt       │
└─────────────────┘
```

---

## Data Models

### User Model

**Purpose:** Store user account information (linked to Clerk)

**Fields:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key (CUID) | PK, auto-generated |
| `clerkId` | String | Clerk user ID | Unique, not null |
| `email` | String | User's email | Unique, not null |
| `username` | String | Public URL slug | Unique, not null, lowercase |
| `createdAt` | DateTime | Account creation | Auto-generated |
| `updatedAt` | DateTime | Last update | Auto-updated |

**Business Rules:**
- Username must be URL-safe (alphanumeric + hyphens)
- Username cannot be changed after creation (MVP limitation)
- ClerkId is the source of truth for authentication
- Email comes from Clerk, synced on signup

**Example Data:**
```json
{
  "id": "cl9xyz123abc",
  "clerkId": "user_2abcdefg12345",
  "email": "nico@example.com",
  "username": "nnicolopez",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z"
}
```

---

### Page Model

**Purpose:** Store the content of a user's personal page

**Fields:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key (CUID) | PK, auto-generated |
| `userId` | String | Owner of the page | FK to User, unique |
| `fullName` | String | Display name | Not null |
| `bio` | Text | Profile description | Not null, max ~500 chars |
| `avatarUrl` | String | Cloudinary URL | Nullable |
| `socialLinks` | JSON | Social media links | Default: `{}` |
| `isPublished` | Boolean | Visibility status | Default: false |
| `publishedAt` | DateTime | First publish date | Nullable |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update | Auto-updated |

**Business Rules:**
- One page per user (enforced by unique userId)
- Published pages are publicly visible
- Unpublished pages show 404 to public
- Avatar must be uploaded to Cloudinary
- socialLinks structure: `{ platform: url }`

**Social Links JSON Structure:**
```json
{
  "linkedin": "https://linkedin.com/in/username",
  "github": "https://github.com/username",
  "instagram": "https://instagram.com/username",
  "twitter": "https://twitter.com/username",
  "website": "https://mywebsite.com"
}
```

**Example Data:**
```json
{
  "id": "cl9page456def",
  "userId": "cl9xyz123abc",
  "fullName": "Nicolas Lopez",
  "bio": "Full-stack developer passionate about web technologies and open source.",
  "avatarUrl": "https://res.cloudinary.com/.../avatar.jpg",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/nnicolopez",
    "github": "https://github.com/nnicolopez"
  },
  "isPublished": true,
  "publishedAt": "2025-01-16T14:00:00Z",
  "createdAt": "2025-01-15T10:35:00Z",
  "updatedAt": "2025-01-16T14:00:00Z"
}
```

---

### Section Model

**Purpose:** Content sections within a page (e.g., About, Projects, Skills)

**Fields:**

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | String | Primary key (CUID) | PK, auto-generated |
| `pageId` | String | Parent page | FK to Page |
| `type` | String | Section category | Not null |
| `title` | String | Section heading | Not null |
| `content` | Text | Section body | Not null |
| `order` | Int | Display order | Default: 0 |
| `isVisible` | Boolean | Visibility toggle | Default: true |
| `createdAt` | DateTime | Creation timestamp | Auto-generated |
| `updatedAt` | DateTime | Last update | Auto-updated |

**Business Rules:**
- Sections displayed in ascending `order`
- Duplicate orders allowed (sorted by createdAt as tie-breaker)
- Hidden sections (`isVisible: false`) not shown on public page
- Type determines icon/styling (frontend concern)

**Section Types (MVP):**
- `about` - About me section
- `projects` - Project showcase
- `skills` - Skills/technologies
- `experience` - Work experience
- `education` - Educational background
- `contact` - Contact information

**Example Data:**
```json
[
  {
    "id": "cl9sec789ghi",
    "pageId": "cl9page456def",
    "type": "about",
    "title": "About Me",
    "content": "I'm a software developer with 6 years of experience...",
    "order": 1,
    "isVisible": true,
    "createdAt": "2025-01-15T10:40:00Z",
    "updatedAt": "2025-01-15T10:40:00Z"
  },
  {
    "id": "cl9sec890jkl",
    "pageId": "cl9page456def",
    "type": "projects",
    "title": "Featured Projects",
    "content": "PersonalCMS - An open-source CMS platform...",
    "order": 2,
    "isVisible": true,
    "createdAt": "2025-01-15T10:45:00Z",
    "updatedAt": "2025-01-15T10:45:00Z"
  }
]
```

---

## Relationships

### User → Page (1:1)

```prisma
// One user has one page (MVP)
User {
  page Page?
}

Page {
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @unique
}
```

**Cascade Behavior:**
- Deleting a User deletes their Page
- Deleting a Page does NOT delete the User

### Page → Section (1:N)

```prisma
// One page has many sections
Page {
  sections Section[]
}

Section {
  page   Page   @relation(fields: [pageId], references: [id], onDelete: Cascade)
  pageId String
}
```

**Cascade Behavior:**
- Deleting a Page deletes all its Sections
- Deleting a Section does NOT affect the Page

---

## Indexes and Performance

### Indexes

**Automatic (from Prisma):**
- Primary keys: `User.id`, `Page.id`, `Section.id`
- Unique constraints: `User.clerkId`, `User.email`, `User.username`, `Page.userId`

**Manual Indexes:**

```prisma
@@index([pageId])  // Section lookup by page
@@index([order])   // Section ordering
```

### Query Optimization Tips

**Fetching a public page:**
```typescript
// Good: Single query with includes
const page = await prisma.page.findFirst({
  where: {
    user: { username: username },
    isPublished: true
  },
  include: {
    sections: {
      where: { isVisible: true },
      orderBy: { order: 'asc' }
    }
  }
});
```

**Checking username availability:**
```typescript
// Good: Count is faster than findUnique for existence check
const count = await prisma.user.count({
  where: { username: { equals: username, mode: 'insensitive' } }
});
const isAvailable = count === 0;
```

---

## Migration Strategy

### Development Workflow

1. **Modify Schema**
   ```bash
   # Edit prisma/schema.prisma
   ```

2. **Create Migration**
   ```bash
   npx prisma migrate dev --name add_section_model
   ```
   - Generates SQL migration
   - Updates Prisma Client
   - Applies to dev database

3. **Review Migration**
   ```bash
   # Check generated SQL in prisma/migrations/
   ```

4. **Commit Migration**
   ```bash
   git add prisma/
   git commit -m "feat: add Section model to schema"
   ```

### Production Deployment

Migrations run automatically on Vercel deploy:

```bash
# In package.json or vercel.json
"postinstall": "prisma generate && prisma migrate deploy"
```

---

## Future Schema Evolution

### Version 2.0 Schema Additions

**Theme Model** (Custom theming)
```prisma
model Theme {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])

  name        String
  colors      Json     // { primary, secondary, accent, ... }
  fonts       Json     // { heading, body }

  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

**Template Model** (Multiple page templates)
```prisma
model Template {
  id          String   @id @default(cuid())
  name        String   @unique
  description String
  preview     String   // Preview image URL
  structure   Json     // Layout configuration

  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  pages       Page[]
}

// Add to Page model:
model Page {
  templateId  String
  template    Template @relation(fields: [templateId], references: [id])
}
```

### Version 3.0 Schema Additions

**Analytics Model** (Page view tracking)
```prisma
model PageView {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id])

  viewedAt  DateTime @default(now())
  country   String?
  referrer  String?

  @@index([pageId, viewedAt])
}
```

**Custom Domain Model**
```prisma
model CustomDomain {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])

  domain      String   @unique
  isVerified  Boolean  @default(false)
  verifiedAt  DateTime?

  createdAt   DateTime @default(now())
}
```

---

## Seed Data (Development)

Create sample data for local development:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      clerkId: 'user_dev_123',
      email: 'dev@example.com',
      username: 'devuser',
      page: {
        create: {
          fullName: 'Dev User',
          bio: 'This is a development test user',
          socialLinks: {
            github: 'https://github.com/devuser'
          },
          isPublished: true,
          publishedAt: new Date(),
          sections: {
            create: [
              {
                type: 'about',
                title: 'About Me',
                content: 'I am a test user for development',
                order: 1
              },
              {
                type: 'projects',
                title: 'Projects',
                content: 'Sample project content',
                order: 2
              }
            ]
          }
        }
      }
    }
  });

  console.log('Seed data created:', user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx prisma db seed
```

---

## Common Queries

### Get user page by username
```typescript
const page = await prisma.page.findFirst({
  where: {
    user: { username: 'nnicolopez' },
    isPublished: true
  },
  include: {
    user: { select: { username: true } },
    sections: {
      where: { isVisible: true },
      orderBy: { order: 'asc' }
    }
  }
});
```

### Update page content
```typescript
await prisma.page.update({
  where: { id: pageId },
  data: {
    bio: newBio,
    updatedAt: new Date()
  }
});
```

### Reorder sections
```typescript
await prisma.$transaction(
  sections.map((section, index) =>
    prisma.section.update({
      where: { id: section.id },
      data: { order: index + 1 }
    })
  )
);
```

---

## Database Maintenance

### Backup Strategy

Neon.tech provides:
- Automatic daily backups (retained 7 days)
- Point-in-time recovery
- Database branching for testing

### Performance Monitoring

Use Prisma Studio for development:
```bash
npx prisma studio
```

Use Neon dashboard for production:
- Query performance insights
- Connection pooling stats
- Storage usage

---

## Questions or Improvements?

Database schema is critical to the project. If you have suggestions:

1. Open an issue to discuss schema changes
2. Consider backward compatibility
3. Test migrations thoroughly
4. Update this documentation

---

**Last Updated:** 2025-11-10
**Status:** MVP Schema - Ready for implementation
