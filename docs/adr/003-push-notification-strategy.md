# ADR-003: Web Push Over SMS for Notifications

## Status
Accepted

## Context
Users need reminders at each of the 4 daily time blocks (Morning, Midday, Afternoon, Evening) to maintain adherence. The app must remain free to operate.

## Decision
Use the Web Push API with VAPID keys instead of SMS (Twilio) or email reminders:
- Push subscription stored as JSON on the User model
- Vercel cron job checks each user's wake-up time + timezone to compute time blocks
- 20-minute notification window per block to tolerate cron jitter
- Encouraging messages only — never guilt-tripping
- iPhone users guided to "Add to Home Screen" during onboarding

## Alternatives Considered
- **Twilio SMS**: Reliable delivery but costs $0.0079/message; at 4 messages/day * 1000 users = $948/month
- **Email reminders**: Free via Resend but low open rates (20%) and often delayed
- **In-app only**: No cost but users must open the app to see reminders, defeating the purpose

## Consequences
- **Positive**: Zero cost at any scale, works offline on Android, native notification experience
- **Negative**: iOS requires PWA install ("Add to Home Screen"), Safari push support is newer and less reliable
