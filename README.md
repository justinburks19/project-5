# Project 5 — Next.js + TypeScript + Tailwind

This repository is a minimal scaffold for Next.js (app router) with TypeScript and Tailwind CSS.

Quick start (PowerShell on Windows):

```powershell
# 1) Install dependencies
npm install

# 2) Start dev server
npm run dev

# 3) Build for production
npm run build; npm start
```

Notes:
- I didn't run npm install for you. Run the commands above in `c:\Users\justin.burks\Desktop\project 5`.
- If you want type-checking locally, run `npx tsc --noEmit` after installing dependencies.

Files added:
- `package.json` — dependencies and scripts
- `tsconfig.json` — TypeScript config
- `next.config.js` — Next.js configuration (appDir enabled)
- `tailwind.config.js`, `postcss.config.js` — Tailwind setup
- `app/layout.tsx`, `app/page.tsx` — Next app router entry points
- `styles/globals.css` — Tailwind imports

If you'd like, I can also run `npm install` here for you and start the dev server (but I won't unless you ask).