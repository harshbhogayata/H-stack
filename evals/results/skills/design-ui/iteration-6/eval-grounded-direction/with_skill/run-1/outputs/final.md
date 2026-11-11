# Sprout home screen: proposed visual direction

The repo has only a README, which describes a reading-practice app for children aged 6–8. It asks for a warm, playful tone and big touch targets, and says there's no design system yet. So this direction is built from the subject itself: a child reading aloud to make a garden grow.

**Assumption:** the home screen is what the child sees, on a tablet or phone held upright. The parent's goal setting lives behind a parent lock. Tell me if the home screen is meant for parents instead, because that would change most of this.

## Main idea: the plant is the progress bar
The top half of the screen is a garden bed, drawn as a side view. Sky is at the top, a band of soil sits across the middle, and plants the child has already earned stand on the soil line. Today's spot holds a seed.

As the child reads, its roots grow down through the soil. When the parent's daily goal is reached, it breaks through and opens into a flower. There's no ring, number bar or streak flame. A 6-year-old can read a plant without needing to read a number.

This is the one bold element. Everything else stays quiet.

## Palette (6 colours)
| Name | Hex | Role |
|---|---|---|
| Morning sky | `#DDF0FB` | Background above ground |
| Soil | `#5A3A24` | Ground band, roots |
| Deep soil | `#3B2616` | All text and icons (about 12:1 contrast on sky) |
| Sun | `#FFC93C` | The one main button, with Deep soil text (about 9:1) |
| Leaf | `#2F9E44` | Plants and the "growing" state. Only for shapes and large type: about 3.4:1 on white, too low for small text |
| Berry | `#D6336C` | Flowers and celebration moments only |

White (`#FFFFFF`) is the book card surface. Dark mode is out of scope for a kids' daytime app unless you want it.

## Type
- **Fredoka** (rounded, chunky) for the greeting, button labels and plant names. Sizes: 32–40px headings, 24–28px buttons.
- **Andika** (SIL) for anything the child reads, including book titles and story text. It was designed for beginning readers: its "a" and "g" are drawn the simple way children learn to write them, and it keeps I, l and 1 distinct. Minimum 22px.
- Sentence case throughout. No all-caps labels.

## Layout, top to bottom
1. **Greeting row:** the child's avatar and "Hi, Sam!" on the left. A small, low-contrast parent icon on the right, protected by a press-and-hold parent lock.
2. **Garden bed (about 55% of the screen height):** sky, then the soil line, then plants sitting flat on the ground with no card shadows. Today's spot shows the seed and its roots. A small caption, "4 of 10 minutes", with leaf dots for children who count rather than read. Tapping the garden opens the full garden view.
3. **Today's book:** one card with the cover and title. Tap it to switch books.
4. **Read button:** full width, 80px tall, Sun yellow, with a book icon and the label "Read to your plant". It's pinned above the bottom safe area and is the only main action on the screen.

Every label has a small speaker icon that reads it aloud, for children who can't read it yet.

## Words
- Day one, empty garden: "Plant your first seed. Read to it!"
- Goal met: "Your sunflower bloomed!"
- Anything else on the screen is named the way children talk: "Your garden", "Read", never "Session" or "Streak".

## Checked against generic defaults
My first instinct was a progress ring, a streak flame and a grid of rounded cards. That's generic app gamification, so I replaced it with the plant growing in the soil. The direction also avoids the other common defaults: no cream background with a serif and terracotta accent, no all-caps labels, no fade-in on every section. The only motion is the plant growing and blooming.

## Accessibility requirements for when it's built
- Touch targets are at least 64px with at least 12px between them, larger than the 44px minimum because of the age group.
- Text meets WCAG AA contrast. Leaf green is never used for small text.
- Respect reduced motion: the bloom becomes a simple crossfade instead of a growth animation.
- Use `dvh` units for full-height layout and respect safe areas for the pinned button.
- Every icon-only button (parent lock, speaker) has an accessible name.
- Nothing irreversible is reachable from the child's screen.

**Not verified:** nothing was drawn or built, as you asked. The colour contrast figures are estimates and should be measured once the colours are in a theme file.