# Portfolio Application - Complete Project Structure & Documentation

This document provides a comprehensive overview of the file structure, architecture, and deployment instructions for both the frontend and backend of this developer portfolio application.

---

## 📁 Complete File & Folder Tree

```
├── api/
│   └── index.ts                 # Vercel serverless entry point exporting Express app
├── server/                      # Full-stack Node.js / Express backend
│   ├── config/
│   │   └── env.config.ts        # Zod environment variable schema & validation
│   ├── controllers/             # Express route controller handlers
│   │   ├── admin.controller.ts    # Admin authentication, token verification, password verification
│   │   ├── blog.controller.ts     # CRUD for blog posts
│   │   ├── contact.controller.ts  # Contact messages handling & email sending
│   │   ├── education.controller.ts# CRUD for education items
│   │   ├── experience.controller.ts# CRUD for work experiences
│   │   ├── health.controller.ts   # System status & database health endpoint
│   │   ├── profile.controller.ts  # Portfolio owner profile retrieval & update
│   │   ├── project.controller.ts  # CRUD for portfolio projects
│   │   └── skills.controller.ts   # CRUD for technical skills
│   ├── db/
│   │   ├── jsonStore.ts          # Local file-based JSON persistence engine (portfolio_db.json)
│   │   └── mongodb.ts            # MongoDB connection singleton & driver wrapper
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT authentication verification middleware
│   │   ├── error.middleware.ts   # Centralized Express error handler
│   │   ├── rateLimiter.ts        # Express rate limiting for security
│   │   └── validate.middleware.ts# Zod request validation middleware
│   ├── models/
│   │   └── types.ts              # Server-side TypeScript interfaces & DB document schemas
│   ├── routes/                   # Express routers definition
│   │   ├── admin.routes.ts       # Router for /api/admin
│   │   ├── blog.routes.ts        # Router for /api/blogs
│   │   ├── contact.routes.ts     # Router for /api/contact
│   │   ├── education.routes.ts   # Router for /api/education
│   │   ├── experience.routes.ts  # Router for /api/experience
│   │   ├── health.routes.ts     # Router for /api/health
│   │   ├── index.ts              # Main router assembling all sub-routes under /api
│   │   ├── profile.routes.ts     # Router for /api/profile
│   │   ├── project.routes.ts     # Router for /api/projects
│   │   └── skills.routes.ts      # Router for /api/skills
│   ├── services/                 # Data access layer & business logic
│   │   ├── admin.service.ts      # Admin JWT issue & password check
│   │   ├── blog.service.ts       # Blog data persistence logic
│   │   ├── education.service.ts  # Education data persistence logic
│   │   ├── emailService.ts       # Nodemailer SMTP email dispatcher for contact form
│   │   ├── experience.service.ts # Experience data persistence logic
│   │   ├── profile.service.ts    # Profile data persistence logic
│   │   ├── project.service.ts    # Project data persistence logic
│   │   └── skills.service.ts     # Skills data persistence logic
│   └── utils/
│       ├── apiResponse.ts        # Helper functions for standardized JSON responses
│       ├── logger.ts             # Console logger with timestamp & levels
│       └── validators.ts         # Common validation utilities
├── src/                          # Frontend React (Vite + TypeScript + Tailwind)
│   ├── api/                      # Client HTTP network layer
│   │   ├── apiClient.ts          # Axios / Fetch client with auth headers & error handling
│   │   └── portfolioApi.ts       # API service calls matching server endpoints
│   ├── components/
│   │   ├── admin/                # Admin Panel Components
│   │   │   ├── modals/           # Modal dialogs for admin management
│   │   │   │   ├── AdminAuthModal.tsx # Login modal with JWT authentication
│   │   │   │   ├── BlogModal.tsx      # Modal for creating/editing blogs
│   │   │   │   ├── MongoDbModal.tsx   # Modal for configuring MongoDB connection string live
│   │   │   │   ├── ProjectModal.tsx   # Modal for creating/editing projects
│   │   │   │   └── PublishModal.tsx   # Modal for confirming site publish/changes
│   │   │   ├── AdminBlogsTable.tsx    # Blog management table & controls
│   │   │   ├── AdminMessagesTable.tsx # Contact form messages viewer & status manager
│   │   │   ├── AdminOverview.tsx     # Admin dashboard metrics & quick stats
│   │   │   ├── AdminProjectsTable.tsx # Project management table & filters
│   │   │   ├── AdminSidebar.tsx      # Admin panel navigation sidebar
│   │   │   ├── AdminTopBar.tsx       # Admin header with view toggle, Mongo modal, logout
│   │   │   ├── EducationManager.tsx  # Manage education history
│   │   │   ├── ExperienceManager.tsx # Manage work experience history
│   │   │   ├── ImageAdjuster.tsx     # Image upload, crop, resize & preview tool
│   │   │   ├── ProfileManager.tsx    # Manage profile bio, social links, status
│   │   │   └── SkillsManager.tsx     # Manage skills & categories
│   │   ├── public/               # Public Visitor Portfolio Sections
│   │   │   ├── AboutSection.tsx            # About Me section
│   │   │   ├── AiHeroGraph.tsx             # Interactive canvas / graph animation in hero
│   │   │   ├── BlogSection.tsx             # Blog post showcase & modal preview
│   │   │   ├── ContactSection.tsx          # Interactive contact form
│   │   │   ├── DedicatedProjectsPage.tsx   # All projects view with search & filtering
│   │   │   ├── EducationSection.tsx        # Education section display
│   │   │   ├── ExperienceEducationSection.tsx # Combined tabbed experience & education view
│   │   │   ├── ExperienceSection.tsx       # Work history timeline display
│   │   │   ├── FeaturedProjectsSection.tsx  # Spotlight featured projects
│   │   │   ├── HeroSection.tsx             # Main hero landing section
│   │   │   ├── HighlightsSection.tsx       # Key metrics & highlight stats
│   │   │   ├── PortfolioFooter.tsx         # Public footer with social links
│   │   │   ├── ProjectDetailModal.tsx      # Fullscreen project details modal
│   │   │   └── SkillsSection.tsx           # Category-filtered skill tags
│   │   ├── PublicPortfolioNav.tsx# Floating responsive navigation bar
│   │   ├── PublicPortfolioView.tsx# Master wrapper component for public view
│   │   └── Toast.tsx             # Notification toast overlay
│   ├── data/
│   │   └── initialData.ts        # Default fallback portfolio data
│   ├── hooks/
│   │   ├── useAuth.ts            # Admin authentication state & login/logout logic
│   │   ├── useContactForm.ts     # Contact form submission state
│   │   ├── usePortfolioData.ts   # Central portfolio data fetcher, CRUD actions & state
│   │   └── useToast.ts           # Toast alert notification hook
│   ├── services/
│   │   └── contactService.ts     # Client service for contacting backend
│   ├── utils/
│   │   └── imageUtils.ts         # Image formatting, placeholder & validation utilities
│   ├── App.tsx                   # Main React root layout component
│   ├── index.css                 # Global Tailwind CSS styles
│   ├── main.tsx                  # Vite React entry point
│   └── types.ts                  # Shared client TypeScript types
├── .env.example                  # Template for required environment variables
├── .gitignore                    # Git ignored files (node_modules, build outputs, secrets)
├── index.html                    # Root HTML document template
├── metadata.json                 # Application metadata & platform configuration
├── package.json                  # Dependencies, scripts (dev, build, start)
├── portfolio_db.json             # Local JSON database storage file
├── server.ts                     # Express server entry point for Node container execution
├── tsconfig.json                 # TypeScript compiler configuration
├── vercel.json                   # Vercel deployment configuration & routing rewrites
└── vite.config.ts                # Vite build & server configuration
```

