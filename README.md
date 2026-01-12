**Social Media App**

- **Description**: A lightweight social media prototype built with React, TypeScript, Vite, Supabase and Tailwind CSS. It includes community pages, posts, comments, likes and user authentication powered by Supabase.

**Features**
- **Authentication**: Email + password sign up / sign in using Supabase.
- **Create Communities**: Users can create and browse communities.
- **Create Posts**: Create text-based posts within communities.
- **Comments & Likes**: Reply to posts and like them.
- **Routing**: Client-side navigation with `react-router-dom`.
- **Data fetching**: Uses `@tanstack/react-query` for caching and background updates.

**Tech Stack**
- **Framework**: `React` + `TypeScript` (via Vite)
- **Bundler / Dev Server**: `Vite`
- **Auth & Database**: `Supabase` (`@supabase/supabase-js`)
- **Styling**: `Tailwind CSS`
- **Data fetching**: `@tanstack/react-query`

**Getting Started**
- **Prerequisites**: Node.js (v18+ recommended) and npm or pnpm.
- **Install dependencies**:

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

**Deployment**
- This app can be deployed to Vercel, Netlify or any static host that supports environment variables. Set the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting platform.

**Contributing**
- **Bug reports & features**: Open an issue describing the problem or feature.
- **Code style**: Run `npm run lint` and follow ESLint suggestions.
- **Pull requests**: Target `main` and include a short description of changes.

**License**
- This repository does not include a license file. Add one (for example `MIT`) if you want to allow others to reuse the code.

**Next steps / Suggestions**
- Add automated tests and CI (e.g., GitHub Actions).
- Add stricter type coverage and PropTypes checks where appropriate.
- Add deployment configuration examples for Vercel or Netlify.

If you want, I can also:
- Add a short `ENV.example` file with variable names.
- Add a one-click deploy config for Vercel.
