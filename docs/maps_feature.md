# Plan: Resource Directory + "Near Me" Map

## Goal

A public directory of the resources the organization offers, with:

1. A search bar and filters (category, type, etc.) to narrow the list.
2. A map that shows each resource as a pin and highlights the ones closest to the visitor.

Everything uses free, keyless services: **Leaflet + OpenStreetMap** for the map, **Nominatim** for
geocoding, and the browser's **Geolocation API** for "near me".

## Stack decisions

| Concern              | Choice                                              | Why                                                    |
| -------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| Map rendering        | `@nuxtjs/leaflet` (Leaflet + Vue components)        | Free, no API key, Nuxt module, client-only rendering   |
| Map tiles            | OpenStreetMap tiles (swap to OpenFreeMap if needed) | Free; attribution required                             |
| Pin clustering       | `leaflet.markercluster`                             | Groups dense pins into numbered bubbles when zoomed out |
| Address → lat/lng    | Nominatim (OSM), called once on admin save          | Free; 1 req/s limit is fine for admin-only use         |
| User location        | `navigator.geolocation` + ZIP/city fallback         | Built into browsers; needs HTTPS (localhost OK in dev) |
| Distance             | Haversine formula, computed client-side             | No server round-trip; keeps user location private      |
| Directions           | Link to `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG` | Free, no key                          |

## Data model

Add a `resources` table to `server/db/schema.ts`, following the same conventions as `events`:

| Column        | Type                     | Notes                                                      |
| ------------- | ------------------------ | ---------------------------------------------------------- |
| `id`          | text (UUID)              | primary key                                                |
| `name`        | text, not null           |                                                            |
| `description` | text                     | searchable                                                 |
| `category`    | text, not null           | e.g. Counseling, Support Group, Crisis Line, Workshop      |
| `tags`        | text (JSON array)        | optional extra filters (e.g. "free", "Spanish", "youth")   |
| `address`     | text                     | null for online-only resources                             |
| `lat` / `lng` | real                     | filled by geocoding on save; null if no address            |
| `isOnline`    | integer (boolean)        | online resources appear in the list but not on the map     |
| `phone`       | text                     |                                                            |
| `website`     | text                     |                                                            |
| `hours`       | text                     | free text for now                                          |
| `status`      | text, default `'Draft'`  | `Draft` / `Published`, same as `events`                    |
| `createdAt` / `updatedAt` | integer timestamp |                                                          |

Export `selectResourceSchema` / `insertResourceSchema` via `drizzle-zod`. Generate the migration with
`pnpm db:generate`, and add sample resources (with real coordinates) to `server/db/seed.ts`.

## API

Mirror the existing `server/api/events/` structure.

| Route                           | Auth   | Purpose                                                    |
| ------------------------------- | ------ | ---------------------------------------------------------- |
| `GET /api/resources`            | public | List published resources; optional `?q=` and `?category=`  |
| `GET /api/resources/[id]`       | public | Single resource                                            |
| `POST /api/resources`           | admin  | Create; geocodes `address` → `lat`/`lng` before insert     |
| `PUT /api/resources/[id]`       | admin  | Update; re-geocodes only if `address` changed              |
| `DELETE /api/resources/[id]`    | admin  | Delete                                                     |

