# 🚀 PersonalCMS - Your Personal Page in Minutes

> **An open-source CMS platform for creating and managing beautiful personal pages with ease.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Mantine](https://img.shields.io/badge/Mantine-8.3-339af0)](https://mantine.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [Vision](#-vision)
- [Current Status](#-current-status)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Learning Resources](#-learning-resources)
- [License](#-license)

---

## 🎯 Vision

**The Problem:** Creating a professional personal page requires technical skills, time, and often money for hosting and tools. Existing solutions are either too limited (like Linktree) or too complex (like WordPress).

**Our Solution:** PersonalCMS is a free, open-source platform that allows anyone to create, customize, and manage their personal page through an intuitive dashboard. No coding required for end users, yet fully customizable for developers.

### Why PersonalCMS?

- ✅ **100% Free** - Built entirely with free-tier services
- ✅ **Open Source** - Transparent, community-driven, and extensible
- ✅ **Modern Stack** - Latest technologies for performance and developer experience
- ✅ **Beautiful by Default** - Professional templates out of the box
- ✅ **Easy Theming** - Powerful customization with Mantine's theming system
- ✅ **Self-Hostable** - Own your data and platform

### Target Audience

1. **End Users** - Professionals, creatives, students who need a personal page
2. **Developers** - Learning modern web development, contributing to open source
3. **Recruiters** - See real-world implementation of modern practices

---

## 🏗 Current Status

**Phase:** 🟡 Pre-MVP - Setting up foundation

This project recently migrated from Chakra UI to Mantine UI to provide better theming capabilities and component flexibility for the CMS features.

### What's Working Now

The app follows the prototype in `design/PersonalCMS.html`:

- ✅ Landing page with night/day theme and ES/EN switch
- ✅ Google sign-in plus onboarding to pick a username
- ✅ Dashboard: overview, page editor (profile, 6 sections, social links), template picker, settings with account deletion
- ✅ Public page at `/username` in two templates (Profile, Grid), with draft/published state
- ✅ TypeScript, server actions, mobile-responsive layout

### What's Next (MVP)

- ✅ Google sign-in with an email allowlist (Auth.js). The whole site is private for now
- ✅ Database client and schema (Drizzle + Neon PostgreSQL)
- 🔨 Dashboard for content editing
- 🔨 Public user pages (`yourdomain.com/username`)
- 🔨 Basic profile customization

---

## ✨ Features

### MVP (Minimum Viable Product)

**For End Users:**
- 🔐 Sign up and login with email
- 👤 Create a personal profile page
- ✏️ Edit content through simple forms
- 📸 Upload profile picture
- 🔗 Add social media links
- 📝 Create content sections (About, Projects, Skills, etc.)
- 👁️ Preview your page before publishing
- 🌐 Access your page at `app.domain.com/username`

**For the Platform:**
- 🔒 Secure authentication
- 💾 Persistent data storage
- 📱 Fully responsive design
- 🌓 Light/Dark mode
- ⚡ Fast page loads
- 🎨 Single professional template

### Version 2.0 (Future)

- 🎨 Multiple template choices
- 🖌️ Theme customization (colors, fonts)
- 🌐 Custom subdomain support (`username.yourdomain.com`)
- 📊 Basic analytics dashboard
- 🖼️ Image gallery section
- 📝 Rich text editor for content

### Version 3.0 (Future)

- 🎭 Advanced template builder (drag-and-drop)
- 🔌 Third-party integrations (Google Analytics, etc.)
- 🌍 Custom domain support
- 📧 Contact form with email notifications
- 🎯 SEO optimization tools
- 📱 Progressive Web App support

---

## 🛠 Tech Stack

All services used are **100% free** for the scope of this project.

### Frontend

| Technology | Purpose | Why? |
|------------|---------|------|
| [Next.js 16](https://nextjs.org/) (App Router) | React Framework | Server components, server actions, excellent DX |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety | Catch bugs early, better IDE support |
| [Mantine 8](https://mantine.dev/) | UI Library | Comprehensive components, excellent theming system |
| [React Hook Form](https://react-hook-form.com/) | Form Management | Performance, easy validation |
| [Zod](https://zod.dev/) | Schema Validation | Type-safe validation, works great with TypeScript |
| [Zustand](https://zustand-demo.pmnd.rs/) | State Management | Lightweight, simple API, no boilerplate |

### Backend & Infrastructure

| Technology | Purpose | Free Tier |
|------------|---------|-----------|
| [Auth.js](https://authjs.dev/) + Google | Authentication | Open source, unlimited |
| [Drizzle ORM](https://orm.drizzle.team/) | ORM | Open source, unlimited |
| [PostgreSQL](https://www.postgresql.org/) | Database | Via Neon.tech |
| [Neon](https://neon.tech/) | Database Hosting | 512 MB storage |
| [Cloudinary](https://cloudinary.com/) | Image Storage | 25 GB storage, 25 GB bandwidth/month |
| [Vercel](https://vercel.com/) | Hosting | Unlimited for open source |

### Development Tools

- **Code Quality**: ESLint, Prettier
- **Version Control**: Git with Git Flow
- **Project Management**: GitHub Projects (Kanban)
- **Design**: Figma (optional, for wireframes)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nextjs-personal-blog.git
   cd nextjs-personal-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|----------|-----------------|
| `DATABASE_URL` | Neon project connection string |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Cloud Console, OAuth client ID (web application) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ALLOWED_EMAILS` | Comma separated emails that can sign in. Empty means nobody can |

Then create the tables with `npm run db:push`.

**Access is private:** `proxy.ts` sends every request without an allowlisted session to `/login`, and the site asks search engines not to index it. On Vercel, set the same variables in Project Settings → Environment Variables.

---

## 📁 Project Structure

```
nextjs-personal-blog/
├── components/           # React components
│   ├── Footer/          # Footer with social links and tech stack
│   ├── Hero/            # Profile intro section
│   ├── Layout/          # Main layout wrapper
│   ├── MainNav/         # Navigation bar with theme toggle
│   ├── FeaturedPosts/   # Card-based content sections
│   └── ui/              # Reusable UI components
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout (Mantine provider)
│   ├── page.tsx        # Home page
│   ├── login/          # Google sign-in page
│   ├── api/auth/       # Auth.js endpoints
│   └── contact/        # Contact form page
├── auth.ts              # Auth.js config and email allowlist
├── proxy.ts             # Protects every route (Next.js middleware)
├── db/                  # Drizzle schema and Neon client
├── styles/              # Global styles and theme
│   └── theme.ts        # Mantine theme configuration
├── public/              # Static assets
├── docs/                # Documentation
├── lib/                 # Utility functions (coming soon)
└── hooks/               # Custom React hooks (coming soon)
```

---

## 🗺 Roadmap

This roadmap is designed for flexible development (5-10 hours/week). Tasks are broken down into small, manageable chunks suitable for Kanban-style project management.

### 🎯 Phase 1: Foundation (MVP)

**Goal:** Basic CMS with authentication, database, and simple editor

#### Backend Setup
- [ ] Set up Neon PostgreSQL database
- [x] Initialize Drizzle ORM
- [x] Design database schema (User, Page, Section models)
- [ ] Push the schema to Neon (`npm run db:push`)
- [x] Set up Auth.js with Google and an email allowlist
- [x] Create authentication middleware (`proxy.ts`)

#### API Development
- [ ] Create API route structure
- [ ] Implement user registration endpoint
- [ ] Implement page CRUD endpoints
  - [ ] POST `/api/pages` - Create page
  - [ ] GET `/api/pages/:id` - Get page
  - [ ] PATCH `/api/pages/:id` - Update page
  - [ ] DELETE `/api/pages/:id` - Delete page
- [ ] Add API error handling
- [ ] Implement request validation with Zod

#### Frontend - Dashboard
- [ ] Create dashboard layout
- [ ] Build login/signup pages
- [ ] Create dashboard home page
- [ ] Build page editor form
  - [ ] Profile information fields
  - [ ] Social links section
  - [ ] Content sections editor
- [ ] Add form validation
- [ ] Implement real-time preview
- [ ] Add save/publish functionality

#### Frontend - Public Pages
- [ ] Create dynamic route for user pages (`/[username]`)
- [ ] Fetch and display user data
- [ ] Apply user's theme settings
- [ ] Add SEO metadata
- [ ] Implement 404 for non-existent users

#### Component Refactoring
- [ ] Make Hero component accept props (name, bio, image)
- [ ] Make FeaturedPosts data-driven (map from database)
- [ ] Create reusable Section component
- [ ] Update MainNav for authenticated users
- [ ] Add user menu dropdown

#### Testing & Polish
- [ ] Test full user flow (signup → edit → publish)
- [ ] Fix bugs and edge cases
- [ ] Improve loading states
- [ ] Add error messages
- [ ] Optimize images
- [ ] Test responsive design on mobile

**Estimated Completion:** 8-12 weeks at 5-10h/week

---

### 🎨 Phase 2: Templates & Customization

**Goal:** Multiple templates and theme customization

- [ ] Create template system architecture
- [ ] Build 2 additional templates
- [ ] Add template selector in dashboard
- [ ] Implement theme customizer (colors, fonts)
- [ ] Add custom subdomain support
- [ ] Implement basic analytics

**Estimated Completion:** 4-6 weeks

---

### 🚀 Phase 3: Advanced Features

**Goal:** Rich editing experience and integrations

- [ ] Build visual editor (drag-and-drop sections)
- [ ] Add markdown support
- [ ] Implement contact form functionality
- [ ] Add custom domain support
- [ ] Build admin panel
- [ ] Add email notifications

**Estimated Completion:** 6-8 weeks

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! This is a learning project, so don't hesitate to ask questions.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with clear messages**
   ```bash
   git commit -m "Add: user profile image upload functionality"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Workflow

We use **Git Flow** for branch management:

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes for production

### Coding Guidelines

- Write TypeScript for type safety
- Use Mantine components for UI consistency
- Follow existing code formatting (ESLint + Prettier)
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for detailed guidelines.

---

## 📚 Learning Resources

New to these technologies? Here are great resources to get started:

### Next.js
- [Official Next.js Tutorial](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Mantine
- [Mantine Documentation](https://mantine.dev/getting-started/)
- [Mantine Examples](https://ui.mantine.dev/)

### Drizzle
- [Drizzle with Neon](https://orm.drizzle.team/docs/get-started/neon-new)

### Auth.js
- [Auth.js Documentation](https://authjs.dev/)
- [Google provider](https://authjs.dev/getting-started/providers/google)

### React Hook Form + Zod
- [React Hook Form Docs](https://react-hook-form.com/get-started)
- [Zod Documentation](https://zod.dev/)

---

## 📋 Project Management

We use **GitHub Projects** for task management with a Kanban board.

### Columns

- **Backlog** - Future tasks, not yet prioritized
- **To Do** - Prioritized tasks ready to start
- **In Progress** - Currently being worked on
- **Review** - Pull requests under review
- **Done** - Completed tasks

### Labels

- `good first issue` - Perfect for newcomers
- `help wanted` - Need community input
- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation improvements
- `mvp` - Part of MVP scope
- `v2` - For version 2.0
- `v3` - For version 3.0

---

## 🎨 Design & Wireframes

### Current Template

The current design (migrated from Chakra UI to Mantine) will serve as **Template #1** for the CMS.

**Sections:**
- Hero (Profile picture, name, tagline)
- Featured Content (3-column card grid)
- Footer (Social links, tech stack)

### Future Design Work

We'll create wireframes in Figma for:
- Dashboard UI
- Page editor interface
- Template variations
- Mobile layouts

Figma files will be linked here once created.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [Mantine](https://mantine.dev/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- Inspired by personal portfolio sites and platforms like Linktree, About.me, and Carrd

---

## 📞 Contact

Have questions or suggestions? Feel free to:

- Open an [issue](https://github.com/yourusername/nextjs-personal-blog/issues)
- Start a [discussion](https://github.com/yourusername/nextjs-personal-blog/discussions)
- Reach out on [LinkedIn](https://www.linkedin.com/in/nnicolopez)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by developers, for developers

</div>
