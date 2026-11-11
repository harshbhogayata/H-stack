I couldn't build on an existing style here. The repo only has the README, and it says there's no design system yet, so this direction comes from the brief itself: children aged 6–8 reading aloud, parents setting a daily goal, and a garden as the reward.

## Sprout home screen: "The garden is the home screen"

**Main idea.** The kid doesn't open to a menu. They open to *their garden*. Each finished reading session has grown a plant. Today's plot is bare soil with a seed in it, and one big button says "Read today's story." The reward the app promises is the first thing a child sees. That only fits Sprout; it wouldn't work for some other reading app.

### Palette: sky above, soil below

| Name | Hex | Role |
|---|---|---|
| **Sky** | `#BEE4F7` | Top half of the screen. Background behind the daily-goal sun |
| **Soil** | `#4A2E1F` | All text and icons. The ground band at the bottom |
| **Sunflower** | `#FFC93C` | The one main button and the goal sun. Nothing else uses it |
| **Leaf** | `#2F7D3A` | Plants, and "done" states |
| **Loam** | `#8A5A3B` | Today's empty plot and parts of the ground |
| **Berry** | `#C92A5B` | Flowers that bloom on streak days. Kept rare so it feels special |

Contrast, as I calculated it: Soil text on Sky is 9.2:1, on Sunflower 8.0:1 and on white 12.3:1, all well above WCAG AA. White text works on Leaf (5.1:1), Loam (5.8:1) and Berry (5.3:1). Sky and Sunflower must never carry white text (about 1.5:1).

### Type: one family, chosen for beginning readers

- **Andika** (SIL, free open licence) for everything, in Regular and Bold. It was designed for literacy learners. Its "a" and "g" are written the way children learn to write them, and b/d/p/q and I/l/1 are clearly different. For an app where kids practise reading, the letter shapes matter more than any other style choice.
- Scale: about 40px for the greeting, 28px for the story title, 22px for buttons and body text, and no text under 18px on kid screens. Short lines (2–6 words). Sentence case.

### Layout (portrait tablet first, works on phone)

1. **Sky (top ~40%).** A sun arcs from left to right as today's minutes add up. That's the daily goal. Kids this age don't read percentages, but they can see "the sun is almost at the top." When the goal is met, the sun shines and the new plant appears.
2. **Garden strip (middle).** A horizon line with the week's plants growing on it, from the oldest to today's bare plot with its seed. The plant type comes from the kind of book, so the garden shows what they read. It scrolls sideways into older weeks.
3. **Ground (bottom ~25%).** One large Sunflower button with today's book cover beside it: **"Read today's story."** It's at least 72px tall and nearly full width, within easy reach of a child's thumb. No second button competes with it.
4. **Grown-ups corner.** A small "Grown-ups" button, top right, with an accessible label. It needs a press-and-hold to open, so kids don't wander into settings, and parents set the goal there.

**Words.** "Read today's story" → "You read today! Look what grew." On day one the screen isn't empty: one seed in bare soil with "Read a story to plant your first seed." Short sentences, written to be read aloud to the child.

**Motion.** Only two moments get animation: the sun moving and a plant growing. Both use a still end state when reduced motion is on. Nothing loops while sitting idle.

### Checked against generic defaults
My first instinct was a grid of rounded book cards with a progress bar. That would suit any kids' app, so I swapped it for the garden. The palette also avoids the cream-plus-serif-plus-terracotta look and gradient washes. There are no all-caps labels, and Sunflower is spent only on the main button.

### One thing cut
I dropped a streak counter number ("🔥 5 days"). Berry flowers in the garden show the same thing without asking a 6-year-old to read a number or worry about losing a streak.

Not verified: nothing has been drawn or rendered. This is a written proposal, and the plant and sun illustrations still need a sketch to check how they read at small sizes.