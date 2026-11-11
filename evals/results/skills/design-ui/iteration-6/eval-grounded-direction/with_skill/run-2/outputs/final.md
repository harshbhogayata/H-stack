# Sprout home screen: visual direction

The repo has only a README and no design system, so I based this on the brief: children aged 6–8 reading aloud, parents set a daily goal, kids grow a garden. Most of the time the person using the home screen is a child who reads little or not at all yet. They'll often hold a tablet, with a parent nearby. So the screen should explain itself through pictures and sound, and use as few words as possible.

## The main idea: the garden is the home screen

Today's plant is the progress bar. A six-year-old can't read a progress ring or a percentage, but they can see that a seed has become a sprout and that the next step is a flower. The daily goal is split into four stages: seed → sprout → bud → bloom. Each reading session moves the plant up one stage.

## Layout (portrait, tablet first, works on a phone)

1. **Sky band (top, about 15%).** A big "Hi, Maya!" with the child's avatar. In the top-right corner is a small, quiet **Grown-ups** button, protected by a hold-to-open or simple sum gate so kids don't wander into settings.
2. **Today's plant (centre, about 45%).** One large illustrated plant in a pot, showing its current stage. Underneath is one short line, "2 more stories to bloom!", with a speaker button that reads it aloud. That's the only sentence on the screen.
3. **Read button (thumb zone).** A wide green **Read** button with a book icon, at least 96px tall. It's the only main action on the screen.
4. **Garden bed (bottom strip).** A soil strip that scrolls sideways, with one plant for each day the goal was met. Tapping a plant shows the story read that day. Missed days are just bare soil, never wilted or dead plants. No punishment for skipped days.

Every label has an icon and can be tapped to hear it. Touch targets are at least 64px, larger than adult guidelines because younger children are less precise with their fingers.

## Palette (taken from the garden itself)

| Name | Hex | Role |
|---|---|---|
| Morning sky | `#DFF1FB` | Page background, top band |
| Loam | `#6B4A2F` | Garden-bed soil, pots |
| Leaf | `#2E8540` | Read button, main actions (white text ≈ 4.6:1, passes AA) |
| Marigold | `#FFC83D` | Reward moments, the bloom stage; only as a fill, never as text |
| Petal | `#E8578A` | Flowers, celebrations |
| Bark | `#2B2118` | All text (very high contrast on sky) |

I checked this against the usual generated-design looks: no cream and terracotta, no dark theme with one neon accent, and no rainbow of primary colours. The colours come from the subject.

## Type

- **One family: Andika** (SIL, free). It was designed for beginning readers, with single-storey "a" and "g" like the letters children learn to write at school. In a reading app this matters more than personality.
- **Scale for children's screens:** greeting 44, labels 28, smallest text 20. Bold weight for the greeting and button. There are no small grey captions on children's screens.
- The grown-ups area can drop to normal adult sizes using the same family.

## Motion (one moment only)

When the child comes back from reading, the plant grows one stage, with a short wiggle and a few leaves popping out. Nothing else on the screen moves. With reduced motion turned on, it becomes a crossfade to the new stage.

## What I changed after checking the plan

My first draft was the usual children's app: bright primary colours, a grid of rounded cards, a progress ring and a star counter. I could have produced that for any children's app, and the ring and number mean nothing to a six-year-old. I replaced the ring with the plant stages and dropped the card grid for one main action. I also removed a separate rewards or currency counter, because the garden already is the reward.

## Words

- **Read**, **My garden** and **Grown-ups** are the only names on the screen, and the same names are used throughout the app.
- Messages encourage and never scold. "Your sprout is thirsty for a story!" is fine. "You missed your goal" is not.

## Questions for you

- Is the main device a tablet or a phone? This sets how tall the garden strip should be.
- Should the child ever see the goal as a number, such as "10 min"? I've assumed only parents see it.

**Not verified:** nothing has been drawn or rendered, so I haven't seen the layout. The contrast figures are hand calculations, not tool checks. The safe-area insets, `dvh` sizing and visible focus states from the checklist still need checking once a mock-up or build exists.

I can turn this into a one-page visual mock-up to share with the team if that would help.