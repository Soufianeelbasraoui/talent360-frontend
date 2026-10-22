# Talent360 — AI-Powered Recruitment Platform (Frontend)

Production-grade React 18 frontend for **Talent360**, an AI-powered talent acquisition and candidate matching SaaS application.

---

## ✨ Key Features & Architecture

- **Human-Crafted SaaS Visual Identity**: Strict 5px border-radius everywhere, clean 1px borders (`#E5E7EB`), Inter typography, no flashy gradients or neon blobs.
- **AI Exclusivity**: Emerald green (`#10B981`) marker exclusively identifies AI features (automated CV extraction, match explanation score rings, JD generator). All AI suggestions are editable and require explicit human confirmation.
- **In-Memory Token Security**: JWT access tokens are stored in memory only. Axios interceptors handle automatic 401 token refresh queuing with `withCredentials`.
- **Kanban Pipeline**: Drag-and-drop recruiter candidate pipeline using `@dnd-kit` with optimistic updates and automatic rollback.
- **Comprehensive Layering**: Feature-based modularity (`src/features/*`), centralized Axios client, TanStack Query v5 server state, React Hook Form + Yup runtime validation.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite (ES2022 JavaScript, JSX)
- **Styling**: Bootstrap 5 customized via SCSS variables (`5px` radius tokens)
- **Routing**: React Router v6 (lazy-loaded role-based routes with v7 future flags)
- **State & Server Cache**: TanStack Query v5 + Axios (single instance)
- **Forms & Validation**: React Hook Form + Yup
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Charts**: Recharts
- **Icons**: Lucide React
- **Security**: DOMPurify for HTML sanitization
- **Testing**: Vitest + React Testing Library + MSW
- **Containerization**: Docker (multi-stage Node 20 build + Nginx runtime)

---

## 📁 Project Structure

```text
talent360-frontend/
├── .github/workflows/ci.yml       # GitHub Actions CI (lint, test, build)
├── nginx.conf                     # Nginx config with security headers & SPA fallback
├── Dockerfile                     # Multi-stage Node builder & Nginx runner
├── jsconfig.json                  # strict JS checking & @ path alias
├── vite.config.js                 # Vite bundler configuration & pre-bundling
├── src/
│   ├── api/                       # Axios client & typed API services
│   ├── app/                       # App layout, providers, & router config
│   ├── components/                # Reusable design system primitives
│   ├── constants/                 # Enums & application routes
│   ├── features/                  # Domain-driven feature modules
│   │   ├── admin/                 # User & department administration
│   │   ├── applications/          # Kanban pipeline & ranking
│   │   ├── auth/                  # Login, registration, & protected layouts
│   │   ├── candidate/             # CV upload & candidate profile
│   │   ├── dashboard/             # Role-specific analytics dashboards
│   │   ├── jobs/                  # Job listings & AI JD generator
│   │   ├── settings/              # User preferences & account settings
│   │   └── shared/                # Error boundaries, 404, & 403 pages
│   ├── hooks/                     # Custom React hooks (auth, toast, debounce)
│   ├── layouts/                   # AppLayout, AuthLayout, Navbar, Sidebar
│   ├── models/                    # JSDoc entity models & schemas
│   ├── styles/                    # SCSS theme tokens & Bootstrap overrides
│   └── utils/                     # Formatting & error handling helpers
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Adjust `VITE_API_BASE_URL` if your backend runs on a different port:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server on port 5173 |
| `npm run build` | Compile and optimize for production in `/dist` |
| `npm run preview` | Locally preview the production build |
| `npm run lint` | Check code style with ESLint |
| `npm run lint:fix` | Automatically fix ESLint errors |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run unit tests with Vitest |

---

## 🐳 Docker Deployment

Build and run the production container with Nginx:

```bash
# Build Docker image
docker build -t talent360-frontend:latest .

# Run Docker container on port 80
docker run -p 80:80 talent360-frontend:latest
```

---

## 📄 License

This project is licensed under the MIT License.
