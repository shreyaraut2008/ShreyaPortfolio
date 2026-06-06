# Shreya Raut — Cinematic Portfolio Hero

A premium, award-quality cinematic hero section for a developer portfolio.

## Stack
- **Next.js 14** App Router
- **Three.js** — bokeh particle layer with mouse parallax
- **GSAP** — cinematic entrance animations + scroll parallax
- **CSS Modules** — scoped premium styling
- **Cormorant Garamond** + **JetBrains Mono** fonts

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Place your video
# Copy your talking-head video to:
public/hero-video.mp4
# (The file hero-video.mp4 is already included in this project)

# 3. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## File Structure

```
/
├── app/
│   ├── layout.jsx          # Root layout + Google Fonts
│   ├── page.jsx            # Home page
│   └── globals.css         # Global reset + base styles
├── components/
│   ├── VideoIntro.jsx      # Main hero section
│   └── CinematicLayer.jsx  # Three.js bokeh particles
├── styles/
│   ├── VideoIntro.module.css
│   └── CinematicLayer.module.css
├── public/
│   └── hero-video.mp4      # Your talking-head video
└── package.json
```

## Customisation

### Name & Text
Edit `components/VideoIntro.jsx`:
```jsx
// Tagline
<p>Creative Developer · Digital Craftsperson</p>

// Name
<h1>Shreya</h1>
<h1>Raut</h1>

// Role
<p>Website Developer — Turning ideas into immersive digital experiences</p>
```

### Particle count & colours
Edit `components/CinematicLayer.jsx`:
- `count` — number of bokeh particles (default: 280)
- `warmColors` array — RGBA tuples for particle tints

### Typography sizes
Edit `styles/VideoIntro.module.css`:
- `.nameFirst, .nameLast` — `clamp(5.5rem, 13vw, 13rem)`

## Production Build

```bash
npm run build
npm start
```
