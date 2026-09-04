# things I couldn't say — An Intimate Digital Poetry Journal

An intimate, single-page poetry website crafted as a Victorian love letter and antique poetry journal: feminine, dreamy, romantic, elegant, slightly vintage, inspired by handwritten poetry books.

Built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Framer Motion**, **PageFlip**, and **Supabase**.

---

## Aesthetic & Experience

- **Landing State**: A centered, closed vintage hardcover poetry book in soft dusty rose with embossed gold foil lettering, Victorian filigree corner flourishes, a trailing satin ribbon bookmark, ambient table shadows, and drifting flower petals.
- **Book Physics**: Physical page turning using `page-flip` with authentic 3D page curl, changing shadows, depth, perspective, and procedural paper rustle audio synthesis.
- **Responsive Layout**: Two-page open spread on desktop and tablets; seamlessly adapts to an intimate single-page reader on mobile devices.
- **Old English & Literary Typography**: Titles typeset in `UnifrakturCook` (Blackletter), body verses in `Cormorant Garamond` and `EB Garamond`, and dedications in `Great Vibes`.
- **Formatting Preservation**: Preserves line breaks, indentations, and stanza spaces exactly as entered when copy-pasting poems.
- **Admin Management**: Secure curator desk to add, edit, delete, and reorder poems with live book-page preview, backed by PostgreSQL and Row Level Security on Supabase.

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (custom vintage palette: blush `#F8E4EA`, dusty rose `#C98598`, burgundy `#743F4D`, aged ivory paper `#FFF9F2`, antique ink `#392B30`, rose gold `#B77973`)
- **Page Flip Engine**: `page-flip`
- **Motion & Transitions**: `framer-motion`
- **Database & Auth**: `@supabase/supabase-js` (PostgreSQL with RLS)
- **Audio**: Web Audio API procedural paper rustle synthesis with mute toggle
- **Icons**: `lucide-react`
- **Deployment**: Vercel-ready with `vercel.json` SPA rewrites

---

## Supabase Database Setup

### 1. Create a Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings > API**, locate your **Project URL** and **anon public key**.

### 2. Run Database Migration
1. In your Supabase dashboard, open the **SQL Editor**.
2. Copy and paste the contents of `supabase/schema.sql` into the editor and click **Run**.
3. This creates:
   - The `poems` table with `uuid`, `title`, `subtitle`, `body`, `dedication`, `poem_date`, `order_index`, and timestamps.
   - Row Level Security (RLS) policies allowing public visitors to read (`SELECT`) and authenticated users to manage (`INSERT`, `UPDATE`, `DELETE`).
   - An auto-updating `updated_at` trigger.
   - Initial starter romantic poems.

### 3. Create Admin User
1. In the Supabase dashboard, navigate to **Authentication > Users**.
2. Click **Add User > Create User**.
3. Enter your curator email and a strong password (e.g. `curator@example.com`).
4. You will use these credentials to log in at `/admin`.

---

## Local Development

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Uto
npm install
```

### 2. Configure Environment
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note**: If you don't configure Supabase immediately, the application runs automatically in **Offline/Demo Mode** with bundled poems, allowing you to test all features (including adding/editing poems in demo curator mode) immediately!

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## How to Access the Admin Panel

1. Navigate to `http://localhost:5173/admin` (or click the discreet key icon in the bottom-right corner of the website footer).
2. Sign in using your Supabase curator email and password (or click "Enter Curator Mode" in offline demo mode).
3. From the Curator's Desk, you can:
   - **+ New Poem**: Add a poem with title, subtitle, dedication, date, and body (supports copy-pasting multi-stanza poems with line breaks intact).
   - **Live Preview**: See how the verses will look inside the book in real time.
   - **Reorder**: Use the Up and Down arrow buttons to change poem order in the book.
   - **Edit / Delete**: Update or delete poems.

All changes are immediately reflected in the book without requiring a re-deployment!

---

## Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In [Vercel](https://vercel.com), click **Add New Project** and import your repository.
3. In the project setup screen, expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
4. Click **Deploy**.
5. `vercel.json` ensures that all routes (including `/admin`) route directly to the single-page application without 404 errors.

---

## Customization

You can customize the book's title, author, year, dedication, and closing message by modifying `src/config/book.ts`:

```typescript
export const BOOK_CONFIG = {
  title: "things I couldn't say",
  subtitle: "fragments & late-night confessions",
  author: "Eleanor Vance",
  year: "MCMXXIV",
  landingInstruction: "Come read with me.",
  dedication: {
    heading: "Dedication",
    text: "For every feeling\nthat refused to become a sentence...",
    signature: "Always,"
  },
  closing: {
    heading: "Finis",
    text: "The words end here,\nbut the silence\nstill remembers.",
    subtext: "Thank you for listening to my quietest hours."
  }
};
```

---

## License

MIT License. Crafted with love and poetry.
