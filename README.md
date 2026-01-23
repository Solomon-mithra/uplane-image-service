# Image Transformation Service

> A professional-grade, event-driven image processing platform built for scale.

![Application Preview](/public/image.png)

## 🚀 Overview

ImageTransform is a state-of-the-art service allowing users to upload, process, and manage image assets with enterprise reliability. Built on **Nuxt 4**, it leverages **Inngest** for durable background workflow execution (Background Removal, fliping the image) and **Supabase** for secure storage and data persistence.

The frontend features a "Linear-class" design system with a focus on typography, micro-interactions, and a clean light mode aesthetic.

## ✨ Features

- **Robust Processing Pipeline**: Multi-step workflows (Download → Process → Optimization) that survive server restarts.
- **Background Removal**: Automated subject isolation (Mocked integration point).
- **Smart Transformations**: High-performance image operations using `sharp`.
- **Real-time UX**: Polling-based status updates without layout shifts.
- **Enterprise Gallery**: Asset management with secure deletion and easy sharing.
- **Reliable Storage**: S3-compatible object storage via Supabase.

## 🛠 Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com) (Vue 3 + Nitro Server)
- **Queue System**: [Inngest](https://inngest.com) (Redis-backed Event Bus)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL + RLS)
- **Image Engine**: [Sharp](https://sharp.pixelplumbing.com)
- **Styling**: Scoped CSS Variables (No Tailwind dependency)

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- NPM or PNPM
- A Supabase Project (Free Tier works)

### 1. Environment Configuration

Rename `.env.example` to `.env` and configure your credentials:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

> **Note**: For local development, Inngest does not require API keys. Leave the `INNGEST_*` variables empty in `.env`.

### 2. Database & Storage Setup

**Step 1: Storage (Manual)**
1.  Go to the **Storage** tab in your Supabase Dashboard.
2.  Create a new public bucket named `images`.
3.  Ensure "Public" is toggled ON.

**Step 2: Database (SQL)**
Run the following SQL in your Supabase SQL Editor to initialize the schema:

```sql
-- 1. Create Metadata Table
create table public.images (
  id uuid primary key,
  original_filename text,
  storage_path text,
  processed_url text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Security Policies
alter table public.images enable row level security;
create policy "Public Access" on public.images for all using (true);
create policy "Public Storage Access" on storage.objects for all using ( bucket_id = 'images' );
```

### 3. Running Locally

This service requires two concurrent processes: the Application Server and the Inngest Dev Server (for background jobs).

**Terminal 1: Start the App**
```bash
npm run dev
```

**Terminal 2: Start Inngest**
We explicitly point Inngest to the local API endpoint to ensure reliable function discovery.
```bash
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

Visit the app at [http://localhost:3000](http://localhost:3000).
Monitor background jobs at [http://localhost:8288](http://localhost:8288).

---

## 📦 Deployment

This application is "Edge Ready" and can be deployed to Vercel, Netlify, or any Node.js host.

1.  **Build**: `npm run build`
2.  **Env**: Set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` in your provider.
3.  **Inngest**: 
    - Set `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` (Get these from Inngest Cloud).
    - The app will automatically sync with Inngest Cloud on deployment.

---

## 📄 License

MIT © 2024 ImageTransform Inc.
