# Amazon-style Product Listing App

A React e-commerce application built as a frontend engineering assessment. Features a product listing page with live filtering and a product detail page, powered by the [DummyJSON](https://dummyjson.com/docs/products) public API.

**Live Demo:** https://amantheexecutable.github.io/amazon-clone-assessment/

---

## Features

- Product listing grid with image, title, price, and star rating
- Product detail page with image gallery, description, and customer reviews
- Filter by category, price range, and brand (combined filtering)
- Pagination — client-side by default, API-driven via feature flag
- Filter state persists when navigating to a product and back
- Loading states, error handling with retry, and 404 detection
- Sticky blur pagination bar
- Fully responsive layout

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| HTTP | Axios |
| Styling | SCSS (no Tailwind, no UI libraries) |
| State | React Context + useState/useEffect |
| Deploy | GitHub Pages via GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and run

```bash
git clone https://github.com/AmanTheExecutable/amazon-clone-assessment.git
cd amazon-clone-assessment
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output goes to `dist/`.

---

## Project Structure

```
src/
├── api/
│   └── products.js          # Axios instance + all API functions
├── components/
│   ├── ErrorMessage/         # Error display with optional retry button
│   ├── FilterPanel/          # Category, price range, and brand filters
│   ├── Header/               # Top navigation bar
│   ├── Loader/               # Loading spinner
│   ├── Pagination/           # Page controls (sticky, blur backdrop)
│   ├── ProductCard/          # Individual product card
│   ├── ProductGrid/          # Responsive product grid
│   └── StarRating/           # Star rating display
├── config/
│   └── featureFlags.js       # Feature toggles (see below)
├── context/
│   └── FilterContext.jsx     # Global filter + pagination state
├── pages/
│   ├── ProductListingPage/   # Listing with sidebar filters and grid
│   └── ProductDetailPage/    # Full product view with reviews
├── styles/
│   ├── _variables.scss       # Design tokens (colors, spacing, etc.)
│   └── global.scss           # CSS reset and base styles
└── utils/
    └── parseError.js         # Classifies API/network errors
```

Each component lives in its own folder with a co-located `.scss` file.

---

## Architecture Decisions

### Filter state in React Context

Filters (category, price range, brands, current page) live in `FilterContext` rather than URL search params. This keeps the implementation simple while ensuring filters are preserved when navigating to a product detail page and pressing Back. The context is mounted above the router so it survives route changes.

### Client-side filtering with a single fetch

By default the app fetches up to 100 products in one request, then applies brand and price filters in memory using `useMemo`. This avoids paginated API results being inconsistent after client-side filtering (e.g. page 2 showing 4 items because 8 were filtered out).

Category selection is the one exception — it re-fetches from `/products/category/{slug}` since the API supports it natively.

### API pagination via feature flag

`src/config/featureFlags.js` exposes `USE_API_PAGINATION`. When set to `true` and no brand/price filters are active, the app passes `limit` and `skip` to the API and derives total pages from the API's `total` field. When brand/price filters are active, it automatically falls back to the client-side strategy regardless of the flag.

```js
// src/config/featureFlags.js
export const USE_API_PAGINATION = false; // set to true to enable
export const PAGE_SIZE = 12;
```

### Error classification

All API errors are routed through `src/utils/parseError.js` which distinguishes:
- **No response** → network/connectivity error
- **404** → product not found (no retry offered)
- **5xx** → server error
- **Other** → generic fallback

---

## API Endpoints Used

| Endpoint | Usage |
|---|---|
| `GET /products?limit=100` | Initial product load |
| `GET /products/categories` | Populate category filter |
| `GET /products/category/{slug}` | Filter by category |
| `GET /products/{id}` | Product detail page |

---

## Assumptions

- Brand and price filtering is always client-side since the DummyJSON API has no query params for them
- A maximum of 100 products are fetched per request — sufficient for the dataset (~194 total) across categories
- The `HashRouter` is used instead of `BrowserRouter` to support GitHub Pages, which cannot serve arbitrary paths

---

## Potential Improvements

- **Search** — wire the header search bar to `/products/search?q=` 
- **Cart** — add cart state to context with add/remove/quantity
- **Sorting** — sort by price or rating client-side
- **Skeleton loaders** — replace the spinner with card-shaped skeletons for better perceived performance
- **Infinite scroll** — replace pagination with intersection observer-based loading
- **Tests** — unit tests for `parseError`, filter logic, and component rendering with React Testing Library
