# EVzone User (Mobile) — CRA + MUI + Tailwind (JavaScript)

A complete, mobile-first user shell for the EVzone Super App. **All U01–U12 screens are included and wired.**

## Quick start
```bash
npm install
npm start
```
Opens http://localhost:3000 — default route `/inbox`.

## Tech
- Create React App (JavaScript)
- MUI 5 + Icons
- TailwindCSS 3
- React Router v6

## EV colors
- EV Green: #03cd8c
- EV Orange: #f77f00
- EV Light: #f2f2f2
- EV Grey : #a6a6a6

## Structure
- `src/shell/EVZUserMobileShell.jsx`: Mobile shell (EV Green header + labeled bottom nav)
- `src/user/registry.js`: Maps Uxx-yy IDs to components
- `src/pages/user/Uxx-yy.jsx`: All user pages (U01–U12) as components
- `src/App.js`: Theme + Router + Shell

## Notes
- Footer uses labels under icons and respects safe-area insets.
- Main content is constrained to `maxWidth: 390px` for authentic phone feel.
- Registry ensures any missing page renders a graceful stub instead of crashing.
