# A.P Herbal Care – Static Website

**Client:** A.P Herbal Care, Moshi, Tanzania  
**Tagline:** Afya Asilia, Maisha Bora  
**Contact:** 0620 354 744 | augustinojacob4@gmail.com

---

## Project Structure

```
ap-herbal-care/
├── index.html      # Home / landing page (hero + teasers)
├── about.html      # Kuhusu + Kwa Nini Sisi
├── services.html   # Huduma Zetu (all 6 services)
├── products.html   # Bidhaa Zetu (placeholder + gallery for future products)
├── contact.html    # Wasiliana Nasi
├── style.css       # All styles (CSS variables, responsive)
├── main.js         # Nav scroll, mobile menu, animations, page highlighting
├── netlify.toml    # Netlify deploy config
├── images/         # Logo + product/clinic photos
└── README.md       # This file
```

## How to Deploy on Netlify

### Option 1: Drag & Drop (easiest for beginners)
1. Go to [netlify.com](https://netlify.com) and log in
2. Go to **Sites → Add new site → Deploy manually**
3. Drag the entire `ap-herbal-care/` folder into the box
4. Done! You get a live URL instantly

### Option 2: Via GitHub (recommended for version control)
1. Create a new repo on GitHub: `ap-herbal-care`
2. Push the code:
   ```bash
   cd ap-herbal-care
   git init
   git add .
   git commit -m "Initial commit: A.P Herbal Care website"
   git remote add origin https://github.com/YOUR_USERNAME/ap-herbal-care.git
   git push -u origin main
   ```
3. Go to Netlify → **Add new site → Import from Git**
4. Connect GitHub → Select the repo
5. Build settings: leave blank (static site, no build command)
6. Click **Deploy site**

### Custom Domain (optional)
- In Netlify: Site settings → Domain management → Add custom domain

---

## What Was Built

- Multi-page site: Home, Kuhusu (About), Huduma (Services), Bidhaa (Products), Wasiliana (Contact)
- Consistent responsive navbar + hamburger across all pages
- Hero on home + clean inner page headers
- Full About + Why Us sections on dedicated page
- All 6 service cards on services page
- Products page with "Inatayarishwa" placeholders + image gallery (ready for real products)
- Contact page with 4 info cards + CTA
- Footer links updated for multi-page
- Scroll-triggered fade-in animations
- Active nav link highlighting (current page)
- Fully mobile responsive (breakpoints: 900px, 600px)

---

## Notes

- The site was split from a single page into multiple pages so that **product listings** (Bidhaa) can be developed independently as real products become available.
- Use relative links like `about.html`, `products.html` etc.
- Netlify serves each `.html` file directly. No catch-all SPA redirect.

*Built during MWECAU ICT Club Week 2026 — Technology Beyond the Classroom*
