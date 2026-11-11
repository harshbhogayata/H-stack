# Sprout home screen: proposed visual direction

Sprout has no design system yet, so this direction comes from the brief: children aged 6–8 reading aloud, parents setting a daily goal, a warm and playful tone, and big touch targets. Most users are early readers who are still decoding, so the screen has to work for a child who can barely read it.

## Layout: the garden is the home screen

Instead of a menu of cards, the home screen is one full-screen scene:

- **Sky (top two-thirds):** a calm, mostly empty space with the child's greeting ("Hi, Maya!") and a speaker icon that reads it aloud.
- **Soil (bottom third):** rows of planted plots. Each plant is one day the child read. **Today's plot** sits front and centre, holding a seed or seedling that grows in stages as today's reading time builds toward the parent's goal. The garden works as the progress bar, so the child doesn't need to read any numbers.
- **Read button:** one large sunflower-yellow button in the thumb zone, labelled with a watering-can icon and the word "Read". It's the only main action on the screen.
- **Grown-ups corner:** a small, quiet entry in the top corner behind a simple parent gate. Goals, minutes and history live there, out of the child's way.

**The one memorable element:** today's sprout grows while the child reads, and when they come back to the home screen it has visibly moved up a stage. A missed day leaves plain soil, never a wilted plant, so the garden rewards reading without punishing gaps.

## Palette

| Name | Hex | Role |
|---|---|---|
| Morning sky | `#DDF1FB` | Main background; a flat colour, not a gradient |
| Loam | `#7A4E33` | Soil band and plot outlines |
| Sprout | `#3FA34D` | Plants and growth (progress) |
| Sunflower | `#FFC93C` | The Read button and today's plot highlight only |
| Beetle | `#1F2A44` | All text and icons (deep navy, softer than black) |
| Berry | `#E0457B` | Used rarely: a new bloom or reaching the goal |

Beetle text has strong contrast on both Morning sky and Sunflower (well above the 4.5:1 accessibility minimum). Sunflower is the bold choice and appears only on today's plot and the Read button. Everything else stays quiet.

## Type

- **Andika** (SIL, free) for everything, using regular and bold weights. It was designed for beginning readers: the "a" and "g" are written the way children learn to write them, and look-alike letters such as I, l and 1 are easy to tell apart. For a reading app, that matters more than a decorative display font.
- **Sizes:** at least 24px on the child's screens, 32–40px bold for the greeting, and 28px bold for the Read button. Sentence case throughout, with short words.
- **Every visible label can be heard:** tapping it plays the word aloud.

## Floor for the build

- Touch targets at least 64px with generous gaps between them, because children's taps are less precise. The Read button should be far larger.
- With reduced motion turned on, the plant swaps between growth stages instead of animating.
- Nothing on the child's side depends only on text or only on colour; plants and icons carry the meaning too.
- An empty state for the first day: an empty plot with a seed packet and the prompt "Plant your first sprout — tap Read!"

## Check against generic defaults

- This avoids cream backgrounds with serif headings, gradient washes and grids of identical rounded cards.
- My first instinct was a grid of book covers with a progress ring. That would suit almost any kids' app, so I replaced it with the garden scene, which only fits Sprout.
- The font choice and the garden-as-progress idea both come from this brief, not a template.

## Questions before building

1. Is this tablet-first or phone-first? On a phone, the soil band would scroll sideways through past days.
2. Should the plants be flat and geometric (cheaper and consistent) or hand-drawn (warmer, but needs an illustrator)?

Not verified: nothing was rendered, because you asked for a direction without code.