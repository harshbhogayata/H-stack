I checked the repo, and all it has is the README: Sprout is a reading-aloud app for 6–8 year olds. Parents set a daily goal, kids grow a garden, and the tone should be warm and playful with big touch targets. There's no design system yet, so this proposal starts from scratch.

## Concept: "My garden, my morning"

The home screen *is* the child's garden. The kid isn't looking at a dashboard. They're visiting a place they made, with one obvious thing to do: read, so it grows.

## Palette

Soft, sunny and earthy, not candy-bright. It should feel calm enough for reading and still cheerful.

| Role | Colour | Hex | Use |
|---|---|---|---|
| Sky / background | Morning cream | `#FFF8EC` | Main canvas, warmer than white and easier on the eyes |
| Primary action | Sprout green | `#3FA34D` | The "Let's read!" button and growth moments |
| Primary (pressed / text-on-light) | Deep leaf | `#1F6B33` | Button text, headings; passes AA on cream |
| Accent / reward | Sunflower | `#FFC93C` | Stars, today's progress, celebrations |
| Secondary accent | Berry | `#E8657A` | Flowers, streak hearts, used sparingly |
| Earth | Soil brown | `#8B5E3C` | Garden ground, plant pots |
| Calm neutral | Rain blue | `#7CB8D9` | Watering can, "listening" state while the child reads |
| Ink | Bark | `#2E2A24` | Body text, never pure black |

Rules:
- Green means "do this." Yellow means "you earned this." Never swap them.
- Don't use red for mistakes. Gentle corrections use Rain blue, so reading aloud never feels like failing.
- Keep text at 4.5:1 contrast or better. Light colours like Sunflower are fills only, never text.

## Type

- **Reading and body text: Andika.** It was designed for beginning readers. It has single-storey *a* and *g*, clear *b/d/p/q*, and generous spacing. Kids should see letters on screen the way they learn to write them.
- **Display, greetings and numbers: Fredoka** (rounded, friendly, heavy weights). Use it only for short words like "Hi, Maya!" or "3 of 5."
- **Sizes:** at least 20pt body, about 28pt for story text, 40pt+ for the greeting. Keep line length short (about 35 characters in story view).
- Don't use all-caps or italics for meaning. Early readers struggle with both.

## Home screen layout (portrait tablet or phone)

```
┌───────────────────────────────┐
│  ☀️ Hi, Maya!          [🌻 x12] │  ← greeting + total flowers (no parent stuff)
│                               │
│     ~~~ the garden ~~~        │  ← ~55% of screen: illustrated, scrollable
│   🌱   🌷   🌻   🌿   (empty) │     sideways; each plant = a past reading day;
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │     an empty pot waits for today
│                               │
│   Today:  💧💧💧○○            │  ← goal as watering-can drops, not a % bar
│                               │
│ ┌───────────────────────────┐ │
│ │      📖  Let's read!       │ │  ← one huge primary button (≥ 88pt tall,
│ └───────────────────────────┘ │     full width, thumb zone)
│                               │
│  [Pick a book]      [My plants]│  ← two secondary tiles, icon + word
│                       🔒      │  ← small parent gate, bottom corner
└───────────────────────────────┘
```

Key ideas:
1. **The empty pot is the call to action.** Today's spot in the garden sits empty with a little sprout peeking out. Each drop of reading waters it, and it blooms when the goal is met. Progress and reward are the same object.
2. **Show progress as a count, not a percentage.** Five drops beat "60%" because 6 year olds can count but don't read percentages.
3. **One primary action.** A single dominant button, with secondary tiles clearly smaller. Every tap target is at least 64pt and spaced so small hands don't mis-tap.
4. **Every label has an icon.** Weaker readers should be able to get around without reading.
5. **Keep parents out of the way.** Goals and settings sit behind a small lock with a simple adult check (for example "hold for 3 seconds" or a sum). The home screen stays fully the child's.
6. **The screen changes through the day.** The sky tint shifts from morning cream to warm dusk, and plants sway a little. It feels alive without being noisy, and these are the only idle animations.

## Personality touches

- **Illustration:** flat shapes with rounded corners, soft grain, no outlines. It should feel like a picture book, not a game UI.
- **Motion:** springy and short (200–300ms). Plants "pop" when they bloom. All motion respects reduce-motion settings.
- **Sound:** an optional soft chime on bloom. Never a buzzer.
- **Mascot (optional):** a small seed character who cheers from the pot. Keep it secondary to the garden.

## Directions to decide on

- **Garden scope:** a single scrolling garden that grows over time (more sense of ownership), or a weekly bed that resets (more achievable, less overwhelming). I'd lean toward the scrolling garden.
- **Dark mode:** probably a "night garden" with deep blue and glowing plants, for bedtime reading.

If it helps, I can turn this into a visual mockup page so you can see the palette and layout together.