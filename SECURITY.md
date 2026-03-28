# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email: security@bpreversal.com
3. Include: description, reproduction steps, potential impact

We will acknowledge within 48 hours and provide a fix timeline within 7 days.

## Security Measures

- All API routes require authentication via NextAuth v5
- Cron endpoints protected with Bearer token (CRON_SECRET)
- No secrets hardcoded — all via environment variables
- PostgreSQL with parameterized queries (Prisma ORM)
- CSRF protection via NextAuth session tokens
- Input validation on all POST/PUT endpoints
- Push subscriptions use VAPID authentication
- Standalone output mode for minimal container surface

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
