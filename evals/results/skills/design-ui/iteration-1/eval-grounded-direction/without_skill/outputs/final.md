# Sprout home screen: proposed visual direction

The README is the only brief: Sprout is for ages 6–8, parents set a daily goal, kids grow a garden by reading aloud, the tone should be warm and playful with big touch targets, and there's no design system yet. My proposal follows.

## Concept: "A garden at golden hour"

The home screen *is* the kid's garden. They shouldn't land on a dashboard with a garden widget in it. The garden is the reward, the progress meter and the brand all at once, so it gets most of the screen. Everything else is one obvious button and a little status.

## Palette

The palette is warm and earthy, not neon primaries. It should feel like a picture book, not a toy store, and it gives the kid content (plants, flowers) room to be the brightest thing on screen.

| Role | Name | Hex | Use |
|---|---|---|---|
| Background | Morning Cream | `#FFF6E5` | Sky and page background |
| Ground | Soil | `#8A5A3B` | Garden beds, footer ground strip |
| Primary | Sprout Green | `#4CAF50` → deeper `#2E7D32` for text and borders | Main "Read" button, growth |
| Accent 1 | Sunflower | `#FFC93C` | Stars, streaks, celebration |
| Accent 2 | Petal Coral | `#FF7A6B` | Flowers, a friendly secondary emphasis |
| Accent 3 | Sky Blue | `#7EC8E3` | Watering can, calm states, parent area |
| Ink | Bark | `#3B2A20` | All text (warm near-black, never pure black) |

Rules:
- **Bark on Cream** for all text. It's high contrast, so early readers can decode letters easily.
- **Don't use red for "not done."** An unmet goal shows as an unwatered or sleepy plant, never as a warning color.
- For dark mode, or a soft evening look before bedtime reading, use "Dusk": a deep indigo `#2B2D4A` sky, fireflies in Sunflower, and plants keeping their colors.

## Type

- **Display: Baloo 2 or Fredoka (rounded, chunky, 600–700 weight).** Use it for the greeting and the button label. It's friendly without being a novelty font.
- **Reading and body text: Andika or Atkinson Hyperlegible.** Andika was designed for beginning readers, with single-story "a" and "g" and clearly distinct b/d/p/q. Since these kids are *learning to read*, this choice matters more than anything else in the type system.
- **Sizes:** body at least 20pt, greeting about 32pt, button label about 28pt. Keep line lengths short and use sentence case. Never use all caps, because kids read word shapes.
- Pair every bit of text with an icon so a pre-fluent reader can still navigate.

## Layout (portrait tablet or phone, top to bottom)

1. **Top strip (about 12%):** a "Hi, Maya!" greeting with the child's avatar on the left. On the right is a small **sun that fills as today's goal progresses**, like a ring around the sun. This replaces a progress bar a 6-year-old can't parse.
2. **The garden (about 55%):** an illustrated, slightly isometric plot. Each completed reading session is a plant. Today's spot shows a seed or bud that visibly grows as minutes accumulate. Tapping a plant shows the book it came from, so the garden doubles as a reading history.
3. **The one big button (about 20%):** a full-width, pill-shaped **"Let's read! 📖"** in Sprout Green with a soft 3D bottom edge so it looks pressable. It's at least 88pt tall and sits in the thumb zone. It's the only primary action on the screen.
4. **Ground strip (about 13%):** soil-colored, with two or three round icon buttons (each at least 64pt) for My books, My garden (full view) and Stickers. The parent area is a small lock icon in the corner that needs a press-and-hold or a simple math gate, so it stays out of the kid's way.

## Motion and feel

- Gentle idle life: leaves sway and a butterfly drifts by. Nothing blinks or demands attention.
- When the goal is met, the bud blooms with a little sparkle burst and the sun fills completely. The celebration happens once, then settles.
- Use rounded corners everywhere (16–24px) and soft drop shadows. No hard lines.

## Why this direction

- The garden carries the motivation without numbers, which suits kids who can't read stats yet.
- It has a single clear action, which matters when kids can't read the UI yet.
- The warm, muted palette won't look cheap to the parents choosing the app, and it leaves room to brighten things up later.

## Open questions

- Is the main device a tablet or a phone? That changes how big the garden can get.
- Is there a mascot character? If so, it should live in the garden, perhaps a ladybug that reads along.

If it helps, I can turn this into a visual moodboard or mockup page you can share with the team.