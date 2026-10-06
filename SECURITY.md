# FolioNova Security Architecture & Audit Report

This document outlines the security posture, row-level protection mechanisms, cryptographic controls, and threat mitigations implemented across the FolioNova application.

---

## 1. Row-Level Security (RLS) Isolation

All database tables in public schema strictly enforce PostgreSQL Row Level Security (RLS). Cross-user access is blocked at the database engine level.

### Table Policies Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | Public if `is_published = true`, or `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `skills` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `experiences` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `education` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `projects` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `certifications` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `testimonials` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `social_links` | Inherits parent profile visibility | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) | Owner only (`profile_id -> user_id`) |
| `messages` | Owner only (`profile_id -> user_id`) | Public (rate-limited via API) | Owner only | Owner only |

### Storage Bucket Isolation
- Storage buckets (`avatars`, `project-images`) restrict writes using:
  `(storage.foldername(name))[1] = auth.uid()::text`
- User A cannot overwrite, mutate, or delete assets uploaded by User B.

---

## 2. API Endpoints & Zero-Trust Validation

Every server route validates inputs using strict Zod schemas and executes in a zero-trust model:

1. **`/api/contact`**:
   - Validates recipient profile existence.
   - Enforces name (max 100 chars), email (RFC 5322), and message length constraints.
   - Enforces sliding window rate limit (max 5 submissions per 10 minutes per IP).
   - Sanitizes text and strips HTML formatting.

2. **`/api/cv/[username]`**:
   - Rate limited (max 20 requests per hour per IP).
   - Verified against `is_published = true` status.
   - Respects user privacy flags (`show_email`, `show_phone`), suppressing unpermitted contact info.

3. **`/api/view`**:
   - Zero-cookie telemetry beacon.
   - SHA-256 IP hashing with a dynamic daily salt (`YYYY-MM-DD`). Raw IP addresses are **never stored** in the database or server logs.
   - Debounced deduplication prevents view-count inflation.

---

## 3. Client Bundle Protection & Key Hygiene

- `SUPABASE_SERVICE_ROLE_KEY` is exclusively consumed in server-side Route Handlers (`src/lib/supabase/admin.ts`).
- It has no `NEXT_PUBLIC_` prefix, preventing Next.js bundler from including it in client-side JavaScript.
- Client components only ever receive `NEXT_PUBLIC_SUPABASE_ANON_KEY`, operating strictly under RLS policies.

---

## 4. Content Security Policy (CSP) & Defense-in-Depth Headers

Configured in `next.config.ts`:
- **Content-Security-Policy**: Restricts script execution, frame nesting, object execution (`object-src 'none'`), and forms.
- **X-Frame-Options**: `SAMEORIGIN` (prevents clickjacking while permitting local CV iframe previews).
- **X-Content-Type-Options**: `nosniff` (mitigates MIME-sniffing).
- **Strict-Transport-Security**: `max-age=63072000; includeSubDomains; preload`.
- **Permissions-Policy**: Explicitly disables camera, microphone, and geolocation access.

---

## 5. XSS Prevention & User String Sanitization

- User data is rendered exclusively via React JSX bindings (automatic character escaping).
- No unsafe `dangerouslySetInnerHTML` is used with raw user inputs.
- The public JSON-LD metadata block explicitly sanitizes script closing tags:
  ```ts
  JSON.stringify(jsonLd).replace(/</g, "\\u003c")
  ```
  preventing script breakout vectors.

---

## 6. Binary Magic Bytes File Verification

Avatar uploads in `src/components/ui/avatar-uploader.tsx` check binary magic byte signatures before parsing or uploading:
- JPEG: `FF D8 FF`
- PNG: `89 50 4E 47 0D 0A 1A 0A`
- WebP: `RIFF .... WEBP`
- GIF: `GIF87a / GIF89a`

Files with manipulated extensions (e.g. `.php` or `.svg` renamed to `.png`) fail magic byte inspection and are rejected immediately.

---

## 7. Open Redirect & Auth Abuse Mitigation

- Post-login redirects pass through `getSafeRedirectUrl()` in `src/lib/security/safe-redirect.ts`.
- Blocks protocol-relative URLs (`//attacker.com`), backslash path traversal (`/\attacker.com`), and javascript URI schemes.
- Password resets and email changes require cryptographically verified Supabase PKCE tokens.

---

## 8. Account Deletion & Right-To-Erasure (GDPR)

In **Settings > Danger Zone**:
- Deleting an account initiates a foreign-key `CASCADE` deletion across `profiles`, `skills`, `experiences`, `education`, `projects`, `certifications`, `testimonials`, `social_links`, and `messages`.
- Associated user folders in Supabase Storage are systematically purged.
