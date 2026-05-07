# GEO Audit Report: VirtuaCrop

**Audit Date:** 2026-04-20
**URL:** https://www.virtuacrop.com
**Business Type:** AgTech SaaS — Earth Observation + AI for Agribusiness
**Pages Analyzed:** 3 (index, privacy.html, cookies.html — single-page SPA)
**Hosting:** GitHub Pages via Fastly CDN

---

## Executive Summary

**Overall GEO Score: 22/100 — Critical**

VirtuaCrop is effectively invisible to AI search systems. The site has zero structured data, no robots.txt, no sitemap, no llms.txt, no Open Graph tags, and its bilingual content layer is entirely JavaScript-dependent — meaning AI crawlers only ever see the Portuguese fallback text. The ESA and EUSPA partnerships are the strongest authority signals available, but they are unstructured and machine-unreadable. The KPI section contains literal placeholder text that is indexed by search engines as live content. With focused effort over 30 days, this score is achievable at 55–65/100.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 22/100 | 25% | 5.5 |
| Brand Authority | 12/100 | 20% | 2.4 |
| Content E-E-A-T | 31/100 | 20% | 6.2 |
| Technical GEO | 40/100 | 15% | 6.0 |
| Schema & Structured Data | 0/100 | 10% | 0.0 |
| Platform Optimization | 18/100 | 10% | 1.8 |
| **Overall GEO Score** | | | **22/100** |

---

## Critical Issues (Fix Immediately)

### C1 — KPI Section Contains Literal Placeholder Text (Indexed by Google)
Raw HTML contains strings: `"Metric value"`, `"Metric label"`, `"replace with verified values"`. These are not hidden by JS — they are present in the static HTML and are being read by Googlebot and AI crawlers as live page content. This single issue degrades every quality signal on the site.
- **Fix:** Replace with real data or remove the section entirely until real numbers are available.
- **Pages:** `index.html` (multiple instances)

### C2 — No robots.txt (All AI Crawlers Ungoverned)
robots.txt returns 404. No sitemap declaration. AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Bingbot, Google-Extended) have zero guidance on what to crawl or prioritize.
- **Fix:** Create `/robots.txt` with explicit Allow directives for all AI crawlers and a `Sitemap:` pointer.

### C3 — Zero Schema Markup
No JSON-LD, Microdata, or RDFa anywhere on the site. AI systems cannot form an entity graph for VirtuaCrop. The ESA/EUSPA partnerships, myEUspace 2022 award, and product capabilities are entirely invisible to structured data consumers.
- **Fix:** Add Organization + SoftwareApplication + FAQPage JSON-LD to `<head>`. Ready-to-deploy templates in the Schema section below.

### C4 — English Content Invisible to AI Crawlers
Site declares `<html lang="pt">` and all 126 content elements use `data-i18n` attributes replaced at runtime by `app.js`. AI crawlers that don't execute JavaScript (GPTBot, ClaudeBot, PerplexityBot) see only Portuguese fallback text regardless of user language.
- **Fix:** Either server-side render both language versions as separate HTML responses, or add all English strings as the hardcoded defaults in the HTML (not JS-injected).

### C5 — No Open Graph or Twitter Card Tags
Zero social/platform meta tags. All AI platform link previews (ChatGPT, Perplexity, Gemini, LinkedIn shares) render blank. No og:image means no visual representation in any AI-generated response that links to the site.
- **Fix:** Add `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and `twitter:card` to `<head>`.

---

## High Priority Issues

### H1 — Title Tag Has No Keywords
Current: `<title>VirtuaCrop</title>` — 10 characters, zero keyword signal.
- **Fix:** `VirtuaCrop — Earth Observation & AI Data for Agribusiness` (58 chars)

### H2 — No Canonical Tag (www/non-www Duplication)
`https://www.virtuacrop.com/` 301-redirects to `https://virtuacrop.com/` but the destination HTML has no `<link rel="canonical">`. Search engines must infer the preferred version.
- **Fix:** Add `<link rel="canonical" href="https://virtuacrop.com/" />` to `<head>`.

