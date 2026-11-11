# Sprout home screen: proposed visual direction

There's no design system in the repo yet (the README is the whole brief), so I based this on the subject. The users are 6–8-year-olds who are still learning to read, often on a tablet. The screen has one job: get them reading today. Parents set the goal but shouldn't take up space on this screen.

## The main idea: the screen is a garden bed

The home screen is a side view of a garden, not a dashboard. A soil line runs across the screen about 60% of the way down.

- **Above the ground:** the plants the child has earned, one for each day they met the goal, standing in a row. Today's spot shows a sprout that grows as they read. That growth is the progress bar, so a child who can't read numbers yet still sees how far they've come.
- **In the soil:** one large "Start reading" button, as if they're planting today's seed. It's at least 88px tall and spans most of the screen width.
- **Top right, small:** a "For grown-ups" button behind a simple parent check. Goals and settings live there, away from the child's screen.

This is the one bold choice. Everything else stays quiet: no card grid and no stats panel.

## Palette (5 colours, from a real garden)

| Name | Hex | Role |
|---|---|---|
| Sky | `#CFE8F6` | Page background above the soil line |
| Soil | `#5B3A29` | Ground area and all body text |
| Leaf | `#237A3F` | Plants and the progress sprout. Dark enough for text; the brighter `#2F8F4E` is fine for shapes only |
| Sunflower | `#FFC83D` | The main button. Soil-coloured text on it is about 6.7:1 contrast |
| Petal | `#D6456B` | Flowers that bloom on goal days, used sparingly |

I used a sky background on purpose instead of the usual cream, serif and terracotta. Sky and soil come from the scene itself.

## Type: one family, picked for early readers

- **Andika** (SIL) for everything. It was designed for literacy: it has the single-storey "a" and "g" that children learn to write, and "I", "l" and "1" are easy to tell apart.
- **Sizes:** at least 24px for any text a child reads, about 40px bold for the greeting and button label, and line length kept short.
- One family is deliberate. A second, novelty display font would undercut the readability the app exists to teach.

## Words

- Button: **"Start reading"**. After a session: **"Your sprout grew!"** Same verbs everywhere.
- First day (empty garden): bare soil with one seed and "Plant your first seed — read a story". There's only one action to take.

## Checked against the brief

- **Warm and playful:** comes from the scene and the colours, not from decoration.
- **Big touch targets:** one main button of 88px or more, and earned plants are tappable to replay that day's story.
- **Motion:** only the sprout grows, and only when it gets taller. With reduced motion turned on, it switches straight to the new height.

**One thing I'd remove:** a streak counter. Losing a streak feels like a punishment at this age, and the row of plants already shows their history without the guilt.

**Not verified:** nothing has been drawn or rendered, so the contrast figures are estimates from the hex values. They should be checked once real colours are in use.

I can turn this into a clickable mockup page if you'd like to see the garden-bed layout before anyone builds it.