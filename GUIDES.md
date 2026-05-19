# Convertools - Production & Monetization Guide

This guide provides the necessary steps to deploy, optimize, and monetize your professional tools website.

## 1. Deployment Instructions (Vercel)

1.  **Repository Setup**: Push your code to a GitHub, GitLab, or Bitbucket repository.
2.  **Vercel Import**: Go to [vercel.com](https://vercel.com) and click "Add New Project". Import your repository.
3.  **Build Settings**:
    *   Framework Preset: `Vite` (or `Other` if using a custom server).
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
4.  **Environment Variables**: If you add a Google login later using Firebase, add your `VITE_FIREBASE_API_KEY`, etc.
5.  **Deploy**: Click deploy. Vercel will automatically provide a production-ready URL with SSL.

## 2. SEO Setup Guide

*   **Sitemap**: The app includes a `/sitemap.xml` link in the footer. Ensure the actual `sitemap.xml` in your `public` folder reflects all tool URLs.
*   **Structured Data**: `App.tsx` already includes `StructuredData` (JSON-LD) for `WebApplication` and `BreadcrumbList`.
*   **Meta Tags**: Every tool page in `ToolLayout.tsx` should eventually be wrapped with a library like `react-helmet-async` for dynamic titles and meta descriptions (currently managed via constants).
*   **Search Console**: Register your domain on [Google Search Console](https://search.google.com/search-console) to monitor indexing and health.

## 3. AdSense Readiness Checklist

1.  **Unique Content**: The "Publisher Content" section in `src/content.ts` provides unique SEO text for each tool, which is critical for AdSense approval.
2.  **Required Pages**: We have implemented About, Contact, Privacy, Terms, and Disclaimer pages.
3.  **Navigation**: Clean sticky navbar and footer links are in place.
4.  **Ad Placement**: Use the `AdUnit` component created in `src/components/AdUnit.tsx`.
    *   **Auto Ads**: Enable "Auto ads" in your AdSense dashboard for better coverage.
    *   **Manual Placement**: Places ads in high-visibility areas: sidebar, footer-top, and after usage instructions.

## 4. Firebase Setup (Optional Authentication)

1.  Create a project at [console.firebase.google.com](https://console.firebase.google.com/).
2.  Enable **Google Authentication**.
3.  Register a Web App and copy the config.
4.  Install Firebase: `npm install firebase`.
5.  Create `src/lib/firebase.ts` and initialize the app.
6.  Use the `set_up_firebase` tool in AI Studio to sync schemas if using Firestore for user history.

## 5. Custom Domain Connection

1.  Purchase a domain (e.g., from Namecheap or Google Domains).
2.  In Vercel Project Settings, go to **Domains**.
3.  Add your domain (e.g., `convertools.app`).
4.  Follow the DNS instructions provided by Vercel (typically adding an `A` record and a `CNAME` record).

## 6. Performance Optimization Tips

*   **Lazy Loading**: The app uses `React.lazy` for all tool components to keep the initial bundle small.
*   **Image Optimization**: Use `.webp` or `.svg` where possible.
*   **Local Processing**: Most tools run client-side, reducing server load and increasing speed.
*   **Vite Bundle Analysis**: Run `npx rollup-plugin-visualizer` to identify large dependencies if the site slows down.

---

**Monetization Tip**: Focus on niche tools that have high search volume but low competition. Create detailed blog posts in the `Blog` section that link to these tools to drive organic traffic.
