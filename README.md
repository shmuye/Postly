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
