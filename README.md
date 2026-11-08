# NeverShips

A parody tech store where nothing ever arrives. Static HTML/CSS/JS — no build step, no backend.

## Run locally
    python3 -m http.server 8000   # then open http://localhost:8000

## Host it (needs your own domain for AdSense)
Any static host works: Netlify, Cloudflare Pages, GitHub Pages, Vercel. Upload this folder as-is.

## Turn on real ads (Google AdSense)
1. Buy a domain and host the site on it (AdSense won't approve subdomains of free hosts).
2. Apply at https://adsense.google.com and add your site. Google gives you a publisher ID like `ca-pub-1234567890123456`.
3. Paste that ID into `config.js` -> `adsenseClient`.
4. Edit `ads.txt`: replace `pub-0000000000000000` with your ID (no `ca-` prefix).
5. After approval, create Display ad units in AdSense and paste each unit's `data-ad-slot` number into `config.js` -> `slots`.
   Leave a slot blank to let Google Auto ads decide placement instead.
6. In AdSense > Privacy & messaging, enable the Google-certified consent message for EEA/UK/Swiss visitors.
7. Replace hello@example.com in privacy.html and terms.html with your real contact email.

Ad placements: top banner, after lightning deals, inside the catalog grid, inside the package tracker, and above the footer.

## Customize
- Products, drivers, and tracking messages: `data.js`
- Deal rotation (75s) and tracking length (42s): top of `app.js`
- Colors and fonts: `:root` in `styles.css`