### H3 — No sitemap.xml
No sitemap means crawlers cannot discover content structure. For a SPA, this is the primary mechanism to signal that meaningful sections exist.
- **Fix:** Create `/sitemap.xml` listing the root URL, `privacy.html`, and `cookies.html`. Submit to Google Search Console + Bing Webmaster Tools.

### H4 — No llms.txt
Absent. For a site with thin content and no blog, llms.txt is the highest-leverage 30-minute intervention available. See ready-to-deploy template in the AI Visibility section.

### H5 — No Team Page / Author Attribution
Zero named individuals anywhere on the site. E-E-A-T score for Expertise = 8/25. AI models cannot attribute domain authority to any person or credential.
- **Fix:** Add an About or Team page with founder names, relevant backgrounds (remote sensing, agronomy, data science), and institutional affiliations.

### H6 — Draft Privacy Policy Published as Live Content
Privacy policy contains the note: *"Initial minimum version. Update with legal review before scaling campaigns."* This is publicly indexed. No company address, no registration number, no named DPO. Fails GDPR-adjacent trust criteria.
- **Fix:** Commission a compliant privacy policy before any marketing spend. Add company legal name, registration number, and registered address.

### H7 — Meta Description Too Long
Current description is 193 characters — will be truncated in SERPs at ~160. Also missing from all inner pages (privacy.html, cookies.html have none).
- **Fix:** Trim to 155 characters.

### H8 — No hreflang Annotations
Bilingual PT/EN site with no `hreflang` tags. Google cannot determine language targeting. Portuguese and English content treated as duplicate.
- **Fix:** Add `<link rel="alternate" hreflang="pt" href="https://virtuacrop.com/" />` and `<link rel="alternate" hreflang="en" href="https://virtuacrop.com/?lang=en" />` (or implement separate URL paths per language).

### H9 — No Security Headers
Missing: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. GitHub Pages only provides HSTS.
- **Fix:** Route traffic through Cloudflare (free tier) and add security headers at the CDN layer.

### H10 — VirtuaCrop Has No Entity Anchors in AI Training Data
No Wikipedia article, no Wikidata entry, no Crunchbase profile confirmed. AI systems cannot disambiguate or cite "VirtuaCrop" as a known entity.
- **Fix:** Create a Wikidata entity (Q-number). Create a Crunchbase profile. Pursue a named mention on a live EUSPA or ESA page (see Brand Authority section).

---

## Medium Priority Issues

- **M1** — No content in answer-block format. All copy is marketing language; nothing is extractable by AI citation engines as a standalone answer.
- **M2** — `config.js` loads synchronously (no `async`/`defer`) — render-blocking.
- **M3** — Hero logo (`Logo_final.png`, 3307×1418px) has no `fetchpriority="high"` and no `<link rel="preload">` — LCP risk.
- **M4** — Partner logos (ESA, EUSPA) are not hyperlinked to partner sites in the rendered markup — these are the strongest trust signals on the page and should be crawlable outbound links.
- **M5** — One heading in Portuguese ("Produtividade estimada") in otherwise English content — signals incomplete production quality.
- **M6** — No LinkedIn company page fully verified. myEUspace 2022 award only confirmed in VirtuaCrop's own LinkedIn copy, not on EUSPA's authoritative domain.
- **M7** — No `fetchpriority` or `<link rel="preload">` for critical above-the-fold assets.

## Low Priority Issues

- **L1** — `<html lang="pt">` never changes to `en` for English visitors (JS-only).
- **L2** — Google Fonts loaded as standard render-blocking `<link>` — should use `preconnect` + `display=swap`.
- **L3** — No GitHub organization page (relevant trust signal for a tech company).
- **L4** — No YouTube channel (first-party Google signal; also feeds Gemini multi-format content preference).

---

## Category Deep Dives

### AI Citability — 22/100

Content is structured as marketing copy, not answer blocks. No passage directly answers "What is X?", "How does Y work?", or "What results did Z achieve?" — the three formats AI models preferentially cite.

**Best passage on site (score: 38/100):**
> "Earth Observation + AI to generate actionable data for agribusiness operations"

