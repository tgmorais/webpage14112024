# VirtuaCrop Landing v1

Static bilingual landing page (PT/EN) focused on Earth Observation + AI data products.

## Included

- Landing page: `index.html`
- Legal pages: `privacy.html`, `cookies.html`
- Shared style and logic: `styles.css`, `app.js`
- Cookie consent with categories (Essential + Analytics)
- Formspree contact form with UTM/referrer/page context capture
- GA4 loaded only after analytics consent

## Required configuration

Edit [`config.js`](/Users/tiagomorais/Documents/VC_website/config.js) and set:

- `VC_CONFIG.FORMSPREE_ENDPOINT`
- `VC_CONFIG.GA4_MEASUREMENT_ID`

Current placeholders:

- `https://formspree.io/f/your-form-id`
- `G-XXXXXXXXXX`

## Configure Formspree

1. Create a form at [Formspree](https://formspree.io/) and copy your endpoint (example: `https://formspree.io/f/xabc1234`).
2. Open [`config.js`](/Users/tiagomorais/Documents/VC_website/config.js).
3. Replace `FORMSPREE_ENDPOINT` with your real endpoint.
4. Save and test locally by submitting the contact form.

## Local preview

From `/Users/tiagomorais/Documents/VC_website`:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages deploy

1. Push these files to your GitHub repository.
2. In repository settings, enable GitHub Pages from the branch root.
3. Keep your custom domain (`virtuacrop.com`) mapped as it is today.

## Firebase Hosting (optional migration path)

A `firebase.json` file is included to allow future migration with minimal changes.

Typical commands when you decide to migrate:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

Use the Firebase free tier carefully. High traffic or additional services may generate cost.
