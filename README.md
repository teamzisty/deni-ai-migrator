# deni-ai-migrator

A Next.js app for exporting legacy `deni-ai` chat data per user.  
After signing in, users can generate and download `message.json` in the browser.

## Overview

- Single-page flow built with the Next.js App Router
- Authentication powered by `better-auth`
- Email and password sign-in support
- Google and GitHub OAuth support
- Reads legacy chat data from PostgreSQL
- Returns exported JSON through an API endpoint

## Flow

1. The user signs in
2. The app verifies the session
3. `GET /api/migration/export` is called
4. The app loads that user's `chat_sessions`
5. The result is downloaded as `message.json`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- better-auth
- PostgreSQL (`pg`)
- Tailwind CSS 4

## Required Environment Variables

Set the following values in `.env`:

```env
DATABASE_URL=
MASTER_DATABASE_URL=
BETTER_AUTH_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Notes:

- `DATABASE_URL` is used for the auth database
- `MASTER_DATABASE_URL` is used for legacy chat reads
- If `MASTER_DATABASE_URL` is omitted, `DATABASE_URL` is used instead
- OAuth provider variables are optional if you do not use OAuth

## Data Assumptions

The app fetches data by authenticated user ID from the following table:

- `chat_sessions`

Expected columns:

- `id`
- `user_id`
- `title`
- `created_at`
- `updated_at`
- `messages`

## Setup

```bash
bun install
```

## Run Locally

```bash
bun dev
```

Open `http://localhost:3000` in your browser.

## Available Commands

```bash
bun dev
bun run build
bun start
bun run lint
bun run lint:fix
bun run format
bun run format:check
```

## API

### `GET /api/migration/export`

Returns the signed-in user's legacy chats as JSON.  
If the request is unauthenticated, the endpoint returns `401 Unauthorized`.

Response headers:

- `Content-Type: application/json`
- `Content-Disposition: attachment; filename="message.json"`

Output format:

```json
{
  "format": "app-message-export",
  "version": 1,
  "exportedAt": "2026-03-20T00:00:00.000Z",
  "source": {
    "app": "deni-ai",
    "channel": "master"
  },
  "chats": []
}
```

## Authentication

- Email / Password
- Google OAuth
- GitHub OAuth

OAuth providers are enabled only when the corresponding environment variables are set.  
OAuth sign-up is disabled, so only existing users can sign in.

## Implementation Notes

- Export is limited to data associated with the current `session.user.id`
- `user_id` must match UUID format
- The exported file name is always `message.json`
- `next.config.ts` currently enables `typescript.ignoreBuildErrors`

## Main Related Files

- `src/app/page.tsx`
- `src/app/api/migration/export/route.ts`
- `src/app/api/auth/[...all]/route.ts`
- `src/lib/auth.ts`
- `src/lib/db.ts`
- `src/lib/migration.ts`
- `src/lib/types.ts`
