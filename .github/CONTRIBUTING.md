# Contributing to PersonalCMS

First off, thank you for considering contributing to PersonalCMS! 🎉

This is a learning project, and we welcome contributions from developers of all experience levels. Whether you're fixing a typo, adding a feature, or improving documentation, your contribution matters.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Questions?](#questions)

---

## Code of Conduct

This project follows a simple code of conduct:

- **Be respectful** - Treat everyone with respect
- **Be helpful** - This is a learning project, help others learn
- **Be constructive** - Provide constructive feedback
- **Be inclusive** - Welcome people of all backgrounds and skill levels

---

## How Can I Contribute?

### 🐛 Reporting Bugs

If you find a bug, please create an issue with:

- **Clear title** - Summarize the problem
- **Description** - Explain what happened and what you expected
- **Steps to reproduce** - How can we reproduce the issue?
- **Environment** - OS, browser, Node version, etc.
- **Screenshots** - If applicable

**Example:**
```markdown
## Bug: Avatar upload fails on Safari

### Description
When attempting to upload a profile picture on Safari 17, the upload fails with a CORS error.

### Steps to Reproduce
1. Go to `/dashboard/edit`
2. Click on avatar upload button
3. Select an image file
4. Click "Upload"

### Expected Behavior
Image should upload to Cloudinary and display

### Actual Behavior
Upload fails with error: "CORS policy blocked"

### Environment
- OS: macOS 14
- Browser: Safari 17.2
- Node: 20.10.0
```

---

### 💡 Suggesting Features

We love feature suggestions! Before creating a feature request:

1. Check if it's already in the [Roadmap](../README.md#-roadmap)
2. Search existing issues to avoid duplicates
3. Consider if it fits the MVP/V2/V3 scope

**Feature request template:**
```markdown
## Feature Request: [Feature Name]

### Problem
What problem does this solve?

### Proposed Solution
How should it work?

### Alternatives Considered
What other solutions did you consider?

### Additional Context
Mockups, examples, or references
```

---

### 📝 Improving Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add code examples
- Improve API documentation
- Translate documentation (future)

---

### 🔧 Contributing Code

Great! Here's how to get started:

1. **Find an issue** - Look for issues labeled `good first issue`
2. **Comment on the issue** - Let us know you're working on it
3. **Fork the repo** - Create your own copy
4. **Create a branch** - Follow naming conventions (see below)
5. **Make changes** - Write code and tests
6. **Submit PR** - Follow the PR template

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- **Code editor** (VS Code recommended)
- **GitHub account**

### Fork and Clone

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/personal-cms.git
   cd personal-cms
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/nnicolopez/personal-cms.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Setup (Once Backend is Added)

Create `.env.local`:
```bash
# Copy template
cp .env.example .env.local

# Add your credentials (see docs/SETUP.md)
```

---

## Development Workflow

We use **Git Flow** for branch management.

### Branch Naming

| Branch Type | Naming Convention | Example |
|-------------|-------------------|---------|
| Feature | `feature/short-description` | `feature/add-avatar-upload` |
| Bug Fix | `bugfix/short-description` | `bugfix/fix-safari-cors-issue` |
| Hotfix | `hotfix/short-description` | `hotfix/critical-auth-bug` |
| Documentation | `docs/short-description` | `docs/update-contributing-guide` |

### Development Flow

```bash
# 1. Update your main branch
git checkout main
git pull upstream main

# 2. Create a feature branch
git checkout -b feature/my-awesome-feature

# 3. Make changes and commit
git add .
git commit -m "Add: user avatar upload functionality"

# 4. Push to your fork
git push origin feature/my-awesome-feature

# 5. Open PR on GitHub (from your fork to upstream main)
```

### Keep Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Update your feature branch
git checkout feature/my-awesome-feature
git rebase main
```

---

## Coding Guidelines

### TypeScript

✅ **Do:**
```typescript
// Define interfaces for props
interface HeroProps {
  name: string;
  bio: string;
  imageUrl?: string;
}

// Use type-safe functions
const Hero: React.FC<HeroProps> = ({ name, bio, imageUrl }) => {
  return <div>...</div>;
};
```

❌ **Don't:**
```typescript
// Avoid any types
const Hero = (props: any) => { ... };

