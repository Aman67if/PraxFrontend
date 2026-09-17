# Frontend

The user-facing web application for the **Praxes** EdTech platform (**Under Development**). Students take tests, employees manage questions, and admins oversee the entire platform — all from role-specific dashboards.

> [!NOTE]
> **Current Status:** Active development prototype. All core student, employee, and admin interfaces are functional in local development connected to the backend REST API.

---

## 🧱 Tech Stack

| Layer        | Technology                             |
| ------------ | -------------------------------------- |
| Framework    | Next.js 15 (App Router)               |
| UI Library   | React 19                               |
| Language     | TypeScript                             |
| Styling      | Tailwind CSS v4                        |
| Icons        | Lucide React                           |
| Math         | MathJax (LaTeX rendering)              |
| Animations   | OGL (WebGL hero effects)               |
| Package Manager  | Bun (default), npm, pnpm, Yarn         |

---

## 📁 Project Structure

```
Frontend/
├── app/
│   ├── layout.tsx                  ← Root layout (fonts, metadata, global providers)
│   ├── page.tsx                    ← Public landing page (hero section + WebGL animation)
│   ├── globals.css                 ← Global Tailwind styles + custom CSS variables
│   │
│   ├── auth/
│   │   ├── login/page.tsx          ← Login (email or phone)
│   │   └── signup/page.tsx         ← Student registration
│   │
│   ├── profile/
│   │   └── page.tsx                ← Shared profile page (works for all roles)
│   │
│   ├── admin/                      ← 🔒 Admin-only (guarded by useAuth)
│   │   ├── layout.tsx              ← Admin sidebar + role guard
│   │   ├── page.tsx                ← Admin dashboard (metrics overview)
│   │   ├── employees/page.tsx      ← Employee CRUD management
│   │   ├── questions/
│   │   │   ├── page.tsx            ← Question review + approve/reject pipeline
│   │   │   └── list/page.tsx       ← Browse all questions with filters
│   │   ├── test-groups/page.tsx    ← Create/manage test groups
│   │   ├── uploaded-images/page.tsx← View all uploaded question images
│   │   └── subscription-plans/page.tsx ← Plan CRUD (create, edit, delete)
│   │
│   ├── employee/                   ← 🔒 Employee-only (guarded by useAuth)
│   │   ├── layout.tsx              ← Employee sidebar + role guard
│   │   ├── question-entry/page.tsx ← Add new questions (with LaTeX + image upload)
│   │   ├── view-questions/page.tsx ← View & edit own submitted questions
│   │   ├── search/page.tsx         ← Search questions by filters or ID
│   │   ├── corrections/
│   │   │   ├── page.tsx            ← List questions flagged for correction
│   │   │   └── [id]/edit/page.tsx  ← Edit a specific correction
│   │   └── rejections/
│   │       ├── page.tsx            ← List rejected questions
│   │       └── [id]/edit/page.tsx  ← Re-edit a rejected question
│   │
│   └── student/                    ← 🔒 Student-only (guarded by useAuth)
│       ├── layout.tsx              ← Student sidebar + role guard
│       ├── page.tsx                ← Student dashboard
│       ├── enrolled-tests/page.tsx ← Browse available test groups to attempt
│       ├── topic/[slug]/page.tsx   ← View tests under a specific topic
│       ├── test/
│       │   ├── notice/page.tsx     ← Pre-test instructions screen
│       │   ├── page.tsx            ← Live test-taking interface (full-screen)
│       │   └── result/page.tsx     ← Post-test result breakdown
│       ├── result/page.tsx         ← Test history & past results
│       ├── analytics/page.tsx      ← Performance analytics & charts
│       └── subscription/page.tsx   ← View plans + initiate Paytm payment
│
├── components/
│   ├── Button.tsx                  ← Reusable button (variants: primary, secondary, outline)
│   ├── Card.tsx                    ← Container card with shadow + rounded corners
│   ├── Input.tsx                   ← Labeled text input
│   ├── Select.tsx                  ← Labeled dropdown select
│   ├── Textarea.tsx                ← Labeled multiline text input
│   ├── Modal.tsx                   ← Overlay modal dialog
│   ├── Table.tsx                   ← Styled data table
│   ├── Navbar.tsx                  ← Top navigation bar with breadcrumbs
│   ├── Sidebar.tsx                 ← Collapsible sidebar navigation
│   ├── LogoutModal.tsx             ← Confirmation modal for logout
│   ├── MathRenderer.tsx            ← MathJax wrapper for rendering LaTeX
│   ├── QuestionOption.tsx          ← Single MCQ option (radio/checkbox style)
│   ├── HeroData.tsx                ← Landing page animated data section
│   └── Grainient.tsx               ← WebGL grain + gradient background effect
│
├── hooks/
│   ├── useAuth.ts                  ← Role-based auth guard (fetches /auth/me, redirects)
│   └── useCurriculum.ts            ← Fetches curriculum tree (classes → subjects → chapters → topics)
│
├── lib/
│   └── api.ts                      ← API_URL constant + apiFetch() wrapper (auto credentials + ngrok header)
│
├── public/
│   └── mathjax-config.mjs          ← MathJax configuration for LaTeX rendering
│
├── .env.example
├── package.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔐 Route Protection

Every role-specific section is guarded at the layout level using the `useAuth` hook. If someone tries to access a route they shouldn't, they're automatically redirected:

| Logged-in as   | `/admin`        | `/employee`      | `/student`       |
| -------------- | --------------- | ---------------- | ---------------- |
| **Admin**      | ✅ Allowed       | ❌ → `/admin`     | ❌ → `/admin`     |
| **Employee**   | ❌ → `/employee` | ✅ Allowed        | ❌ → `/employee`  |
| **Student**    | ❌ → `/student`  | ❌ → `/student`   | ✅ Allowed        |
| **Not logged in** | ❌ → `/auth/login` | ❌ → `/auth/login` | ❌ → `/auth/login` |

---

## 🛠️ Key Features

- **Nested Layouts** — Sidebars and navbars are managed via Next.js `layout.tsx` files per role, so they don't re-render when switching pages.
- **LaTeX Rendering** — All question text and options support LaTeX via MathJax. The `MathRenderer` component handles rendering inline and block math.
- **Image Uploads** — Questions and options can include images uploaded directly to AWS S3 from the question entry form.
- **Live Test Engine** — Full-screen, distraction-free test interface with a timer, question navigation, and auto-submit.
- **Curriculum Hooks** — The `useCurriculum` hook provides cascading dropdown data (class → subject → chapter → topic) used across multiple pages.

---

## ⚙️ Environment Variables

| Variable               | Required | Description                     | Example                         |
| ---------------------- | -------- | ------------------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`  | Yes      | Backend API base URL            | `http://localhost:5000/api`     |