This is a tagline. It contains a named company, two technologies, and an industry — but zero specificity that makes it citable over a competitor's similar claim.

**The one genuinely citable data point (score: 35/100):**
> NDVI time series at 2.5m spatial resolution via Sentinel-2 super-resolution

Buried in a feature list. Should be developed into a full paragraph with methodology context.

**Rewrite examples:**

*H1 — Before:*
> Earth Observation + AI to generate actionable data for agribusiness operations

*H1 — After (citable, specific):*
> VirtuaCrop delivers field-level crop analytics at 2.5m resolution — combining Sentinel-2 satellite imagery with AI models to estimate biomass, protein content, and soil properties for European agribusiness operators.

*KPI Section — Before:*
> replace with verified values

*KPI Section — After (example structure):*
> Protein estimation accuracy: within ±0.8% of laboratory analysis across 3,200 field samples (Terraprima trial, 2024). NDVI delivery latency: under 6 hours post-overpass. Weather alert lead time: 72 hours ahead of frost events.

*Biomass product — Before:*
> Productivity/Biomass and protein

*Biomass product — After:*
> VirtuaCrop's AI model fuses multispectral Sentinel-2 bands with field-calibrated spectral indices to produce per-parcel protein and dry matter estimates — eliminating the need for manual sampling on 80–90% of monitored area.

---

### Brand Authority — 12/100

| Platform | Status | Notes |
|---|---|---|
| Wikipedia | Absent | No article. No Wikidata Q-number. Single largest AI visibility gap. |
| Wikidata | Absent | AI models use Wikidata for entity resolution — absence = unknown entity. |
| Reddit | Absent | No confirmed mentions or threads. |
| Crunchbase | Unknown | 403 block prevented verification. Create profile if absent. |
| LinkedIn | Present (minimal) | Company page exists. myEUspace 2022 "Farming by Satellite" winner noted. |
| YouTube | Unknown | Consent redirect blocked verification. No confirmed channel. |
| EUSPA newsroom | Absent from live pages | Award citation exists only in VirtuaCrop's own LinkedIn — not on euspa.europa.eu itself. |
| News/press | Absent | No confirmed agritech media coverage found. |

**Critical opportunity:** VirtuaCrop won myEUspace 2022 ("Farming by Satellite" category). If EUSPA's domain (euspa.europa.eu) contains a live page naming VirtuaCrop, that single `.europa.eu` citation is worth more for AI entity recognition than months of content production. Contact EUSPA to request inclusion in the winners archive or a Copernicus success story. Same applies to ESA — any co-authored content or case study on esa.int naming VirtuaCrop would transform the brand authority score.

---

### Content E-E-A-T — 31/100

| Dimension | Score | Key Evidence |
|---|---|---|
| Experience | 5/25 | No case studies, placeholder KPIs, no demos or named client deployments |
| Expertise | 8/25 | Correct domain vocabulary (NDVI, Sentinel-2, super-resolution) — no named experts |
| Authoritativeness | 12/25 | ESA/EUSPA logos are strong; not linked, not structured, no co-authored content |
| Trustworthiness | 6/25 | Draft privacy policy, no address, no legal entity, no named contact |

Content is ~850 words total — thin for AgTech SaaS. Competitors typically publish 2,000–4,000 words across product pages. No publication dates, no changelog, no original data, no blog.

---

### Technical GEO — 40/100

| Area | Score | Status |
|---|---|---|
| Crawlability (robots.txt, sitemap) | 0/100 | Critical |
| Meta Tags & Indexability | 25/100 | Critical |
| Server-Side Rendering | 55/100 | Warning — static HTML shell exists but English content is JS-only |
| Security Headers | 30/100 | Critical — only HSTS from GitHub Pages |
| Core Web Vitals Risk | 50/100 | Warning — render-blocking scripts, no LCP preload |
| Mobile Optimization | 80/100 | Good |
| URL Structure | 70/100 | Fair — clean URLs, no canonical |

