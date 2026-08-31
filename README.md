# Al Meknassi Jewelry — Luxury Single Product

Modern luxury jewelry e-commerce — React + Vite + Tailwind, single focused product, WhatsApp checkout, MAD, marble fluid background, FR/EN/AR.

## Live
- Repo: https://github.com/KenComp0/Almeknassi-Jewelry
- Netlify: auto-deploy from `main`

## Tech
React 19, React Router 7, Framer Motion, Tailwind 3.4, Vite 8

## Env
Create `.env` from `.env.example`:
```
VITE_WHATSAPP_NUMBER=212664677347
```
Set same variable in Netlify: Site settings → Environment variables

## Commands
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview
```

## Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `netlify.toml` + `public/_redirects` → `/* /index.html 200`
- Node 20

## Structure
```
src/
  components/ Navbar, Footer, ProductCard, HeroSlider, WhatsAppButton, MarbleBackground
  pages/ Home (single focused), Product, Cart
  data/ products.js (1 mock MAD)
  i18n/ translations + LanguageContext (fr/en/ar)
public/
  logo.svg (gold transparent)
  _redirects
```

## Deploy to Netlify (Free)
1. Push to GitHub `main`
2. Netlify → Add new site → Import from GitHub → KenComp0/Almeknassi-Jewelry
3. Build `npm run build`, Publish `dist`
4. Add env `VITE_WHATSAPP_NUMBER`
5. Deploy
