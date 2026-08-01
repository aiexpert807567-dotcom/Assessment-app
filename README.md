# Leave

A minimal leave request management system built for a take home assessment. One workflow, done well: **Request → Review → Decision.**

## Live demo

**URL:** https://assessment-app-wine-seven.vercel.app

No sign in is required to open the link. Sign in is only required to use the employee or manager dashboards behind it.

**Test accounts**

| Role | Email |
|---|---|
| Employee | employee@test.com |
| Manager | manager@test.com |

Passwords for these accounts are shared in the project presentation document, not in this public repository.

## What it does

An employee submits a leave request with a start date, end date, and reason. It lands as Pending, visible only to that employee and to managers. A manager reviews every request in one place, sectioned by status, and approves or rejects with an optional comment. The employee sees the decision and the comment update instantly.

Two roles only: employee and manager. No admin panel, no chat, no email notifications, no file uploads, no calendar sync. Those were intentionally left out to keep the workflow focused.

## Stack

- Next.js 14, App Router, Server Components and Server Actions
- TypeScript
- Tailwind CSS
- Supabase, Postgres, Auth, and Row Level Security
- Deployed on Vercel

## Project structure

```
app/
  login/             sign in page
  employee/          employee dashboard, server component
  manager/           manager dashboard, server component
  layout.tsx         root layout and toast provider
  page.tsx           redirects to login or the correct dashboard
  icon.svg           favicon
components/
  ui/                shared primitives: Button, Card, Modal, Badge, Logo, and more
  employee/          employee only UI
  manager/           manager only UI
  dashboard-header.tsx
lib/
  supabase/          browser, server, and middleware Supabase clients
  actions.ts         server actions: sign in and out, create request, decide request
  data.ts            server side data fetching and stats
  utils.ts           class name and date helpers
hooks/
  use-toast.tsx       toast notifications
types/
  index.ts            shared TypeScript types
supabase/
  schema.sql           tables, RLS policies, and the profile creation trigger
middleware.ts           route protection and session refresh
```

## Supabase setup

1. Create a project at supabase.com.
2. Open the SQL Editor and run the full contents of `supabase/schema.sql`. This creates the `profiles` and `leave_requests` tables, Row Level Security policies, and a trigger that creates a profile row for every new signup, always defaulting the role to employee.
3. Under Authentication, disable email confirmation for convenience during testing.
4. Create the two test users under Authentication, Users, Add user.
5. In Table Editor, open `profiles` and change the manager account's role from employee to manager. New signups can never set their own role; it is always forced to employee at the database trigger.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your project's values from Supabase, Settings, API.

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push the project to a GitHub repository.
2. Import the repository at vercel.com/new.
3. Add the two environment variables above in the Vercel project settings.
4. Deploy. No further configuration is needed.

## How access control works

Middleware refreshes the Supabase session on every request and redirects unauthenticated users away from the employee and manager routes, and signed in users away from the login page. Each dashboard page also checks the user's role from `profiles` and redirects if it does not match the route.

The real enforcement layer is Postgres Row Level Security. Even if application code had a bug, the database itself will not let an employee read another employee's requests, and will not let anyone but a manager update a request's status. Role is never trusted from client input; it is always set to employee by the database trigger on signup, and only changed manually in the database.

## Input limits

The reason field and the manager comment field are both capped at 300 characters, enforced in the UI and re-checked inside the server action so the limit holds even if the action is called directly.

## Notes

Dates are plain `date` columns. The constraint that the end date cannot be before the start date is enforced both client side and with a database check.