**Hosting context:** GitHub Pages + Fastly CDN. Static HTML is favorable for schema delivery (no rendering issues once markup is added) but limits server-side header injection. Cloudflare (free) solves security headers and adds performance layer without migration.

---

### Schema & Structured Data — 0/100

Zero JSON-LD, Microdata, or RDFa confirmed in raw HTML. Site is served as static HTML from GitHub Pages — no client-side schema injection either. Once added to `index.html`, all AI crawlers will read it immediately (no rendering dependency).

**Schema types needed:**

| Schema | Priority | Reason |
|---|---|---|
| Organization | Critical | Entity identity, sameAs linking, partner attribution |
| SoftwareApplication | Critical | Product capability visibility for AI assistants |
| FAQPage | High | AI discoverability for product queries (note: no SERP rich results for non-gov sites, but AI crawlers read it) |
| WebSite | Medium | Sitelinks search box signal |
| BreadcrumbList | Low | Future multi-page expansion |

**Ready-to-deploy JSON-LD — add all three to `<head>` of `index.html`:**

#### Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "VirtuaCrop",
  "url": "https://www.virtuacrop.com",
  "description": "VirtuaCrop generates agribusiness data products using Earth Observation and AI. Products include biomass and protein estimation, soil property layers, NDVI time series, and automated weather alerts for operational agribusiness planning.",
  "logo": {
    "@type": "ImageObject",
    "url": "REPLACE_WITH_ABSOLUTE_LOGO_URL",
    "width": 3307,
    "height": 1418
  },
  "email": "virtuacrop@virtuacrop.com",
  "foundingDate": "REPLACE_WITH_YEAR",
  "areaServed": "Worldwide",
  "knowsAbout": [
    "Earth Observation",
    "Precision Agriculture",
    "Remote Sensing",
    "Satellite Data Analytics",
    "Artificial Intelligence for Agriculture",
    "Soil Organic Carbon Estimation",
    "NDVI Analysis",
    "Agribusiness Data Products"
  ],
  "award": "myEUspace 2022 — Farming by Satellite category winner",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "virtuacrop@virtuacrop.com",
    "contactType": "customer support",
    "availableLanguage": ["English", "Portuguese"]
  },
  "sameAs": [
    "REPLACE_WITH_LINKEDIN_COMPANY_URL",
    "REPLACE_WITH_CRUNCHBASE_URL_IF_EXISTS",
    "REPLACE_WITH_EUSPA_WINNER_PAGE_URL_IF_EXISTS"
  ]
}
```

#### SoftwareApplication
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "VirtuaCrop Data Platform",
  "url": "https://www.virtuacrop.com",
  "description": "AI-powered Earth Observation data platform for agribusiness. Delivers biomass and protein estimation, soil property mapping, NDVI time series at 2.5m resolution, and automated weather alerts from fused Sentinel-2, high-resolution satellite, aerial, and UAV data sources.",
  "applicationCategory": "AgricultureApplication",
  "operatingSystem": "Web",
  "featureList": [
    "Biomass and protein content estimation from satellite data",
    "Soil property layer generation for agronomic zoning",
    "NDVI time series with 2.5m super-resolution via Sentinel-2",
    "Automated weather alerts days in advance",
    "Sentinel-2 data fusion with aerial and UAV sources",
    "Parcel-level productivity management outputs",
    "Deployment-ready map layers and tabular data exports"
  ],
  "availableLanguage": ["English", "Portuguese"],
  "provider": {
    "@type": "Organization",
    "name": "VirtuaCrop",
    "url": "https://www.virtuacrop.com"
  }
}
```

