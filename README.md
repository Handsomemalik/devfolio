# FolioNova

> **"Your career, as a living work of art."**  
> *Designed & developed by Abdul Manan*

FolioNova is an all-in-one career presentation engine and portfolio operating system. Users enter their professional trajectory once and instantly receive:

1. **A Cinematic, Animated Web Portfolio** hosted at `/u/[username]` with QR code sharing, view counters, and live visitor contact messaging.
2. **5 Bespoke Design Archetypes** (`Aurora Glass`, `Neo-Brutalist`, `Minimal Monolith`, `Cyberpunk Terminal`, `Editorial Atelier`) switchable in one click without data re-entry.
3. **Automatic Vector CV / Resume Generator** powered by `@react-pdf/renderer` with **6 Bespoke Templates** (`Executive`, `Modern`, `Creative`, `Minimal`, `Technical`, `Elegant`), selectable text, clickable links, A4/US Letter sizing, embedded typography, and dynamic server-side streaming `/api/cv/[username]`.
4. **PostgreSQL Database with Row-Level Security (RLS)**, GDPR data-erasure compliance, password protection, and zero-cookie visitor analytics.

---

## 🌟 Feature Tour

### 🎨 5 Cinematic Portfolio Archetypes
- **Aurora Glass (`aurora`)**: Frosted glass panels, animated mesh gradients, floating orbs, fluid micro-interactions.
- **Neo-Brutalist (`brutalist`)**: High-contrast borders, bold retro typography, brutalist shadows, vibrant accent pops.
- **Minimal Monolith (`minimal`)**: Editorial whitespace, Swiss typography, understated rules, timeless elegance.
- **Cyberpunk Terminal (`cyberpunk`)**: Monospace code headers, neon scanlines, dark tech aesthetic, status indicators.
- **Editorial Atelier (`editorial`)**: Serif typography, publication layouts, refined margins, curated portfolio aesthetics.

### 📄 6 Bespoke CV & Resume Templates
- **Executive (`executive`)**: Single column, serif headers, thin rules, centered name, corporate authority.
- **Modern (`modern`)**: Two columns, accent sidebar with optional photo, skills tags, timeline experience.
- **Creative (`creative`)**: Full-bleed accent header band, asymmetrical layout, rounded skill pills, numbered project markers (`01.`).
- **Minimal (`minimal`)**: Single-column whitespace-rich layout with small-caps labels and maximum readability.
- **Technical (`technical`)**: ATS-optimized developer resume with prominent tech stacks, monospace tags, and zero images.
- **Elegant (`elegant`)**: Refined two-tone layout with serif typography and slim rail.

### 🛠️ Interactive CV Studio (`/cv`)
- Live debounced PDF preview iframe with real multi-page flow.
- A4 and US Letter toggle.
- Accent color palette picker with automatic WCAG contrast calculation.
- Include / exclude photo toggle (supported on Modern, Creative, Elegant).
- Section visibility toggles (Summary, Experience, Skills, Projects, Education, Certifications, Languages).
- Live CV readiness audit score with quick-jump fix links.
- Instant blob download as `<Full-Name>-CV.pdf`, direct public link copy, and browser print.

---

## 🚀 Step-by-Step Setup Guide (For Non-Experts)