> For ngrok: set it to your tunnel URL like `https://your-url.ngrok-free.dev/api`

---

## 💻 Quick Start

### 1. Configure Environment

Copy the example environment file and configure your backend URL:

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_API_URL` to your running backend API URL (default: `http://localhost:5000/api`).

---

### 2. Quick Command Reference

| Action | Bun (Default) | npm | pnpm | Yarn |
| :--- | :--- | :--- | :--- | :--- |
| **Install Dependencies** | `bun install` | `npm install` | `pnpm install` | `yarn install` |
| **Start Dev Server** | `bun --bun run dev` | `npm run dev` | `pnpm dev` | `yarn dev` |
| **Build for Production** | `bun run build` | `npm run build` | `pnpm build` | `yarn build` |
| **Run Production Server**| `bun run start` | `npm run start` | `pnpm start` | `yarn start` |
| **Run Linter** | `bun run lint` | `npm run lint` | `pnpm run lint` | `yarn lint` |

---

### 3. Setup by Package Manager

Choose your preferred package manager below:

#### Option A — Bun (Default & Recommended)

> [Bun](https://bun.sh) is the primary package manager used during development for fast installs and hot reloading.

```bash
# 1. Install dependencies
bun install

# 2. Start development server
bun --bun run dev
```

#### Option B — npm

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

> **Tip:** If you experience peer dependency warnings with React 19 packages, run `npm install --legacy-peer-deps`.

#### Option C — pnpm

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev
```

#### Option D — Yarn

```bash
# 1. Install dependencies
yarn install

# 2. Start development server
yarn dev
```

---

### 4. Access the Application

Once your development server starts, open:

```
http://localhost:3000
```

---

### 5. Production Build

To build and serve the optimized production output:

```bash
# Bun
bun run build
bun run start

# npm
npm run build
npm run start

# pnpm
pnpm build
pnpm start

# Yarn
yarn build
yarn start
```