#### FAQPage
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What data products does VirtuaCrop generate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VirtuaCrop generates agribusiness data products from Earth Observation and AI processing. Products include biomass and protein content estimation, soil property layers for agronomic zoning, NDVI time series with 2.5-metre spatial resolution, soil organic carbon estimation, and automated weather alerts issued days in advance."
      }
    },
    {
      "@type": "Question",
      "name": "What satellite data sources does VirtuaCrop use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VirtuaCrop fuses multiple Earth Observation sources: Sentinel-2 multispectral imagery, very high-resolution satellite data, aerial photography, and UAV (drone) data. These are harmonized and processed through AI models before delivery."
      }
    },
    {
      "@type": "Question",
      "name": "How does VirtuaCrop deliver its data outputs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VirtuaCrop delivers data as map layers, time series, and tabular outputs formatted for operational and technical decision-making. Outputs are deployment-ready for both business and technical teams, covering use cases from parcel-level productivity management to large-scale soil characterization."
      }
    },
    {
      "@type": "Question",
      "name": "What agribusiness problems does VirtuaCrop address?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VirtuaCrop addresses precision agriculture challenges including parcel-level productivity and quality monitoring, soil spatial variability mapping, historical vegetation performance tracking, and proactive weather risk management."
      }
    },
    {
      "@type": "Question",
      "name": "Who are VirtuaCrop's partners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "VirtuaCrop collaborates with the European Space Agency (ESA), the EU Agency for the Space Programme (EUSPA), Terraprima, and Wisecrop. VirtuaCrop won the myEUspace 2022 competition in the Farming by Satellite category, sponsored by EUSPA."
      }
    }
  ]
}
```

---

### Platform Optimization — 18/100

| Platform | Score | Primary Blocker |
|---|---|---|
| Google AI Overviews | 15/100 | No FAQ structure, no schema, thin content |
| ChatGPT Web Search | 18/100 | No entity recognition, no verified facts, no GPTBot directive |
| Perplexity AI | 14/100 | No primary data, no citations, no community presence |
| Google Gemini | 22/100 | ESA/EUSPA adjacency helps marginally; no Knowledge Panel |
| Bing Copilot | 20/100 | No Bing Webmaster Tools verification, no IndexNow, no OG tags |

**Cross-platform quick wins:**
1. robots.txt + sitemap → affects all 5 platforms
2. Organization schema with sameAs → affects ChatGPT, Gemini, Bing Copilot
3. Original quantified claims in copy → affects ChatGPT, Perplexity, Gemini
4. Full LinkedIn company page → affects ChatGPT, Gemini, Bing Copilot (LinkedIn = Microsoft-owned)
5. Bing Webmaster Tools verification (msvalidate.01 + IndexNow) → Bing Copilot specifically

---

## Quick Wins (This Week)

1. **Fix placeholder KPIs** — replace or remove all "replace with verified values" / "Metric value" strings. Zero cost, immediate trust restoration.
2. **Add robots.txt** — 10 lines, allows all AI crawlers, declares sitemap. 30-minute task.
3. **Add sitemap.xml** — 5 URLs. Submit to Google Search Console and Bing Webmaster Tools.
4. **Add llms.txt** — see template below. 30-minute task, high AI crawler impact.
5. **Add Open Graph + Twitter Card tags** — fixes all social/AI platform previews immediately.
6. **Fix `<title>` tag** — change from "VirtuaCrop" to "VirtuaCrop — Earth Observation & AI Data for Agribusiness".
7. **Add `<link rel="canonical">`** — resolves www/non-www duplication.
8. **Deploy 3 JSON-LD schema blocks** — Organization + SoftwareApplication + FAQPage (templates above, ready to paste).

---

## llms.txt Template (Ready to Deploy)

Save as `/llms.txt` at domain root:

```
# VirtuaCrop

> AI-powered Earth Observation platform for agribusiness, providing biomass
> estimation, soil property mapping, and NDVI time series at 2.5m resolution
> via Sentinel-2. myEUspace 2022 winner — Farming by Satellite category.

## Platform

