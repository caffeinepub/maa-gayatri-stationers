# Specification

## Summary
**Goal:** Fix the "Unable to load products" error on the Catalog page so products are fetched and displayed correctly.

**Planned changes:**
- Fix the `useProducts` hook in `useQueries.ts` so it successfully calls the backend actor and retrieves products without throwing an error.
- Update the backend `getProducts` query in `main.mo` to return product records with all fields expected by the frontend (id, name, description, price, category, stock, imageUrl), resolving any type mismatches.
- Fix the auto-seed logic in `CatalogPage.tsx` so that when the product list is empty after a successful fetch, seed products are automatically inserted and displayed without a manual page refresh.

**User-visible outcome:** The Catalog page loads and displays the product grid without showing the "Unable to load products" error message.
