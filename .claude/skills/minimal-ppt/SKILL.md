---
name: minimal-ppt
description: |
  Professional HTML presentation generator with rich dark theme design.
  Creates polished, high-impact slides as single HTML files.
  Based on Samsung-style dark theme with multiple color themes.

  Triggers: "presentation", "slides", "ppt", "deck", "slideshow", "발표자료"
  Auto-triggers: presentation, slides, deck, keynote, pitch
---

# Minimal PPT Skill

> Generate professional HTML presentations with rich dark theme design and multiple color themes.

## When to Use

- Creating presentation slides, pitch decks
- Converting text content to visual slides
- Technical talks, conferences, training materials
- Any request mentioning: PPT, slides, presentation, deck, 발표자료

## Quick Start

Generate a presentation by writing a single HTML file using the template structure.

```bash
# Output to user's directory
Write presentation.html to current working directory
```

## Core Design Principles

### Less is More
- **One key message** per slide
- Embrace whitespace
- Minimize text, maximize visual impact

### Theme System

| Theme | Class | Background | Use Case |
|-------|-------|------------|----------|
| Dark | `.slide` | #0A0A0F | General content |
| Surface | `.slide.surface` | #18181B | Code, details |
| Light | `.slide.light` | #F5F6FA | Emphasis, transition |
| Blue | `.slide.blue` | #0F172A | Cover, section breaks |
| Mint | `.slide.mint` | #064E3B | Success, growth |
| Orange | `.slide.orange` | #7C2D12 | Warning, action |
| Violet | `.slide.violet` | #4C1D95 | Creative, innovation |
| Rose | `.slide.rose` | #881337 | Attention, important |
| Cyan | `.slide.cyan` | #164E63 | Tech, data |
| Indigo | `.slide.indigo` | #312E81 | Deep, thoughtful |
| Amber | `.slide.amber` | #78350F | Caution, highlight |

### Text Emphasis Classes

| Class | Color | Use Case |
|-------|-------|----------|
| `.em` | Blue (#5A9CFF) | Primary emphasis |
| `.red` | Red (#FF8080) | Warning, negative |
| `.green` | Green (#34D399) | Success, positive |
| `.yellow` | Yellow (#FCD34D) | Caution, highlight |

### Comparison Item States

| Class | Background | Use Case |
|-------|------------|----------|
| `.comp-item.on` | Blue | Recommended, current |
| `.comp-item.green-on` | Green | Success state |
| `.comp-item.yellow-on` | Yellow | Warning state |
| `.comp-item.red-on` | Red | Danger state |

## Slide Structure

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation Title</title>
    <!-- Include full CSS from template.html -->
</head>
<body>
    <div class="part-label">Presentation Label</div>
    <div class="slides">
        <div class="slide blue"><!-- Cover --></div>
        <div class="slide"><!-- Content --></div>
        <div class="slide mint"><!-- Section --></div>
    </div>
    <!-- Include navigation script -->
</body>
</html>
```

## Alert Boxes

### Warning Box (.warn)
```html
<div class="warn">
    <p>Warning message here</p>
</div>
```

### Tip Box (.tip)
```html
<div class="tip">
    <p>Helpful tip or positive note here</p>
</div>
```

## Image Usage

### Real Images
```html
<img src="image.png" alt="Description"
    style="max-width: 35vw; max-height: 40vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
```

### Image Placeholder (for AI generation prompts)
```html
<div class="img">
    <span class="label">Image Prompt</span>
    <p class="prompt">[Style]. [Subject]. [Composition]. [Colors]. [Mood].</p>
</div>
```

## Output Requirements

1. **Single HTML file** - All CSS inline in `<style>` tag
2. **Korean font support** - Include Noto Sans KR + JetBrains Mono
3. **Keyboard navigation** - Arrow keys to navigate
4. **Responsive** - Works on all screen sizes
5. **Part label** - Fixed label at top-left corner

## References

- `references/components.md` - All available components
- `references/design-system.md` - Colors, typography, spacing
- `references/slide-types.md` - Slide layout patterns
- `template.html` - Base HTML template with all styles

## Example Output

See `template.html` for the complete base template with all styles and components.

## Slide Sequencing Tips

1. **Start strong:** Cover (blue) -> Section divider (colored)
2. **Build rhythm:** Alternate dark/surface/colored themes
3. **Data sandwich:** Context -> Stat -> Insight
4. **Visual breaks:** Insert image slides between text-heavy slides
5. **End with impact:** Quote -> Summary -> Closing (blue)
