# Naqsh – product rules (what the agent may test against)

The app is a henna artist marketplace plus a small shop. Test it as a QA engineer would.
These are the requirements; anything that violates them is a defect.

| ID  | Rule |
|-----|------|
| R1  | Cart subtotal = sum of (price x quantity) for every item. |
| R2  | Package prices: Simple = artist "from" price x 1, Full Hand x 1.7, Bridal x 3.3 (rounded to the nearest dollar). |
| R3  | The platform commission is 10% of every booking total. Admin earnings must reflect it. |
| R4  | Artist list: "Price: Low-High" sorts ascending, "Highest Rated" descending, a style filter returns only artists with exactly that specialty, "available today" returns only artists available today. |
| R5  | A booking date cannot be in the past. |
| R6  | Sign-up passwords must meet at least 3 of the 4 strength rules, and password and confirmation must match. |
| R7  | A review's displayed stars equal its rating. After a review is submitted, that booking can no longer be reviewed. |
| R8  | The rating shown on artist cards is the artist's average with one decimal. |
| R9  | Favorites toggle on and off, persist after refresh, and any failure must be visible to the user. |
| R10 | The cart persists across a page refresh. |
| R11 | An order's stored total = sum of (price x quantity) of its items. |
| R12 | At 375px width every primary action is visible and the page does not scroll horizontally. |
| R13 | Informative images have alt text; every form input has an associated label. |

## Access
- Customer account: create one at /auth (email confirmation is off in the benchmark project).
- Admin area: /admin, password `naqsh2026`.
- Payments run in Stripe **test mode**; use card 4242 4242 4242 4242, any future date, any CVC.

## Rules of engagement for the agent
- Test only the running app (browser). Do not read source code.
- Report each distinct defect once, with reproducible steps, expected vs actual result, severity and the page URL.


Out of scope: payments and Stripe checkout are not configured. Do not test checkout and do not report it as a defect.
