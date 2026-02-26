# Specification

## Summary
**Goal:** Add separate login pages and role-specific dashboards for Hotel, NGO, Volunteer, and Admin entity types in the Left2Lift application.

**Planned changes:**
- Add an `entityType` field (hotel, ngo, volunteer, admin) to the UserProfile backend data model, with registration/update endpoints and admin-only role checks
- Create a unified login landing page at `/login` showing four entity cards (Hotel, NGO, Volunteer, Admin) that navigate to their respective login pages
- Create dedicated login pages at `/login/hotel`, `/login/ngo`, `/login/volunteer`, and `/login/admin`, each using Internet Identity and saving the appropriate `entityType` on first login
- Create a new Hotel dashboard at `/hotel-dashboard` with sections for posting food donations and viewing donation history, accessible only to hotel entity users
- Update `RoleGuard` and `useRoleBasedAccess` to support the new `hotel` entity type alongside existing roles
- Update the main navigation bar to display entity-appropriate links based on the logged-in user's `entityType`, with unauthenticated users seeing a link to `/login`

**User-visible outcome:** Users can select their entity type (Hotel, NGO, Volunteer, or Admin) on a login landing page, authenticate via Internet Identity on a dedicated branded page, and be redirected to their role-specific dashboard with relevant navigation links.
