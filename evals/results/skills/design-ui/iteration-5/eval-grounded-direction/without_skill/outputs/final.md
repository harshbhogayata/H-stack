# Sprout home screen: visual direction

The repo only has the README, so this is based on what it says: children aged 6–8, reading aloud, a garden as the reward, parents setting a daily goal, and a warm, playful tone with big touch targets.

## Concept: "The garden is the home screen"

Don't put a menu with a garden tab on the home screen. Make the home screen the child's garden. When the child opens the app, they see what they've grown and one obvious thing to do next: read to help today's seedling grow. Progress shows up as something the child sees in the garden, not as numbers.

## Palette: "Sunny allotment"

The colours are warm and earthy rather than candy-bright. That keeps it calm enough for reading practice but still playful.

| Role | Colour | Hex | Use |
|---|---|---|---|
| Paper | Warm cream | `#FFF8EC` | Main background |
| Sky | Soft sky blue | `#CFE9F5` | Top band behind the garden |
| Soil / ink | Deep cocoa | `#3B2A20` | All text and icons (softer than black) |
| Leaf (primary) | Garden green | `#2F7D3E` | Main button, active states |
| Sprout (tint) | Fresh green | `#A8D86E` | New growth, progress fill |
| Sun (reward) | Sunflower yellow | `#FFC845` | Stars, streaks, the "goal met" moment |
| Clay (secondary) | Terracotta | `#D9724A` | Plant pots, secondary buttons |
| Bloom (rare) | Berry pink | `#C8467A` | Only for celebrations, so it feels special |

**Rules:**
- Text is always cocoa on cream or white on leaf green. Both combinations should pass WCAG AA; check them once real components exist.
- Yellow is never used for text. It's only for reward moments.
- Never rely on colour alone. Every state also changes shape or has an icon, which helps colour-blind kids.

## Type

- **Headings and buttons: Fredoka.** It's rounded, friendly and chunky, and stays readable at large sizes. Use it for "Read today's story!" and the child's name.
- **Anything a child reads: Andika.** It was designed for early readers. Its "a" and "g" are the simple shapes children learn to write, and letters that look alike (b/d, I/l) are easier to tell apart. This matters most inside stories, but use it on the home screen too so the letter shapes stay consistent.
- **Sizes:** body text at least 22pt, primary button label about 28pt, child's greeting about 36pt. Use generous line height (1.5) and never all caps.
- **Few words:** a 6-year-old may not read the UI fluently, so every label also has an icon and a tap-to-hear option (a small speaker glyph).

## Layout (portrait tablet or phone, top to bottom)

1. **Top bar (slim):** the child's avatar and "Hi, Maya!" on the left. The parent gate sits in the top right as a small, low-contrast lock that opens with a press-and-hold, so kids don't tap into settings by accident.
2. **The garden (about 55% of the screen):** an illustrated raised bed against the sky band. Past reading days appear as grown plants, and today's plot holds a small seedling that's slightly droopy and waiting.
3. **Today's goal:** a watering can that fills as minutes are read, labelled "10 min" with a can icon. There are no percentages or progress bars. When it's full, the seedling perks up and blooms.
4. **Primary action (about 30% of the screen):** one big, full-width, pill-shaped "Read today's story" button in leaf green, roughly 88pt tall, with a book icon and a soft idle "breathing" animation. It's the only thing on the screen that looks pressable.
5. **Secondary row:** two large icon tiles, "My garden" (the full collection) and "Stories" (free choice). They're clay-coloured and visibly quieter than the main button.

Every tap target is at least 64pt, with at least 16pt between targets. Small fingers aren't precise.

## Three states to design

- **Not started:** the seedling waits, the watering can is empty and the main button is gently animated.
- **In progress:** the can is partly full and the button reads "Keep reading."
- **Goal met:** the plant blooms, a brief sunflower-yellow burst plays, the button changes to "Read more?" with no pressure, and a "tell your grown-up" moment appears.

## Illustration and motion

The illustration style is flat shapes with slightly irregular, hand-cut edges, like paper collage. There are no gradients or gloss, and all line weights match. Motion is slow and springy, never flashy, and every animation can be turned off with a reduced-motion setting.

---

If it would help, I can turn this into a static visual mock-up showing the palette, type samples and the three states as a shareable page.