// Avoid implicit any
function processData(data) { ... }
```

### React Components

✅ **Do:**
```typescript
// Use functional components
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  return <div>...</div>;
};

// Use Mantine components
import { Button } from '@mantine/core';
<Button>Click me</Button>
```

❌ **Don't:**
```typescript
// Avoid class components (for new code)
class MyComponent extends React.Component { ... }

// Don't mix UI libraries
import { Button } from 'some-other-library';
```

### File Organization

```
components/
├── MyComponent/
│   ├── index.tsx       # Main component
│   ├── MyComponent.module.css  # Styles (if needed)
│   └── types.ts        # Type definitions (if complex)
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Code Formatting

We use **ESLint** and **Prettier**:

```bash
# Check formatting
npm run lint

# Auto-fix issues
npm run lint --fix
```

**VS Code setup** (recommended):
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Commit Message Guidelines

We follow **Conventional Commits** format:

### Format

```
<type>: <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add user avatar upload` |
| `fix` | Bug fix | `fix: resolve Safari CORS issue` |
| `docs` | Documentation | `docs: update contributing guide` |
| `style` | Code style (formatting) | `style: fix linting errors` |
| `refactor` | Code refactoring | `refactor: simplify Hero component` |
| `test` | Add/update tests | `test: add unit tests for auth` |
| `chore` | Maintenance | `chore: update dependencies` |

### Examples

✅ **Good commits:**
```bash
feat: add Cloudinary image upload integration

Integrate Cloudinary SDK for user avatar uploads.
Supports PNG, JPG, and WebP formats up to 2MB.

Closes #42
```

```bash
fix: prevent duplicate username registration

Add unique constraint check before user creation.
Display error message if username is taken.

Fixes #38
```

❌ **Bad commits:**
```bash
Updated stuff
```

```bash
Fixed bug
```

```bash
WIP
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if needed)
- [ ] No console errors in dev tools
- [ ] Tested on Chrome and Firefox (minimum)
- [ ] Commits follow commit message guidelines

### PR Title Format

Use the same format as commit messages:

```
feat: add user avatar upload functionality
fix: resolve Safari CORS issue
docs: update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Related Issue
Closes #issue_number

## How to Test
1. Step 1
2. Step 2
3. Expected result

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally
```

### Review Process

1. **Automated checks** - CI runs linting and type checking
2. **Code review** - Maintainer reviews your code
3. **Feedback** - You may be asked to make changes
4. **Approval** - Once approved, PR will be merged
5. **Celebration** - You're now a contributor! 🎉

---

## Project Structure

Understanding the codebase:

```
personal-cms/
├── components/          # React components
│   ├── Footer/         # Footer component
│   ├── Hero/           # Hero section
│   ├── Layout/         # Layout wrapper
│   ├── MainNav/        # Navigation
│   └── ui/             # Reusable UI components
├── pages/              # Next.js pages (routing)
│   ├── api/           # API routes
│   ├── _app.tsx       # App entry point
│   └── index.tsx      # Home page
├── styles/             # Global styles
│   └── theme.ts       # Mantine theme
├── lib/               # Utility functions (future)
├── hooks/             # Custom React hooks (future)
├── prisma/            # Database schema (future)
├── public/            # Static assets
└── docs/              # Documentation
```

---

## Testing

### Manual Testing

For MVP, we're focusing on manual testing:

1. Test your changes locally
2. Test on multiple browsers (Chrome, Firefox, Safari)
3. Test responsive design (mobile, tablet, desktop)
4. Test dark mode if UI change

### Future: Automated Testing

We plan to add:
- Unit tests (Jest + React Testing Library)
- Integration tests (Playwright)
- E2E tests for critical flows

---

## Questions?

### Before Asking

1. Check the [README](../README.md)
2. Check [documentation](../docs/)
3. Search existing [issues](https://github.com/nnicolopez/personal-cms/issues)
4. Search [discussions](https://github.com/nnicolopez/personal-cms/discussions)

### Where to Ask

- **General questions** - GitHub Discussions
- **Bug reports** - GitHub Issues
- **Feature requests** - GitHub Issues
- **Contribution questions** - Comment on the issue you're working on

---

## Recognition

All contributors will be recognized in our README! Your GitHub profile will be added to our contributors section.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🙏

Every contribution, no matter how small, makes this project better. Thank you for being part of PersonalCMS!

Happy coding! 💻✨
