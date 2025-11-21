# Terminal Chat - AI Coding Guidelines

## Project Overview

Terminal-themed chat application built with Next.js 16, PostgreSQL, and Drizzle ORM. Features user registration, real-time messaging (planned), and Solana integration. Uses app router, server actions, and shadcn/ui components.

## Architecture

- **Frontend**: Next.js app router with client components for interactive UI (e.g., `src/components/home/chat-box.tsx`)
- **Backend**: Server actions in page directories (e.g., `src/app/register/actions.ts`) for DB operations
- **Database**: PostgreSQL with Drizzle ORM; schema in `src/lib/schema.ts`, casing: snake_case
- **Styling**: Tailwind CSS 4 with shadcn/ui components in `src/components/ui/`
- **Themes**: next-themes provider in `src/app/layout.tsx` with animated backgrounds (Framer Motion)

## Key Patterns

- **Forms**: React Hook Form + Zod validation (e.g., `src/app/register/page.tsx`)
- **DB Access**: Import `db` from `src/lib/db.ts` for queries/inserts
- **UI Components**: Use shadcn/ui from `src/components/ui/`; extend with custom in `src/components/`
- **Server Actions**: "use server" directives for DB mutations; revalidate paths as needed
- **Navigation**: App router pages; navbar in `src/components/navbar.tsx`

## Workflows

- **Development**: `npm run dev` (auto-reloads)
- **Database Setup**: `npx drizzle-kit push` to create/update tables; `npx drizzle-kit migrate` for migrations
- **Build**: `npm run build` then `npm start`
- **Linting**: `npm run lint` (ESLint)

## Examples

- Add user: `await db.insert(users).values({...})` in server action
- Form validation: Define Zod schema, use `zodResolver` with `useForm`
- Component styling: `className` with Tailwind; use `cn()` from `src/lib/utils.ts` for conditional classes
- Animated backgrounds: Wrap content in `StarsBackground` from `src/components/animate-ui/components/backgrounds/stars.tsx`

Reference: `src/lib/schema.ts` for DB relations; `package.json` for deps; `NEXT.md` for roadmap.</content>
<parameter name="filePath">c:\Users\Khalil\Dev\next-demo\.github\copilot-instructions.md