- The GET routes must be added to the public allowlist in `server/middleware/auth.ts`.
- Geocoding lives in `server/utils/geocode.ts`. It sends a descriptive `User-Agent` (required by
  Nominatim's usage policy), and returns `null` instead of throwing when no match is found, so the
  admin can still save and fix the address or enter coordinates manually.
- The resource list is small (expected: tens to low hundreds), so the public GET returns all
  published resources and filtering/sorting happens on the client. Revisit if the list grows past
  ~1,000.

## Frontend

### Pages and components

- `app/pages/resources.vue` – directory page: search bar, filters, list, and map side by side
  (stacked on mobile, with a List / Map toggle).
- `app/components/ResourceFilters.vue` – search input + category/tag filters.
- `app/components/ResourceCard.vue` – one list entry: name, category, address, distance (if known),
  phone, website, Directions link.
- `app/components/ResourceMap.client.vue` – Leaflet map. The `.client` suffix keeps it out of SSR.
- `app/composables/useResourceFilters.ts` – single source of truth for the filtered list, shared by
  the list and the map.
- `app/composables/useUserLocation.ts` – wraps `navigator.geolocation`, exposes
  `{ coords, status, request() }`, and handles the ZIP/city fallback.
- `app/utils/distance.ts` – Haversine helper (`distanceMiles(a, b)`).

### Map behavior

- One pin per resource that has `lat`/`lng`. Online-only resources are list-only.
- Pin color/icon by category (`L.divIcon` styled with Tailwind).
- Clicking a pin opens a popup with name, address, and a Directions link. Clicking a list card pans
  the map to its pin and opens the popup.
- Pins update whenever the search or filters change (the map reads the same filtered array as the list).
- Initial view: `fitBounds` around all visible pins. After the user shares location: add a
  "You are here" marker, recenter, and sort the list by distance.
- Optional radius filter (e.g. 5 / 10 / 25 miles) once location is known.

### "Near me" flow

1. The user clicks **Use my location**. The browser asks for permission.
2. If allowed: store coords in memory, compute the distance to each resource, sort the list by
   distance, and recenter the map.
3. If denied or unavailable: show a ZIP/city input. Geocode it once through our own
   `GET /api/geocode?q=` proxy (so the Nominatim `User-Agent` and rate limit are handled server-side),
   then continue as in step 2.

## Privacy

This is a mental-health resource site, so location handling must be conservative:

- The user's coordinates stay in the browser. Distances are computed client-side.
- Coordinates are never sent to our API, stored, or logged. (The ZIP/city fallback sends only the
  text the user typed, and the proxy must not log it.)
- Nothing is persisted to `localStorage` without the user opting in.
- Show a one-line note next to the button: "Your location stays on your device."

## Admin

Add a Resources section to the existing admin dashboard (same pattern as Events):

- Table of resources with status, category, and a "missing coordinates" warning.
- Create/edit form. After save, show a small map preview of the geocoded pin so the admin can
  confirm it landed in the right place, with manual `lat`/`lng` fields as an override.

## Testing

- Unit: `distance.ts` (known city pairs), the filter composable (search + category + radius),
  and `geocode.ts` with `fetch` mocked (match, no match, network error).
- API: resource CRUD, public vs. admin access, and re-geocoding only on address change.
- Keep the baseline rule that `pnpm test` runs with no `.env` or network: mock Nominatim in all tests.

## Requirements to add to `requirements.md`

| ID       | Description                                                                          |
| -------- | ------------------------------------------------------------------------------------ |
| REQ-F-xx | Visitors can search and filter published resources by text and category             |
| REQ-F-xx | Resources with an address appear as pins on a map; clicking a pin shows details      |
| REQ-F-xx | Visitors can share their location (or enter a ZIP/city) to sort resources by distance |
| REQ-F-xx | Admins can create, edit, and delete resources; addresses are geocoded on save        |
| REQ-NF-xx | The user's location is never sent to or stored by the server                        |
| REQ-NF-xx | Map and geocoding use free, keyless services with required attribution displayed    |

## Implementation order

1. Schema, migration, and seed data for `resources`.
2. `server/utils/geocode.ts` and the admin CRUD API.
3. Public GET API and the auth middleware allowlist.
4. `resources.vue` with search, filters, and list (no map yet). This is usable on its own.
5. Install `@nuxtjs/leaflet` + `leaflet.markercluster` and build `ResourceMap.client.vue` with pins
   and popups.
6. `useUserLocation`, distance sorting, the "You are here" marker, and the radius filter.
7. Admin dashboard section with the geocode preview.
8. Tests, requirements rows, and a short `docs/` page on the map and geocoding setup.

## Open questions

- What are the final categories and tags? (These drive the filters and pin colors.)
- Do resources have multiple locations? If so, split into `resources` + `resource_locations`.
- Is there a service area (one city or region)? That sets the default map center and zoom when the
  user hasn't shared their location.
- Should hours be structured (for an "open now" filter) or stay free text?