---

## 📄 Detailed File Descriptions

### 🚀 Deployment & Root Configuration

* **`vercel.json`**: Vercel configuration file. Defines routing rewrites to send `/api/*` requests to the serverless function handler at `/api/index.ts` and all frontend routes to `/index.html`.
* **`api/index.ts`**: Serverless function entry point for Vercel. Initializes Express, sets up CORS and security headers, connects lazily to MongoDB, and serves all `/api` endpoints.
* **`server.ts`**: Standalone Express server entry point used when running via Node.js / Docker. Mounts Vite middleware in development and static file serving in production.
* **`vite.config.ts`**: Vite configuration. Handles React plugin integration, dev server configuration (port 3000), and excludes `portfolio_db.json` from hot-reload watching to prevent state reset triggers.
* **`package.json`**: Node manifest containing all required dependencies (Express, React, Lucide, MongoDB, Zod, JWT, Tailwind, etc.) and npm scripts.
* **`.env.example`**: Reference file showing required environment variables (`ADMIN_PASSWORD`, `JWT_SECRET`, `MONGODB_URI`, `CONTACT_RECEIVER_EMAIL`, `SMTP_*`).
* **`portfolio_db.json`**: File-backed fallback JSON store when MongoDB is not connected locally.

---

### 🖥️ Backend Architecture (`/server`)

