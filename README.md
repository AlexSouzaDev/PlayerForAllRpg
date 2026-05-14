# PlayerForAllRPG

> Sua ficha de personagem, em qualquer sistema, sempre com você.

A web platform for tabletop RPG players to create, manage, share, and export character sheets. Built with D&D 5e as a first-class system, with support for any RPG through custom fields.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| API | tRPC v11 |
| ORM | Prisma |
| Database | PostgreSQL |
| Auth | NextAuth.js v5 (credentials + Google OAuth) |
| Storage | Uploadthing (character images) |
| PDF Export | @react-pdf/renderer |
| Styling | Tailwind CSS |
| Forms | React Hook Form + Zod |
| State | Zustand + TanStack Query |
| Animations | Framer Motion |

---

## Setup

```bash
# 1. Clone
git clone https://github.com/your-org/playerforallrpg
cd playerforallrpg

# 2. Install dependencies
npm install

# 3. Copy and fill environment variables
cp .env.example .env

# 4. Run database migration
npx prisma migrate dev --name init

# 5. Seed with demo data
npx prisma db seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

**Demo account:** `demo@playerforallrpg.com` / `demo1234`

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `UPLOADTHING_SECRET` | Uploadthing secret key |
| `UPLOADTHING_APP_ID` | Uploadthing app ID |

---

## Folder Structure

```
├── app/               # Next.js App Router pages and API routes
│   ├── (auth)/        # Login, register pages
│   ├── (dashboard)/   # Protected ficha management pages
│   ├── p/[slug]/      # Public character sheet view
│   └── api/           # tRPC, NextAuth, Uploadthing routes
├── components/
│   ├── ficha/         # Character sheet editor and sections
│   ├── layout/        # Navbar, Sidebar
│   └── ui/            # Reusable UI components
├── server/
│   ├── api/           # tRPC routers
│   ├── auth.ts        # NextAuth configuration
│   └── db.ts          # Prisma client
├── lib/               # Utilities, PDF generator, tRPC client
├── hooks/             # React hooks (auto-save)
├── types/             # TypeScript type definitions
└── prisma/            # Schema and seed data
```

---

## Features

- **D&D 5e Character Sheets** — Full support: 6 core attributes with auto-calculated modifiers, 18 skills with proficiency toggles, combat stats (HP/AC/Initiative), spell slot tracking, inventory management
- **Generic System Support** — Custom key-value fields for any RPG (Vampire: The Masquerade, Call of Cthulhu, etc.)
- **Auto-Save** — Changes saved automatically with 500ms debounce, no manual save needed
- **Public Sharing** — Toggle any sheet to public and share via URL (`/p/[slug]`)
- **PDF Export** — Download a styled PDF of any character sheet
- **Image Upload** — Upload character images via Uploadthing
- **Authentication** — Email/password or Google OAuth
- **Dark Fantasy Aesthetic** — Gold accents, parchment text, arcane purple

---

## Available Demo URLs

After seeding:

- `/p/gandalf-o-cinzento-demo` — Full D&D 5e character (Gandalf)
- `/p/lestat-de-lioncourt-vtm` — Generic system character (Vampire: The Masquerade)
