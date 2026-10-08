# Hearthly MVP

Hearthly connects neighbourhood customers with skilled home chefs. Customers can order a published meal or create their own request; Hearthly analyses its ingredient needs, ranks nearby chefs against live kitchen stock, and sends the request down the priority list until one chef confirms.

## Included

- Customer marketplace with meal search, categories and custom meal creation
- Recipe-aware ordering with per-serving ingredient calculations
- Ranked chef matching based on stock coverage, suitability and distance
- Accept-and-reserve workflow that automatically deducts kitchen stock
- Decline-and-handoff workflow that routes an order to the next matched chef
- Professional inventory with quantities, units, categories, expiry dates and low-stock alerts
- Home-chef dashboard with earnings, matched requests and kitchen schedule
- Food community with recipes, tips, stories, questions and reactions
- Platform-managed delivery pricing and fulfilment messaging
- Responsive desktop and mobile layouts

## Run locally

```bash
npm install
npm run dev
```

- Customer marketplace: `http://localhost:3000`
- Home-chef dashboard: `http://localhost:3000/cook`
- Kitchen inventory: `http://localhost:3000/cook/inventory`
- Food community: `http://localhost:3000/community`

## Validate

```bash
npm run lint
npm run build
```

## Data note

This MVP uses an in-memory store in `lib/data.ts`. Data created through the UI resets when the development server restarts. A production deployment should replace it with a database and authenticated user accounts.