#### ⚙️ Configuration & DB
* **`server/config/env.config.ts`**: Parses and validates process environment variables using Zod schemas. Enforces security requirements for `ADMIN_PASSWORD` and `JWT_SECRET`.
* **`server/db/mongodb.ts`**: MongoDB connection manager. Provides singleton connection pool and methods to access MongoDB collections.
* **`server/db/jsonStore.ts`**: Fallback storage engine reading and writing synchronously to `portfolio_db.json`.

#### 🛡️ Middleware
* **`server/middleware/auth.middleware.ts`**: Verifies JWT tokens in `Authorization: Bearer <token>` headers to protect administrative API endpoints.
* **`server/middleware/error.middleware.ts`**: Central error handler formatting operational errors into consistent JSON responses.
* **`server/middleware/rateLimiter.ts`**: Prevents abuse by limiting request rates on sensitive endpoints like admin login and contact submission.
* **`server/middleware/validate.middleware.ts`**: Validates incoming request body payloads against Zod schemas.

#### 🔀 Routes (`/server/routes`)
* **`index.ts`**: Assembles all endpoint routes under `/api` (`/api/admin`, `/api/projects`, `/api/blogs`, `/api/skills`, `/api/experience`, `/api/education`, `/api/profile`, `/api/contact`, `/api/health`).
* **`admin.routes.ts`**: Endpoints for admin authentication (`POST /api/admin/login`, `GET /api/admin/verify`).
* **`project.routes.ts`**: CRUD endpoints for portfolio projects.
* **`blog.routes.ts`**: CRUD endpoints for blog posts.
* **`skills.routes.ts`**: CRUD endpoints for tech stack skills.
* **`experience.routes.ts`**: CRUD endpoints for work experience items.
* **`education.routes.ts`**: CRUD endpoints for education credentials.
* **`profile.routes.ts`**: Endpoints to view/update profile summary and status.
* **`contact.routes.ts`**: Endpoints to send contact messages and retrieve them for the admin dashboard.
* **`health.routes.ts`**: Health-check endpoint reporting server uptime and database connectivity.

#### 🧠 Services & Controllers (`/server/services` & `/server/controllers`)
* **`admin.service.ts` / `admin.controller.ts`**: Handles admin login, password checking, and JWT token issuance.
* **`project.service.ts` / `project.controller.ts`**: Manages fetching, creating, editing, and deleting project entries in MongoDB (or fallback JSON).
* **`blog.service.ts` / `blog.controller.ts`**: Manages blog post operations.
* **`skills.service.ts` / `skills.controller.ts`**: Manages technical skill categories and items.
* **`experience.service.ts` / `experience.controller.ts`**: Manages work experience timeline entries.
* **`education.service.ts` / `education.controller.ts`**: Manages academic background entries.
* **`profile.service.ts` / `profile.controller.ts`**: Manages developer profile info (name, title, bio, social links, availability status).
* **`contact.controller.ts`**: Receives visitor messages, saves them to database, and forwards them via email if SMTP is configured.
* **`emailService.ts`**: Uses Nodemailer to deliver emails to `CONTACT_RECEIVER_EMAIL`.

---

### 🎨 Frontend Architecture (`/src`)

#### 🔄 State & Hooks (`/src/hooks`)
* **`usePortfolioData.ts`**: Primary hook managing all portfolio state (projects, blogs, skills, profile, experience, education, messages). Persists active admin tab across updates and syncs modifications with the backend API.
* **`useAuth.ts`**: Handles admin login state, storing JWT tokens securely in browser storage, and managing authentication modals.
* **`useToast.ts`**: Provides toast notifications for user actions (success, error, info).
* **`useContactForm.ts`**: Manages user input and state for sending messages through the contact form.

#### 🛠️ Client API Layer (`/src/api`)
* **`apiClient.ts`**: Configured Axios/Fetch client that automatically injects the admin JWT bearer token into request headers.
* **`portfolioApi.ts`**: Abstracted API service functions mapping directly to server endpoints for seamless frontend-backend communication.

