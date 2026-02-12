# Specification

## Summary
**Goal:** Make the existing admin Products area and product create/edit flow easier, faster, and safer for owners to manage products without unnecessary navigation.

**Planned changes:**
- Update `/admin/products` to be a more owner-friendly product management view with in-page search (name, plus brand/category when present) and at least one sort option (e.g., name A–Z, inventory low–high).
- Keep existing per-product actions available from the list (Edit opens editor; Update Stock opens inventory dialog) while ensuring primary actions work well on small screens without horizontal scrolling.
- Refine the product create/edit form with clear inline validation for required fields (name, description, price, category, inventory).
- Add unsaved-changes protection when cancelling/closing the editor (confirm before discarding edits).
- Improve the image URL field with immediate preview feedback (and a sensible placeholder when empty).
- After successful create/update, return to the product list and ensure the list reflects latest data via existing React Query invalidation.

**User-visible outcome:** Owners can quickly find products via search/sort, trigger common actions (edit/update stock) from the list, and create/edit products with clearer validation, image previews, and protection against accidentally losing changes.
