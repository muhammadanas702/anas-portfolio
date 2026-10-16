# Muhammad Anas - Portfolio

Static portfolio site (HTML / CSS / vanilla JS).

## Files
- `index.html`, `style.css`, `script.js` - public site
- `data.js` - default content for the admin panel (mirrors `index.html`)
- `admin.html`, `admin.js`, `admin.css` - local content editor
- `assets/` - profile image and resume PDF

## Admin panel - important limitations
The site is static (no backend), so the admin panel stores edits in **this browser's localStorage only**.
Visitors on other devices never see them, and the password is only a client-side convenience lock
(anyone can read `admin.js`). Do **not** treat it as real security.

- First visit asks you to create a password (min 8 chars, stored as a salted PBKDF2 hash).
- To make edits public, change `index.html` / `data.js` and commit, or add a real backend / auth.
- Best practice: don't deploy `admin.html` publicly (remove it, or protect it with Cloudflare Access / Netlify password).

## Contact form
Opens the visitor's email app (`mailto:`). For real form delivery use Formspree / Netlify Forms / EmailJS.

## TODO
- Add `assets/images/og-image.jpg` and re-add `og:image` / `og:url` once the final domain is known.
