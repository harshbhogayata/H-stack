The repo only has a README, so this is based on what it says: a reading-aloud app for kids aged 6–8, a daily goal set by a parent, plants earned for reading, a warm and playful tone, big touch targets, and no design system yet.

# Sprout home screen: "The Morning Garden"

**The idea:** the home screen is the child's garden. Their progress is something they can see growing, not a number or a progress bar. There's one obvious thing to do (start reading) and everything else sits behind it.

## Palette
Warm and sunny with soft, earthy colours. Avoid neon primaries: they look cheap and tire eyes during longer sessions.

| Role | Colour | Hex | Use |
|---|---|---|---|
| Background | Warm cream | `#FFF8EC` | Screen background, like paper |
| Soil | Cocoa | `#7A5236` | Garden ground, dark text accents |
| Primary | Sprout green | `#4CAF50` → deeper `#2E7D32` for text/borders | The main "Read" action and new growth |
| Sun | Marigold | `#FFB938` | Today's goal, rewards, celebrations |
| Sky | Soft blue | `#BFE3F5` | Top band behind the garden |
| Accent | Petal coral | `#FF7A6B` | Streaks and "new plant!" moments, used sparingly |
| Ink | Deep bark | `#3B2A20` | Body text. Warmer than black, still well above 7:1 contrast on cream |

**Rules:** green is only used for "do this" (the read button and growth). Marigold is only used for "you did it". Status should never depend on colour alone, because some kids are colour-blind. Pair it with a shape or icon, like a filled sun or a checkmark leaf.

## Type
- **Headings:** a rounded, friendly display face such as **Baloo 2** or **Fredoka**, semibold. Use it only for the greeting and button labels.
- **Reading and body text:** a face designed for early readers, such as **Andika** or **Lexend**. They use the single-storey "a" and "g" that kids learn to write, and their letters are clearly distinct (b/d, I/l).
- **Sizes:** at least 20pt body, 28–32pt headings and 24pt button labels. Use generous line height (1.5) and short phrases. Assume the child can read only a few words, so pair every label with an icon.

## Layout (portrait tablet first, works on phone)

```
┌─────────────────────────────┐
│  ☀ sky band                 │
│  "Good morning, Maya!"  🧒  │  ← greeting + avatar (taps to switch child)
│                             │
│   🌱   🌷   🌻   ·   ·      │  ← THE GARDEN: one plant per reading day,
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │     empty plots show what's still to come
│        soil band            │
│                             │
│   ☀ Today: ●●●○○ 3 of 5 min │  ← daily goal as a sun that fills up
│                             │
│  ┌───────────────────────┐  │
│  │   📖  Let's Read!      │  │  ← single big primary button (~88pt tall,
│  └───────────────────────┘  │     full width minus margins, bottom third
│                             │     for thumb reach)
│   🏡 My Garden   📚 Books   │  ← two secondary tiles, still ≥64pt
│                       🔒    │  ← small parent gate, top/bottom corner
└─────────────────────────────┘
```

**Key moves:**
1. **The garden is the hero.** It takes the top ~45% of the screen and each plant stands for a day of reading. A plant from today's reading sways gently, and the next empty plot is outlined. That gives the child a reason to come back without guilt mechanics.
2. **The goal is shown as a sun.** "Today's goal" is a sun that fills in as the child reads, with a small minutes label for kids who can read it. When it's full, a seed drops into the garden. This is the main reward moment.
3. **One main action.** "Let's Read!" is the only green, full-width element. Secondary items are softer cream tiles with cocoa outlines.
4. **The parent area is out of the way.** A small lock icon opens a press-and-hold or simple-maths gate, so goal settings stay away from the child's main flow.
5. **Touch targets:** at least 64pt for everything, at least 24pt gaps, and nothing important in the far corners.

## Motion and feel
- Gentle "squishy" button presses (scale to 0.95, quick bounce back).
- Plants sway idly when tapped, and each one makes a small sound.
- Celebrations are short (under 2 seconds) and skippable. Respect the reduced-motion setting.
- Use friendly, empty-state prompts like "Your first seed is waiting!" rather than empty grids.

## Illustration style
Flat shapes with soft, hand-drawn-feeling edges, a light paper texture and no heavy outlines. Plants should vary a lot in shape (tulip, sunflower, cactus, mushroom) so each day's reward feels different.

---

**Open questions before committing:**
- Is tablet or phone the main device?
- Will there be one child per device or several profiles?
- Should the goal be counted in minutes, pages or books? Minutes fits the sun metaphor best.

I can turn this into a clickable mockup if you want to see it.