### Step 1: Clone and Install
Make sure you have [Node.js](https://nodejs.org) (v18 or v20+) installed.
```bash
git clone https://github.com/your-username/folionova.git
cd folionova
npm install
```

### Step 2: Create a Free Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project**, choose a project name (e.g. `folionova-db`), set a database password, and choose your preferred region.
3. Wait 1-2 minutes for Supabase to finish provisioning.

### Step 3: Run Database Migrations in Order
In your Supabase project dashboard, navigate to the **SQL Editor** in the left sidebar. Run the three migration scripts in this exact sequence:

1. **`supabase/migrations/0001_init.sql`**:
   - Creates all core tables (`profiles`, `skills`, `experiences`, `education`, `projects`, `certifications`, `testimonials`, `social_links`, `portfolio_views`).
   - Sets up automatic triggers, updated_at hooks, and `increment_view()` RPC.
   - Enforces PostgreSQL Row-Level Security (RLS) on all tables.
   - Provisions public storage buckets `avatars` and `project-images` with folder-based write isolation.
2. **`supabase/migrations/0002_messages.sql`**:
   - Provisions visitor contact messages with owner-only read policies.
3. **`supabase/migrations/0003_cv_settings.sql`**:
   - Adds the `cv_settings` JSONB configuration column and GIN index to `profiles`.

### Step 4: Configure Environment Variables
Copy the template file to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your keys from **Supabase Dashboard > Project Settings > API**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

*(Optional)* Seed a rich demo account for local previewing:
```bash
npx tsx scripts/seed-demo.ts
```

---

## 🚢 Deploying to Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role secret
   - `NEXT_PUBLIC_SITE_URL` = your production URL (e.g. `https://your-domain.com`)
5. Click **Deploy**. Vercel will build and launch your application globally on Edge infrastructure.

---

## 🌐 Connecting a Custom Domain

1. In your **Vercel Project Dashboard**, navigate to **Settings > Domains**.
2. Enter your custom domain (e.g., `folionova.io` or `portfolio.yourname.com`).
3. Follow the DNS instructions provided by Vercel:
   - For an Apex domain (`yourname.com`): Set an `A` record pointing to `76.76.21.21`.
   - For a Subdomain (`portfolio.yourname.com`): Set a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Update `NEXT_PUBLIC_SITE_URL` in your Vercel Environment Variables to your custom domain.

---

## 🎨 Customizing Brand Name & Credits

All branding, taglines, and credits are centrally configured in [`src/config/brand.ts`](file:///c:/Users/DELL/Documents/devfolio/src/config/brand.ts):

```typescript
export const BRAND_NAME = "FolioNova";
export const BRAND_TAGLINE = "Your career, as a living work of art.";
export const BRAND_DESCRIPTION = "The premier developer & designer portfolio studio...";
export const DEVELOPER_CREDIT = "Designed & developed by Abdul Manan";
```
To change the product name or credits, update these constants and they will propagate across metadata, headers, footers, PDFs, and legal notices.

---

## 🧩 Extending FolioNova: Adding Designs & CV Templates

### Adding a New Portfolio Design
1. Create a component in `src/components/portfolio-designs/<new-design-id>/index.tsx`.
2. Adhere to the design contract:
   ```typescript
   export interface PortfolioDesignProps {
     data: PortfolioData;
     accent: string;
     themeMode: "light" | "dark";
     font: FontKey;
     mode: "live" | "preview" | "editor";
   }
   ```
3. Register the archetype in [`src/config/designs.ts`](file:///c:/Users/DELL/Documents/devfolio/src/config/designs.ts) and [`src/components/portfolio-designs/index.ts`](file:///c:/Users/DELL/Documents/devfolio/src/components/portfolio-designs/index.ts).
4. The new archetype will automatically appear in the Editor picker, Demo pages, and Landing page showcase.

### Adding a New CV Template
1. Create a React-PDF template in `src/lib/cv/templates/<NewTemplate>PdfTemplate.tsx` utilizing `@react-pdf/renderer` primitives (`Document`, `Page`, `View`, `Text`, `Link`).
2. Add the template definition to `CV_TEMPLATE_LIST` in [`src/config/cv-templates.ts`](file:///c:/Users/DELL/Documents/devfolio/src/config/cv-templates.ts).
3. Register the component in `src/lib/cv/CvDocument.tsx` and HTML preview in `src/components/cv-templates/index.tsx`.
4. The template will automatically become available in the CV Studio (`/cv`), PDF streamer (`/api/cv/[username]`), and landing page gallery.

---

## 🧪 Testing & Verification Scripts

```bash
# Run Vitest unit tests (Zod schemas, date formatting, CV data mapping, security)
npm test

# Run TypeScript typecheck
npm run typecheck

# Run ESLint validation
npm run lint

# Run Playwright E2E smoke tests
npm run test:e2e
```

---

## 🛡️ Security & Privacy

For full architectural details on Row-Level Security, rate limiting, Content Security Policy, and binary file validation, see [SECURITY.md](file:///c:/Users/DELL/Documents/devfolio/SECURITY.md).

---

## 📄 License & Attribution

Designed and engineered with care by **Abdul Manan**.
Released under the MIT License.
