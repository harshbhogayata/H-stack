The repo is only a README, which describes Sprout as a read-aloud practice app for children aged 6–8. Parents set a daily goal and kids grow a garden by reading. So this direction is based on that brief alone.

## Visual direction: "Morning Garden"

The home screen should feel like stepping into your own small garden each day. It should be calm and sunny, not loud and arcade-like. A 6–8-year-old should know what to do without reading, and a parent glancing over should understand the progress straight away.

### Palette
Warm and natural, with one clear colour for the main action. Keep it soft so the plants are the brightest thing on screen.

| Role | Colour | Use |
|---|---|---|
| Background | **Oat cream** `#FFF8EC` | Main surface, like warm paper |
| Ground | **Soil** `#8B5E3C` / soft tint `#E9D5BF` | Garden bed, footer band |
| Primary | **Sprout green** `#3FA34D` | "Read" button, filled progress |
| Accent | **Sun yellow** `#FFC93C` | Stars, streaks, celebrations |
| Secondary accent | **Petal coral** `#FF7A6B` | New-plant moments, badges (rarely) |
| Sky | **Pale sky** `#CFEFFF` | Top gradient behind the garden |
| Text | **Bark** `#3B2A20` | All text, warmer than black |

- Body text must meet AA contrast. Bark on oat does. White text on sprout green only passes at large sizes, which suits the big button.
- Dark mode should be an evening garden: deep indigo sky, the same greens, and fireflies instead of the sun. Kids often read at bedtime, so this matters.

### Type
- **Display: Baloo 2** (or Fredoka). It's rounded, friendly and chunky, and works for greetings and the button label.
- **Body: Lexend** (or Andika). Both were made for early readers, with clear letter shapes and a single-storey "a" and "g". That matters in a reading app.
- Sizes: the greeting is about 32pt, the button label about 28pt, and nothing kids touch goes below 20pt. Parent-only text can drop to 15–16pt.
- Use sentence case only and keep words short: "Hi Maya!" and not "Welcome back, Maya".

### Layout idea: the garden is the progress bar
One screen, no scrolling for the child, in three layers from top to bottom:

1. **Sky (top ~20%)**: "Hi Maya!" with her avatar. A sun on the right fills up through the day as she reads toward her goal. It's a radial progress ring that doesn't look like one.
2. **Garden (middle ~45%)**: her actual plants on a curved soil bed. Today's plant is a seedling that visibly grows as minutes are read. Tapping any plant plays a short sound or wiggle. The garden itself is the reward and the record.
3. **Action (bottom ~35%)**: one large pill button, at least 80pt tall and nearly full width, in sprout green with a book icon and "Let's read!". A small row under it shows the streak and "3 of 10 min" with icons, plus a quiet 🔒 parent corner, top right, behind a hold-to-open gesture.

Principles behind it:
- **One obvious action.** There's no tab bar on the child's home screen. Library, settings and progress live behind the parent lock or come up after reading.
- **Icons with words.** Every label has an icon so pre-fluent readers aren't stuck.
- **Touch targets of 64pt or more**, kept away from edges and spaced generously for imprecise taps.
- **Gentle motion only.** Plants sway a little and the sun glows. A big celebration plays only when the goal is met, when the seedling blooms with a burst of sun-yellow confetti. Respect reduced-motion settings.
- **Illustration style**: flat shapes with soft rounded corners, one darker shade for depth, no outlines. The style can grow with new plant species without needing a full illustration system.

### Open questions before going further
- Is the main device a phone, a tablet or both? On a tablet I'd put the garden on the left and the action on the right.
- Should there be a mascot, such as a little watering-can character? It adds warmth but also scope.
- How much should parents see on this screen versus a separate parent view?

If you want, I can turn this into a mood board or a clickable wireframe as a next step.