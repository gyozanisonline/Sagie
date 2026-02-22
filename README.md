# Sagie Maya — Portfolio

Portfolio website for graphic designer **Sagie Maya**, built with [Next.js](https://nextjs.org/) and [Storyblok](https://www.storyblok.com/) as the headless CMS.

## Stack
- **Framework**: Next.js 16 (App Router)
- **CMS**: Storyblok — Sagie can add/edit/remove projects with no code required
- **Scroll**: Lenis smooth scrolling
- **Hosting**: Vercel (recommended)

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_STORYBLOK_TOKEN=your_storyblok_token
```

## Adding Projects (for Sagie)

1. Log in to [Storyblok](https://app.storyblok.com)
2. Go to **Content → Work**
3. Click **+ Create new** → choose `project` content type
4. Fill in: title, category, cover image, gallery images, tick **featured** for homepage
5. Click **Publish** — the site updates automatically

## Content Types

### `project`
| Field | Type | Purpose |
|---|---|---|
| `title` | Text | Project name |
| `category` | Single option | Photo / Video / Creative Direction / Special Projects |
| `cover_image` | Asset | Grid thumbnail |
| `images` | Multi-asset | Project gallery |
| `featured` | Boolean | Show on homepage carousel |

### `info`
| Field | Type | Purpose |
|---|---|---|
| `bio` | Text | About text |
| `portrait` | Asset | Portrait photo |
| `email` | Text | Contact email |
| `instagram_url` | Text | Instagram link |
| `tagline` | Text | Bottom tagline |
