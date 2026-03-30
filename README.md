# Artjom Becker - Portfolio

Modern portfolio website built with React + Vite.

## Highlights

- Apple-inspired, clean UI with light/dark mode
- DE/EN language toggle
- Custom cursor interactions
- Project cards with modal details and case-study content
- Tech stack section with animated progress bars
- Dedicated CV view with PDF export
- Contact section with GitHub, LinkedIn, WhatsApp, Telegram
- Character-style chatbot with OpenRouter support + local fallback
- Mobile-friendly navigation and responsive layout

## Tech Stack

- React
- Vite
- Framer Motion
- jsPDF
- CSS (custom properties + responsive layout)

## Project Structure

- `src/App.jsx` - Main page sections, navigation, projects, filters, timeline, contact
- `src/App.css` - Component and section styling
- `src/index.css` - Global theme variables and base styles
- `src/Chatbot.jsx` - Chatbot UI + OpenRouter integration
- `src/CVSection.jsx` - CV page + PDF download
- `src/Terminal.jsx` - Animated terminal component
- `src/useCursor.js` - Cursor tracking and hover behavior
- `wrangler.jsonc` - Cloudflare Workers assets configuration

## Local Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview built app
npm run lint       # run eslint
npm run deploy:cf  # build + deploy to Cloudflare via Wrangler
```

## Chatbot Environment Variable

Create a `.env` file in the project root:

```bash
VITE_OPENROUTER_API_KEY=your_api_key_here
```

If no key is provided, the chatbot uses a local fallback response mode.

## Deployment (Cloudflare)

This project is configured for static asset deployment via Wrangler:

- Build output: `dist`
- Config file: `wrangler.jsonc`
- SPA fallback enabled (`not_found_handling: single-page-application`)

Deploy:

```bash
npm run deploy:cf
```

## Contact

- Email: `hi@artjombecker.com`