#### 💼 Admin Components (`/src/components/admin`)
* **`AdminOverview.tsx`**: Dashboard displaying live metrics (total projects, blogs, messages, skills) and system status.
* **`AdminProjectsTable.tsx`**: Interactive table allowing admins to add, edit, feature, search, and delete projects.
* **`AdminBlogsTable.tsx`**: Interface for writing, updating, and managing blog posts.
* **`SkillsManager.tsx`**: Interface for adding/organizing skills into categories.
* **`ExperienceManager.tsx`**: Manager for editing work history entries.
* **`EducationManager.tsx`**: Manager for editing education entries.
* **`ProfileManager.tsx`**: Controls profile details, contact information, social links, and availability badge.
* **`AdminMessagesTable.tsx`**: Inbox for viewing and managing messages sent by site visitors.
* **`ImageAdjuster.tsx`**: Image upload preview and optimization component.
* **`modals/AdminAuthModal.tsx`**: Modal for logging into the admin panel.
* **`modals/MongoDbModal.tsx`**: Modal for connecting or updating the MongoDB database URI dynamically.
* **`modals/ProjectModal.tsx`**: Form modal for creating/editing projects with image URL support.
* **`modals/BlogModal.tsx`**: Form modal for creating/editing blog posts.

#### 🌐 Visitor Components (`/src/components/public`)
* **`HeroSection.tsx`**: Landing area featuring headline, call to action, status badge, and interactive graphics.
* **`AiHeroGraph.tsx`**: Interactive canvas animation embedded in the hero section.
* **`AboutSection.tsx`**: Detailed bio and skill overview.
* **`FeaturedProjectsSection.tsx`**: Highlights top featured projects on the home view.
* **`DedicatedProjectsPage.tsx`**: Complete gallery view with live search, filtering by technology, and tags.
* **`ProjectDetailModal.tsx`**: Full-screen modal showcasing project screenshots, tech stack, and external links.
* **`ExperienceEducationSection.tsx`**: Unified interactive tab view for career history and education.
* **`SkillsSection.tsx`**: Categorized visual display of all technical skills.
* **`BlogSection.tsx`**: Showcase of articles and blog posts with reader modal.
* **`ContactSection.tsx`**: Direct message form for visitors.
* **`PortfolioFooter.tsx`**: Clean footer with copyright, navigation links, and social icons.

---

## 🌐 How to Deploy Frontend & Backend to Vercel

Follow these step-by-step instructions to deploy both the frontend interface and the backend serverless API to Vercel.

### Step 1: Set Up MongoDB Database (MongoDB Atlas)
Since serverless environments like Vercel do not store persistent local files across restarts, you need a cloud MongoDB database:

1. Sign up/Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Cluster** (M0).
3. Under **Database Access**, create a database user (e.g. `portfolio_admin`) and set a strong password.
4. Under **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so Vercel serverless functions can connect.
5. Click **Connect** on your cluster -> Choose **Drivers** -> Copy your connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority`

---

### Step 2: Push Your Code to GitHub
1. Initialize git in your repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit with Vercel configuration"
   ```
2. Push your repository to your GitHub account.

---

### Step 3: Deploy Project on Vercel
1. Log in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Import your GitHub repository.
3. Keep the default settings:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Expand **Environment Variables** and add the following:

   | Environment Variable | Description / Value |
   | :--- | :--- |
   | `ADMIN_PASSWORD` | Strong password to log into the admin panel (min 8 chars) |
   | `JWT_SECRET` | Secret key for signing admin authentication tokens (min 16 chars) |
   | `MONGODB_URI` | Your MongoDB Atlas connection string from Step 1 |
   | `CONTACT_RECEIVER_EMAIL` | *(Optional)* Email address to receive visitor contact messages |
   | `SMTP_HOST` | *(Optional)* SMTP server host (e.g. `smtp.gmail.com`) |
   | `SMTP_PORT` | *(Optional)* SMTP port (e.g. `587` or `465`) |
   | `SMTP_USER` | *(Optional)* Your SMTP email address |
   | `SMTP_PASS` | *(Optional)* Your SMTP app password |

5. Click **Deploy**.

---

### Step 4: Verify Deployment
1. Once deployment finishes, Vercel gives you a URL (e.g. `https://your-portfolio.vercel.app`).
2. Visit `https://your-portfolio.vercel.app` to view your public portfolio.
3. Access the Admin Panel:
   * Click **Admin Login** in the footer or navigation, or press the lock icon.
   * Enter your `ADMIN_PASSWORD` defined in Vercel environment variables.
   * You can now add, edit, or delete projects, blogs, skills, and profile details! All data will be saved permanently to your MongoDB Atlas database.
