# SEO Documentation — Swami Bharmanand Gurukul Website

> Yeh documentation project ke current SEO implementation ko track karti hai. Jo changes already implement ho chuke hain unhe `index.html`, `robots.txt`, React components aur routing se verified kiya gaya hai.
>
> Source: `artifacts/school-website/`

---

## 1. Website Overview

### Website Name & Purpose
- **Website Name:** Swami Bharmanand Gurukul (स्वामी ब्रह्मानंद गुरुकुल) — Pundri, Kaithal, Haryana
- **Domain:** `https://www.sbgpundri.com/`
- **Type:** CBSE-affiliated school website (Classes I–XII, est. 1999)
- **Purpose:** Vedic Gurukul values + modern education blend ko promote karna, admissions attract karna, school ki facilities/academics/contact info provide karna.

### Target Audience
- **Parents** — admissions, fee structure, facilities, safety, transport (search intent: "best school in Pundri/Kaithal")
- **Students** — academics, classes, sports, hostel, gallery
- **Local community** — Pundri, Kaithal, Kurukshetra region ke families

### Target Keywords
`index.html` ke meta keywords se (aur content/structured data ke basis par):

| Keyword | Usage |
|---------|-------|
| Swami Bharmanand Gurukul | Title, headings, logo text |
| Gurukul Pundri | Meta keywords, structured data |
| CBSE school Kaithal | Title, meta description, keywords |
| Best school in Pundri | Meta keywords |
| Gurukul Haryana | Meta keywords |
| School admission Kaithal | Meta keywords, admissions content |
| Vedic education school | Meta keywords, hero/about content |
| Sanskrit school Haryana | Meta keywords |
| Gurukul boarding school | Meta keywords, hostel facility |

---

## 2. SEO Changes Jo Ki Gayi Hain

### Title Tag
`index.html:<8>` mein set kiya gaya hai:

```html
<title>Swami Bharmanand Gurukul Pundri | CBSE School in Kaithal, Haryana</title>
```

> **Note:** Yeh ek single global title hai (SPA). Sabhi pages same title share karte hain — per-page dynamic title currently implement nahi hai.

### Meta Description
`index.html:<10>` mein:

```html
<meta name="description" content="Swami Bharmanand Gurukul, Pundri (Kaithal, Haryana) is a CBSE-affiliated school that blends Vedic Gurukul values with modern education. Admissions open for Classes I–XII. Call +91 92551 45421." />
```

### Heading Hierarchy
- **Home Page (`Hero.tsx`):**
  - `h1` — "Swami Bharmanand Gurukul" (sirf ek h1, hero section `#home` mein)
  - `h2` — section headings: Achievements, Features, Classes, News, Testimonials
  - `h3/h4` — cards, feature titles, testimonial names
- **Inner Pages (About, Academics, Admissions, Facilities, Gallery, News, CBSE, Contact):**
  - Aarti hai — hari bati **h2** se start hoti hai (Vision/About/Classes/Admissions/Facilities sections). In pages par dedicated `h1` nahi hai.
- **Legal Pages:** Privacy Policy / Terms — proper `h1` + `h2` structure.
- **404 Page (`not-found.tsx`):** `h1` "404 Page Not Found".
- **Footer:** `h3` (site name) aur `h4` column headings (Quick Links, Important Links, Contact Info).

### Alt Text
- **Hero banner:** `alt="Swami Bharmanand Gurukul school banner in Pundri, Kaithal, Haryana"` (`Hero.tsx:16`) — `loading="eager"`, `fetchPriority="high"`
- **Logo (Navbar):** `alt="Swami Bharmanand Gurukul Logo"` (`Navbar.tsx:56`)
- **Logo (Footer):** `alt="Swami Bharmanand Gurukul Logo"` (`Footer.tsx:40`) — `loading="lazy"`
- **Facilities images:** `alt={facility.alt}` — descriptive, school-name-inklusive alts jaise "Swami Bharmanand Gurukul smart classroom in Pundri" (`Facilities.tsx:48`) — `loading="lazy"`
- **Gallery images:** `alt={img.alt}` — "Students of Swami Bharmanand Gurukul during a school event in Pundri" (`Gallery.tsx:57`) — `loading="lazy"`
- Koi bhi `<img>` tag bina `alt` attribute ke nahi hai (saari 6 images covered).

