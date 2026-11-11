I added the PlanCard component in `src/components/PlanCard.jsx` with its styles in `src/components/PlanCard.css`. I haven't seen it rendered: the repo has no build setup or demo page, so I only checked the code and worked out the colour contrast by hand.

**What it shows**
- **Inputs:** a plan name, a monthly price as a number (with a currency, US dollars by default), a feature list, whether it's the current plan, and a function to run when Choose is clicked.
- **Price:** shown in the viewer's local format, like "$12 / month". Whole numbers drop the cents, and the digits line up the same way as in `InvoiceSummary`.
- **Features:** a plain bulleted list. If the plan has no features, the list is left out.
- **Button:** built from the existing `Button` component and labelled "Choose Pro" (using the plan's name).
- **Current plan:** the card gets an amber outline and a "Current plan" label, so the highlight isn't shown by colour alone. Screen readers are told it's the current plan too. The button switches to the secondary style, reads "You're on this plan" and can't be clicked, since choosing the plan you already have does nothing.

**Styling:** everything uses the colours, spacing and corner radius already in the project. I didn't add any new ones. The amber highlight colour the theme already defines was a good fit, and its dark-mode version comes from the theme automatically.

**Accessibility checks:**
- Text contrast passes the standard for normal text (WCAG AA). The amber label on white is about 5.9 to 1, and the dark-mode amber has more contrast than that.
- The button has no custom focus styling, so the browser's normal focus outline still shows.
- The highlight outline doesn't change the card's size, so nothing shifts when a plan becomes current.
- There's no animation.

**Not verified:** I didn't render it in a browser, so how it actually looks in light and dark mode hasn't been checked.