# Social Media App

## Description

A lightweight social media prototype built with **React**, **TypeScript**, **Vite**, **Supabase**, and **Tailwind CSS**.  
The application supports communities, posts, comments, likes, and user authentication using **GitHub OAuth via Supabase**.

---

## Features

### Authentication
- GitHub OAuth authentication powered by Supabase
- Secure login and logout flow
- Session persistence across page refreshes

### Communities
- Create and browse communities
- View posts scoped to individual communities

### Posts
- Create text-based posts within communities
- View posts in a feed or as individual pages

### Engagement
- Comment on posts
- Like and unlike posts

### Routing & State
- Client-side routing using `react-router-dom`
- Data fetching, caching, and background updates with `@tanstack/react-query`

---

## Tech Stack

- **Framework**: React + TypeScript (Vite)
- **Dev Server / Bundler**: Vite
- **Authentication & Database**: Supabase
- **Styling**: Tailwind CSS
- **Routing**: react-router-dom
- **Data Fetching**: @tanstack/react-query

---

## Getting Started

### Prerequisites
- Node.js **v18+**
- npm or pnpm

### Installation

```bash
npm install
```

- **Create environment variables**: Copy or create a `.env` (or use your platform env settings) with the following values:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- **Run development server**:

```bash
npm run dev
```

**Available Scripts**
- **`npm run dev`**: Starts the Vite dev server.
- **`npm run build`**: Builds the app (`tsc -b && vite build`).
- **`npm run preview`**: Locally preview the production build.
- **`npm run lint`**: Runs ESLint across the project.

**Environment Variables**
- **`VITE_SUPABASE_URL`**: Your Supabase project URL (starts with `https://...`).
- **`VITE_SUPABASE_ANON_KEY`**: Supabase anon public key for client SDK.

Store secrets securely — don't commit `.env` to version control.

**Project Structure (key files)**
- **`src/main.tsx`**: App bootstrap and router.
- **`src/App.tsx`**: Top-level routes and layout.
- **`src/supabase-client.ts`**: Supabase client instance.
- **`src/contexts/AuthContext.tsx`**: Authentication context and hooks.
- **`src/pages/`**: Page-level components (`Home`, `PostPage`, `CommunitiesPage`, etc.).
- **`src/components/`**: Reusable UI components (posts, comments, community UI).

**Notable Components**
- **`Navbar.tsx`**: Navigation and auth actions.
- **`CreateCommunity.tsx`**: Form to create a community.
- **`CreatePost.tsx`**: Post creation UI.
- **`PostList.tsx` / `PostItem.tsx`**: Post feed and item.
- **`PostDetail.tsx`**: Post page with comments.
- **`CommentSection.tsx` / `CommentItem.tsx`**: Comments UI.
- **`LikeButton.tsx`**: Like/unlike post control.

**Authentication & Data**
- The app uses Supabase for authentication and as the primary database. See `src/supabase-client.ts` and `src/contexts/AuthContext.tsx` for setup and helper functions.