### Semantic HTML
- `<header>` — `Navbar.tsx:39`
- `<nav>` — desktop navigation `Navbar.tsx:70`, link pagination UI
- `<main>` — `PageLayout.tsx:18`
- `<section>` — Hero, About, Vision, Features, Classes, Facilities, Gallery, News, Testimonials, Admissions, FAQ, Contact, CBSE, Mandatory Disclosure (sab mein `id` attributes diye gaye hain)
- `<article>` — News/Notice cards standalone content ke liye (`News.tsx`)
- `<ul>/<li>` — Features grid (`Features.tsx`), Facilities grid (`Facilities.tsx`), admission documents li
- `<footer>` — `Footer.tsx:32`
- `<form>` — Contact (`Contact.tsx:87`) proper `<label htmlFor>` + `<input type>` + `name` + `required` ke saath
- Buttons/links ka sahi use — navigation → `<a>` (Hero "Discover" links, Navbar/Footer links), actions/dialogs → `<button>` (Gallery thumbnails, lightbox, carousels)
- Proper `h1–h4` hierarchy, `aria-label`s (theme toggle, mobile menu, logo link, lightbox buttons), `sr-only` dialog titles.

### JSON-LD Structured Data
`index.html:<46>` mein `application/ld+json` script — `@graph` with **3 schema types**:

1. **`School`** (schema.org; EducationalOrganization ke under)
   - name, alternateName (Hindi), url, logo, description, foundingDate (1999), telephone, email, PostalAddress (Jind Road, Pundri, Haryana, 136026, IN), GeoCoordinates, `isAccessibleForFree: false`
   - `parentOrganization` → CBSE (Central Board of Secondary Education)
   - `areaServed` → Pundri, Kaithal, Haryana
   - `sameAs` intentionally **nahi** hai — social links abhi placeholders hain (real URLs nahi)
2. **`WebSite`** — publisher → School reference
3. **`FAQPage`** — 6 Q&As (CBSE affiliation, medium of instruction, hostel, student-teacher ratio 25:1, transport, Gurukul values)

### Clean URLs
Client-side routing (wouter) — `App.tsx:<35-46>`:

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/academics` | Academics |
| `/facilities` | Facilities |
| `/gallery` | Gallery |
| `/admissions` | Admissions |
| `/news` | News |
| `/cbse` | CBSE / Mandatory Disclosure |
| `/contact` | Contact |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms & Conditions |
| (fallback) | 404 Page Not Found |

Sab URLs lowercase, hyphenated, keyword-friendly (e.g. `/privacy-policy`, `/terms`). Canonical URL bhi set hai: `<link rel="canonical" href="https://www.sbgpundri.com/" />`.

### Internal Linking
- **Navbar** ($8 links): Home, About, Academics, Admissions, Facilities, Gallery, News, Contact — sab pages ek dusre se linked
- **Footer Quick Links:** About, Admissions, Academics, Facilities, Gallery, Contact
- **Footer Important Links:** CBSE Mandatory Disclosure (`/cbse`), Transfer Certificates + Fee Structure (`/admissions`), School Calendar (`/news`), Careers + Alumni (`/contact`)
- **Hero CTAs:** "Apply for Admission" → `/admissions`, "Contact Us" → `/contact`, "Discover" scroll → `/about`, paragraph mein "contemporary education" → `/academics`
- **Contextual content links (add kiye hain):**
  - `About.tsx` — "modern competencies" → `/academics`
  - `Classes.tsx` — "CBSE-aligned curriculum" → `/cbse`; bottom "Explore Our Academic Programs" → `/academics` (`/academics` par self-link avoid)
  - `News.tsx` — "View All Notices" → `/news` (`/news` par button hidden)
  - `Admissions.tsx` — "Apply Now Online" → `/contact`; "CBSE Affiliation & Mandatory Disclosure" → `/cbse`
  - `Programs.tsx` — top "Apply for Admission" → `/admissions` (+ per-card "View Admission Criteria" → `/admissions`)
  - `Features.tsx` — har card ka title niche wale page se linked ho sakta hai (`/about`, `/facilities`, `/gallery`)
- **Footer legal:** Privacy Policy (`/privacy-policy`), Terms (`/terms`); Privacy/Terms pages khud `/contact` se linked hain
- **Orphan check:** koi bhi page orphan nahi hai — `/cbse` ab 3 jagah se linked hai (Footer, Classes, Admissions), `/news`, `/gallery`, `/facilities` har ek 2+ jagah se linked hai

### robots.txt
`public/robots.txt` mein:

```txt
User-agent: *
Allow: /

