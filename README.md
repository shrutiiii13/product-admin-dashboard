# Product Admin Dashboard

A simple Product Admin Dashboard built for the Nexgensis Technologies React Developer assignment.

## Tech Stack

- Next.js (App Router)
- React
- JavaScript
- Tailwind CSS
- Axios
- DummyJSON API (`https://dummyjson.com`)

## Features

- Login with DummyJSON authentication
- Protected product routes
- Product list with table (desktop) and cards (mobile)
- URL-synced pagination, search, category filter, and sorting
- Debounced search with AbortController stale-request protection
- Product details with images and reviews
- Add / edit / delete products with validation and confirm dialog
- Loading, empty, and error states with Retry
- Session-only UI updates for DummyJSON simulated mutations

## Project Structure

```text
src/
  app/
    login/page.js
    products/
      page.js
      new/page.js
      [id]/page.js
      [id]/edit/page.js
      layout.js
    layout.js
    page.js
  components/
  context/
  hooks/
  lib/
  services/
  utils/
```

## Setup Instructions

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Login Credentials

- username: `emilys`
- password: `emilyspass`

## API

All requests go through a shared Axios instance in `src/lib/axios.js` to DummyJSON.

Flow:

`UI component → service function → shared Axios instance → DummyJSON`

## Pagination Approach

Pagination uses DummyJSON `limit` and `skip`:

```text
skip = (page - 1) * limit
```

Page size options are `10`, `20`, and `50`. The UI shows text like `Showing 21–40 of 194`.

Page and limit are stored in the URL, for example:

`/products?page=2&limit=20`

## Search Approach

Search uses:

`GET /products/search?q=`

The search input is debounced (400ms) so typing does not fire a request on every keystroke. After the user pauses, the debounced value is written into the URL and the list is fetched. Changing search resets the page to `1`.

## Stale Request Handling

Each product list request uses an `AbortController`.

When search/filter/page values change:

1. The previous request is aborted
2. A new request starts
3. A request id check ignores outdated responses

This prevents an older slow response (for example with `&delay=2000`) from overwriting newer results.

## Search + Category Decision

DummyJSON cannot reliably combine search and category filtering the way a real backend would.

Chosen behavior:

- If search text exists → use `/products/search`
- If search is empty and a category is selected → use `/products/category/{category}`
- If both are set → **search takes priority**
- The category dropdown is disabled while search is active, and a short UI hint explains this

## CRUD Behavior

DummyJSON add/edit/delete endpoints are simulated. They do **not** permanently persist data.

This app:

1. Calls the DummyJSON mutation endpoint
2. Stores the change in a React context for the current browser session
3. Updates list/detail UI from that session state

Refreshing the browser reloads the original DummyJSON data.

## Invalid URL Handling

URL values are parsed safely:

- Invalid `page` (for example `abc`) → falls back to `1`
- Invalid `limit` → falls back to `10`
- Only allowed limits: `10`, `20`, `50`
- Page numbers beyond the available total are clamped to a valid page

## Problem Faced

Fast typing during search can create overlapping requests. Without cancellation, a slower older response can replace newer results.

Solution: debounce the input, cancel in-flight requests with `AbortController`, and ignore responses that no longer match the latest request id.

## AI Usage

AI tools were used for development assistance, scaffolding suggestions, debugging ideas, and explanation of edge cases. The final implementation was reviewed and tested manually.

## Deployment

- GitHub URL: https://github.com/shrutiiii13/product-admin-dashboard
- Live Vercel URL: https://product-admin-dashboard-liard-zeta.vercel.app

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
