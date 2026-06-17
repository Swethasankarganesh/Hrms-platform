# PeopleFlow Advanced AI HRMS

Production-oriented HRMS frontend built with:

- Next.js 16 App Router
- React 19 and TypeScript 5
- Tailwind CSS 4 and Geist
- Clerk-ready authentication and Svix webhook verification
- React Hook Form, Zod, and Hook Form resolvers
- MDX policies with gray-matter, GFM, heading slugs, and autolinks
- pnpm 10

## Development

```bash
pnpm install
pnpm dev
```

On Windows PowerShell installations that restrict `.ps1` scripts:

```powershell
pnpm.cmd install
pnpm.cmd dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Clerk

Copy `.env.example` to `.env.local` and configure:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=
```

The interface remains available without Clerk keys for local UI development.

The webhook endpoint is:

```text
/api/webhooks/clerk
```

## MDX policies

Policy content lives in `content/policies`. The included example is available at:

```text
/policies/leave-policy
```

## Data

This frontend prototype stores HR workspace changes in browser `localStorage`.
Connect the typed state actions in `components/hrms-app.tsx` to your database/API
when adding the backend.
