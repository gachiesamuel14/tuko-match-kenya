# Tuko Match 🇰🇪

**Location-based dating & matchmaking for Kenya**

Find people near you by GPS, county, town, interests, tribe, religion and more. Built as a modern React + Vite SPA, ready to deploy on Netlify.

> **Demo version** — all data is stored in the browser (localStorage). Perfect for prototyping the UX. For production you will add a real backend (recommended: Supabase).

## Features (current demo)

- ✅ User registration / login (demo auth)
- ✅ Profile setup wizard (name, age, gender, bio, county, town, tribe, religion, interests, photo upload)
- ✅ Browser Geolocation API support
- ✅ County filter (all 47 Kenyan counties)
- ✅ Discover / swipe-like cards with distance, online status
- ✅ Match system + “It’s a Match!” toast
- ✅ Matches list + real-time-style chat (with auto-reply demo)
- ✅ Profile page + premium / safety teasers
- ✅ Mobile-first UI with Tailwind CSS
- ✅ Ready for Netlify (SPA redirects included)

## Planned for production

- Real auth (Supabase Auth / Firebase / Auth0)
- PostgreSQL / Firestore for profiles, likes, matches, messages
- Real-time chat (Supabase Realtime or Socket.io)
- Photo storage (Supabase Storage / Cloudinary)
- Push notifications
- Report / block system
- M-Pesa payments for premium
- Admin dashboard
- Photo verification

## Tech stack

| Layer        | Choice              |
|-------------|---------------------|
| Frontend    | React 18 + TypeScript + Vite |
| Styling     | Tailwind CSS        |
| Routing     | React Router v6     |
| Icons       | Lucide React        |
| Hosting     | Netlify             |
| Future DB   | Supabase (recommended) |

## Quick start (local)

```bash
git clone https://github.com/gachiesamuel14/tuko-match-kenya.git
cd tuko-match-kenya
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Netlify

### Option A – Connect GitHub (recommended)

1. Go to [app.netlify.com](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. Choose GitHub and select `tuko-match-kenya`
4. Build settings are already in `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

### Option B – Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init   # link or create site
netlify deploy --prod
```

## Project structure

```
src/
  data/mockUsers.ts     # Demo Kenyan profiles
  lib/storage.ts        # localStorage helpers
  pages/
    Landing.tsx
    AuthPage.tsx
    ProfileSetup.tsx
    Discover.tsx        # Core matching UI
    Matches.tsx
    Chat.tsx
    ProfilePage.tsx
  types.ts
  App.tsx
  main.tsx
  index.css
netlify.toml
```

## Next steps to make it production-ready

1. **Backend**: Create a free Supabase project → Auth + Database + Storage + Realtime.
2. Replace `lib/storage.ts` and mock auth with Supabase client.
3. Add RLS policies so users only see relevant data.
4. Implement proper matching algorithm (Haversine distance + filters).
5. Add M-Pesa via Safaricom Daraja API or a payment provider that supports it.
6. Add content moderation and report flows.

## Licence

MIT — feel free to fork and build the real thing for Kenya.

---

Made with ❤️ for Kenyan connections.
