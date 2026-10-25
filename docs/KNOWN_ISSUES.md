# Known issues that are NOT seeded bugs

These come from the original Lovable-generated app and are left unfixed on purpose.
If the agent reports one of them it is scored as an **unseeded finding** (a real defect), not a false positive and not a seeded-bug hit.

| # | Issue | Where |
|---|-------|-------|
| U1 | Row-level security is open on `orders`, `products`, `site_settings` and `platform_payments` (anyone can insert, update or delete) | `supabase/migrations/*` |
| U2 | Admin login is a client-side check against a hardcoded password; setting a localStorage flag bypasses it | `src/contexts/AdminAuthContext.tsx` |
| U3 | Any signed-in user can create a review for any artist and booking; the database does not tie reviews to the booking owner | `reviews` insert policy |
| U4 | The dashboard decides what a user has already reviewed by matching `customer_name` with the display name, so two users with the same name collide | `CustomerDashboard.tsx` |
| U5 | Checkout takes unit prices from the browser (kept simple for the Stripe test-mode benchmark); a real system must price server-side | `create-checkout` |
| U6 | A failed order insert during checkout is logged but the Stripe session is still created | `create-checkout` |
| U7 | Both artist payment types record `amount: 50` regardless of the configured fee | `create-artist-payment` |
| U8 | Booking form fields (Package, Date, Occasion) are not programmatically linked to their labels (found by the agent in run 1; verify before counting) | `ArtistProfile.tsx` |

Add every new real defect the agent finds to this list after manual verification.
