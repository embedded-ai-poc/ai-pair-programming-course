---
name: minimal-ppt
description: |
  Minimal HTML presentation generator with Samsung-style dark theme.
  Creates polished, professional slides as single HTML files.

  Triggers: "presentation", "slides", "ppt", "deck", "slideshow"
  Auto-triggers: presentation, slides, deck, keynote, pitch
---

# Minimal PPT Skill

> Generate professional HTML presentations with minimal dark theme design.

## When to Use

- Creating presentation slides, pitch decks
- Converting text content to visual slides
- Technical talks, conferences, training materials
- Any request mentioning: PPT, slides, presentation, deck

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
| Surface | `.slide.surface` | #0F1015 | Code, details |
| Light | `.slide.light` | #F5F6FA | Emphasis, transition |
| Blue | `.slide.blue` | Gradient | Cover, section breaks |

## Slide Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Presentation Title</title>
    <!-- Include full CSS from template.html -->
</head>
<body>
    <div class="slides">
        <div class="slide blue"><!-- Cover --></div>
        <div class="slide"><!-- Content --></div>
        <div class="slide light"><!-- Emphasis --></div>
    </div>
    <!-- Include navigation script -->
</body>
</html>
```

## Image Placeholder Rules

Always include AI generation prompts in image placeholders:

```html
<div class="img">
    <span class="label">Image Prompt</span>
    <p class="prompt">[Style]. [Subject]. [Composition]. [Colors]. [Mood].</p>
</div>
```

**Prompt Structure:**
- Style: `Minimalist line art`, `Simple geometric`, `Isometric 3D`
- Subject: Main object or concept
- Composition: `Centered`, `Top-down view`, `Side profile`
- Colors: `Monochrome blue`, `Dark with accent`, `White background`
- Mood: `Professional`, `Futuristic`, `Clean tech`

## Output Requirements

1. **Single HTML file** - All CSS inline in `<style>` tag
2. **Korean font support** - Include Noto Sans KR
3. **Keyboard navigation** - Arrow keys to navigate
4. **Responsive** - Works on all screen sizes

## References

- `references/components.md` - All available components
- `references/design-system.md` - Colors, typography, spacing
- `references/slide-types.md` - Slide layout patterns
- `template.html` - Base HTML template

## Example Output

See `template.html` for the complete base template with all styles and components.