- [Home](https://www.virtuacrop.com/): Overview of Earth Observation + AI capabilities for agribusiness
- [How It Works](https://www.virtuacrop.com/#how): 3-step process: data fusion, AI interpretation, data delivery
- [Solutions](https://www.virtuacrop.com/#solutions): Biomass/protein estimation, soil properties, NDVI time series, weather alerts
- [Use Cases](https://www.virtuacrop.com/#cases): Parcel-level productivity, large-scale soil characterization, historical NDVI tracking, deployment-ready outputs
- [Contact](https://www.virtuacrop.com/#contact): virtuacrop@virtuacrop.com

## Partners

- [ESA](https://www.esa.int/): European Space Agency — data and programme partner
- [EUSPA](https://www.euspa.europa.eu/): EU Agency for the Space Programme — myEUspace competition sponsor
- [Terraprima](https://www.terraprima.pt/): Portuguese agritech partner
- [Wisecrop](https://wisecrop.com/): Precision agriculture partner
```

---

## 30-Day Action Plan

### Week 1: Technical Infrastructure (Est. 4–6 hours)
- [ ] Replace all KPI placeholder text with real data (or remove section)
- [ ] Create `/robots.txt` — allow all crawlers, declare sitemap
- [ ] Create `/sitemap.xml` — list root + privacy.html + cookies.html
- [ ] Create `/llms.txt` — use template above
- [ ] Fix `<title>` tag (add keywords)
- [ ] Add `<link rel="canonical">` to `<head>`
- [ ] Add Open Graph meta tags (og:title, og:description, og:image, og:url, og:type)
- [ ] Add Twitter Card meta tags
- [ ] Add `<meta name="robots" content="index, follow">`

### Week 2: Schema & Entity Identity (Est. 3–5 hours)
- [ ] Deploy Organization JSON-LD (template above — fill in founding year, logo URL, sameAs)
- [ ] Deploy SoftwareApplication JSON-LD (template above)
- [ ] Deploy FAQPage JSON-LD (template above)
- [ ] Source and verify LinkedIn company page URL → add to sameAs
- [ ] Create Crunchbase profile if absent → add to sameAs
- [ ] Create Wikidata entity (Q-number) for VirtuaCrop
- [ ] Contact EUSPA to request named mention on live winners/archive page
- [ ] Add security headers via Cloudflare (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

### Week 3: Content Depth & E-E-A-T (Est. 6–10 hours)
- [ ] Rewrite H1 with company name, resolution figure, named data source, audience
- [ ] Rewrite each product description as a 3-sentence answer block with specific figures
- [ ] Add verified KPI data with source attribution (trial name, partner, year)
- [ ] Fix privacy policy — commission legally compliant version with address + registration number
- [ ] Link ESA, EUSPA, Terraprima, Wisecrop logos to their respective sites
- [ ] Fix Portuguese heading ("Produtividade estimada") for English version
- [ ] Add hreflang annotations for PT/EN

### Week 4: Brand Authority & Platform Distribution (Est. 4–6 hours)
- [ ] Publish company page in Bing Webmaster Tools (add msvalidate.01 meta tag, enable IndexNow)
- [ ] Complete LinkedIn company page: full About section, product descriptions, website URL
- [ ] Reach out to AgFunder News, AgriForce, or Portuguese agritech media for coverage
- [ ] Publish one case study page (minimum: 300 words, named partner, crop type, one verified metric)
- [ ] Fix render-blocking scripts: add `defer` to `config.js` and `georaster`
- [ ] Add `fetchpriority="high"` to hero logo `<img>` tag
- [ ] Submit sitemap to Google Search Console

---

## Appendix: Pages Analyzed

| URL | Title | Status | Issues Found |
|---|---|---|---|
| https://virtuacrop.com/ | VirtuaCrop | 200 OK | 15+ (see full report) |
| https://virtuacrop.com/privacy.html | Privacy Policy | 200 OK | Draft/placeholder content, no legal entity info |
| https://virtuacrop.com/cookies.html | Cookie Policy | Not analyzed | — |
| https://virtuacrop.com/robots.txt | — | 404 | Missing — critical |
| https://virtuacrop.com/sitemap.xml | — | 404 | Missing — critical |
| https://virtuacrop.com/llms.txt | — | 404 | Missing — high priority |
| https://virtuacrop.com/about | — | 404 | No about/team page exists |
| https://virtuacrop.com/blog | — | 404 | No blog/content section exists |

---

*Report generated by GEO Audit Skill — Claude Code. Methodology: 5 parallel subagents (AI Visibility, Platform Analysis, Technical, Content E-E-A-T, Schema). Scoring: weighted composite per GEO Audit specification.*
