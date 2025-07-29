# Contribution Guide

Welcome to the Miku Note project! This guide explains the tech stack and how to contribute new features based on the current implementation.

## Tech Stack

- **Frontend:** React (TypeScript, in `src/app`), Tailwind CSS
- **Backend:** Next.js API routes (`src/app/api`), Node.js
- **Database:** Drizzle ORM (all CRUD for notes via Drizzle, logic in `src/app/db/`; API routes only call db functions)
- **AI Integration:** Gemini API (for quiz and summary generation)
- **Deployment:** Vercel (Next.js), Firebase Hosting (static assets)

## Project Structure

- Top-level UI components: `button.tsx`, `dialog.tsx`, etc. (shared, not in `src/app/components/`)
- `src/app/components/` — App-specific UI (forms, dialogs, auth, notes editor, etc.)
- `src/app/db/` — Database logic for notes (CRUD via Drizzle ORM), some legacy Firestore logic
- `src/app/editor/` — Rich text editor, themes, plugins, context, blocks
- `src/app/hooks/` — Custom React hooks
- `src/app/lib/` — Utility functions (auth, helpers)
- `src/app/styles/` — Editor and global styles
- `migrations/` — SQL migration files for Drizzle
- `public/` — Static assets (SVGs, PNGs)
- Configuration: `.env`, `drizzle.config.ts`, `next.config.ts`, etc.

## How to Add Features

### 1. Review Requirements

- Read [`requirements.md`](./requirements.md) to ensure your feature is in scope and fits the app's goals.

### 2. Set Up Your Environment

- Clone the repo and install dependencies:
  ```bash
  git clone <repo-url>
  cd miku-note
  npm install
  ```
- Set up `.env` for Firestore and Gemini API credentials.

### 3. Frontend Development

- Add new UI components in `src/app/components/`.
- Use Tailwind CSS for styling.
- For new pages or flows, update or add files in `src/app/`.
- Follow UX requirements for navigation, modals, and note interactions.

- Add or update API routes in `src/app/api/` (API routes should only call functions from `src/app/db/`).
- Ensure endpoints are secure and follow RESTful conventions.
- Integrate Gemini API for AI-powered features.
- Update Drizzle ORM logic in `src/app/db/` for notes CRUD or schema changes. Do not implement CRUD logic directly in API routes.
- Document any schema changes in your pull request.

### 6. Testing

- Add or update tests for new features.
- Use Jest and React Testing Library for frontend tests.

### 7. Documentation

- Update `requirements.md` if your feature changes user-facing functionality.
- Document new components, endpoints, or database changes.

### 8. Submitting Changes

- Ensure your code follows project style and passes all tests.
- Open a pull request with a clear description and reference related issues.
- Include screenshots or demos for UI changes.

## Code Style

- Use functional React components and hooks.
- Follow consistent naming and formatting.
- Write clear commit messages.

## Need Help?

Open an issue or join the project discussion for questions or feedback.

Happy coding!