# Block private and backend routes from crawling and indexing
Disallow: /admin
Disallow: /api
Disallow: /dashboard

Sitemap: https://www.sbgpundri.com/sitemap.xml
```

Sab crawlers ko full access diya gaya hai. `/api` (backend API server `app.use("/api", router)`), `/admin` aur `/dashboard` ko disallow kiya gaya hai. Sitemap line abhi placeholder hai (sitemap.xml live hone par hi kaam karegi). Hubli `public/robots.txt` — Vite build `dist/public` mein copy karta hai, deploypar `/robots.txt` pe serve hota hai.

### Other On-Page SEO Richness (already done)
- **Open Graph / Facebook** tags (`og:type`, `og:url`, `og:site_name`, `og:title`, `og:description`, `og:image` 1200x630, `og:locale = en_IN`)
- **Twitter Card** tags (`summary_large_image`, title, description, image)
- **GeoTargeting:** `geo.region` (IN-HR), `geo.placename`, `geo.position` (29.7563;76.5492), `ICBM`
- **Meta robots:** `index, follow`
- **Mobile/UX:** viewport meta, `theme-color #0A2540`, `format-detection telephone=yes`
- **Performance:** font preconnect, hero image `eager` + high priority, baaki images `lazy`, webp optimized images, React manual chunks.
- **Favicon:** `/favicon.svg`

---

## 3. Pending / To-Do Items

- [ ] **`sitemap.xml` banai jaani hai** — abhi project mein kahin bhi exists nahi karti. Saare URLs ko include karna: `/`, `/about`, `/academics`, `/facilities`, `/gallery`, `/admissions`, `/news`, `/cbse`, `/contact`, `/privacy-policy`, `/terms`.
- [ ] **Google Search Console** mein domain verify + sitemap submit karna.
- [ ] **Google Analytics / GA4** set up karna — abhi code mein koi tracking (gtag/analytics) nahi hai.
- [ ] **`json-ld sameAs` (social profiles)** add karna — Footer ke social icons abhi `/contact` par point karte hain (placeholder). Real Facebook/Instagram/YouTube URLs milein to `School` node mein `sameAs` array add karna.
- [ ] (Improvement) Per-page unique `<title>` + meta description add karna (SPA ko SSR/prerender ya dynamic head update ki zaroorat hai).
- [ ] (Improvement) Inner pages par dedicaated `h1` add karna (currently h2 se start hoti hain).

---

## 4. Important Notes

### Website Deploy Hone Ke Baad Ka Checklist

1. **Canonical URL confirmation** — domain live hone par `https://www.sbgpundri.com/` par redirect verify karna (www vs non-www).
2. **robots.txt test** — Google Search Console ke robots.txt tester se verify karna.
3. **sitemap.xml upload** — `public/sitemap.xml` banakar deploy karna, phir robots.txt mein sitemap URL add karna.
4. **Google Search Console:**
   - Domain property add karke verify karna (DNS ya HTML tag method)
   - Sitemap submit karna
   - Crawl errors / Index coverage check karna
5. **Google Analytics (GA4):** Property create karke tracking code `index.html` mein daalna (website vary set karne ke baad hi data aayega — dev/preview URLs ko filter karna).
6. **Structured Data Testing:** GSC "Rich Results" test se `School` aur `FAQPage` schema check karna.
7. **`og:image` (1200x630) aur Twitter image upload confirm karna** — `https://www.sbgpundri.com/og-image.jpg` currently reference kiya gaya hai, parr deployed asset hona chahiye.
8. **H1 per page re-check** karna baad mein bot crawl ke liye.
9. **Monitoring:** baad mein rankings/keywords track karna; 404 page aur internal links ka periodic check.

---

*Last verified: code scan based on `artifacts/school-website/`.*