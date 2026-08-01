
# Leave

A minimal leave request management system. One workflow: **Request → Review → Decision.**

## Live demo

**URL:**Leave — Time off, handled

**Test accounts:**

| Role | Email | Password |

|---|---|---|

| Employee | employee@test.com | Password123! |

| Manager | manager@test.com | Password123! |

---

# Leave

A minimal leave request management system. One workflow: **Request → Review → Decision.**

Employees submit leave requests. Managers approve or reject them. That's it.

Built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Stack

- **Next.js 14** (App Router, Server Components, Server Actions)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Postgres, Auth, Row Level Security)
- Deployment target: **Vercel**

## Project structure

```
app/
  login/            Sign-in page
  employee/         Employee dashboard (server component)
  manager/          Manager dashboard (server component)
  layout.tsx         Root layout + toast provider
  page.tsx            Redirects to /login or the right dashboard
components/
  ui/                Shared primitives: Button, Card, Modal, Badge, etc.
  employee/          Employee-only UI
  manager/           Manager-only UI
  dashboard-header.tsx
lib/
  supabase/          Browser, server, and middleware Supabase clients
  actions.ts          Server Actions: sign in/out, create request, decide request
  data.ts              Server-side data fetching + stats
  utils.ts             cn(), date formatting helpers
hooks/
  use-toast.tsx        Toast context + hook
types/
  index.ts             Shared TypeScript types
supabase/
  schema.sql           Tables, RLS policies, auto-profile trigger
  seed.sql              Sample data template
middleware.ts           Route protection + session refresh
```

## 1. Supabase setup

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `supabase/schema.sql`. This creates:
   - `profiles` (id, name, email, role)
   - `leave_requests` (id, employee_id, start_date, end_date, reason, status, manager_comment, created_at, updated_at)
   - A trigger that auto-creates a `profiles` row whenever a new `auth.users` row is created, reading `name` and `role` from signup metadata.
   - Row Level Security policies:
     - Employees can only read/insert their **own** requests.
     - Managers can read **all** requests and update status/comment on any of them.
3. Go to **Authentication → Providers** and confirm Email is enabled. Disable "Confirm email" for local testing convenience (Authentication → Settings), or confirm the test accounts manually after creating them.

### Test accounts

Create these two users under **Authentication → Users → Add user** (or via the Supabase Auth API), setting `user_metadata`:

| Email | Password | Metadata |
|---|---|---|
| `employee@test.com` | `Password123!` | `{ "name": "Alex Employee", "role": "employee" }` |
| `manager@test.com` | `Password123!` | `{ "name": "Jordan Manager", "role": "manager" }` |

The `handle_new_user` trigger will create matching `profiles` rows automatically. If you create users without metadata, update their `role` in the `profiles` table directly.

Optionally seed a few sample requests using `supabase/seed.sql` once you have the employee's UUID from the `profiles` table.

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your project's values (Supabase Dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign in with either test account.

## 4. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the two environment variables from step 2 in the Vercel project settings.
4. Deploy. No further configuration is needed — the app is a standard Next.js App Router project.

## How access control works

- `middleware.ts` refreshes the Supabase session on every request and redirects unauthenticated users away from `/employee` and `/manager`, and signed-in users away from `/login`.
- Each dashboard page double-checks the user's `role` from `profiles` server-side and redirects to the correct dashboard if mismatched.
- The real enforcement layer is **Postgres RLS**: even if application code had a bug, the database itself won't let an employee read another employee's requests, or let anyone but a manager update a request's status.

## Notes

- No email, chat, notifications, or file uploads — intentionally out of scope per the brief.
- Dates are plain `date` columns; `end_date >= start_date` is enforced both client-side and with a database constraint.
