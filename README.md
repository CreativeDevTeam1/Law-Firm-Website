# Shady El-Barkoky Law Firm website

Next.js 16 (App Router, Cache Components), GSAP and Lenis. All styles are in `src/app/globals.css`. Content comes from Sanity (project `6x6vo5xc`, dataset `production`), edited in the Studio beside this folder, `../studio-law-firm-website`.

```bash
cp .env.example .env.local
npm run dev
```

## Content

Every piece of copy, image and list on the site comes from Sanity through one content layer:

- `src/content/types.ts` is the content model the components use, field for field with the Studio's schemas (`../studio-law-firm-website/schemaTypes`).
- `src/sanity/queries.ts` holds the GROQ queries, each projecting a document into its type's shape (images as `{ src, alt, position }`, references as the documents themselves).
- `src/content/queries.ts` has the only functions that read content (`getHomePage()`, `getTeamMemberPage(slug)`, …). Pages call them and pass the results down as props; components never fetch.
- `src/sanity/live.ts` sets up `sanityFetch` and `<SanityLive />` (rendered in the root layout). Pages are prerendered and cached; when content is published, Sanity Live refreshes exactly the caches that used it, so changes appear without a rebuild or a webhook.

After changing a schema or a query, regenerate `sanity.types.ts` from the Studio folder:

```bash
npm run typegen
```

Interface wording that isn't content (form labels, "Know more", the 404 page) stays in the components; the Client intake form's English and Arabic wording is in `src/glossary`.
