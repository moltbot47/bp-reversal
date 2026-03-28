# ADR-001: Technology Stack Selection

## Status
Accepted

## Context
BP Reversal needs a mobile-first PWA that tracks 21 daily health habits across a 90-day protocol. Key requirements: one-tap interactions, push notifications, offline support, free to operate, and fast to build.

## Decision
- **Next.js 16** (App Router) — SSR + static pages + API routes in one framework
- **Prisma 7** + PostgreSQL (Neon) — type-safe ORM with free-tier serverless DB
- **NextAuth v5** + Resend — email magic link auth, no passwords to manage
- **Zustand** — lightweight client state with optimistic updates
- **Tailwind CSS v4** — rapid UI development, mobile-first utilities
- **Radix UI** — accessible component primitives
- **Web Push API** — free push notifications via VAPID (no Twilio costs)
- **Vercel** — deployment with edge functions and cron jobs

## Alternatives Considered
- **React Native**: Better native experience but doubles development time and requires app store approval
- **Supabase**: Built-in auth and realtime but vendor lock-in and higher complexity
- **Firebase**: Good for mobile but proprietary, harder to migrate
- **Twilio**: Reliable SMS reminders but costs $0.01/message, unsustainable for free app

## Consequences
- **Positive**: Zero monthly cost on free tiers, fast iteration, type safety throughout
- **Negative**: Push notifications require "Add to Home Screen" on iOS, Vercel Hobby limits crons to daily
