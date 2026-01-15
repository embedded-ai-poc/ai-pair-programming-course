# Design System

## Color Palette

### Background Themes
| Theme | Class | Background | Use Case |
|-------|-------|------------|----------|
| Dark | `.slide` | #0A0A0F | Default, general content |
| Surface | `.slide.surface` | #18181B | Code, details, secondary |
| Light | `.slide.light` | #F5F6FA | Emphasis, contrast |
| Blue | `.slide.blue` | #0F172A | Cover, section breaks |
| Mint | `.slide.mint` | #064E3B | Success, growth, eco |
| Orange | `.slide.orange` | #7C2D12 | Warning, action, energy |
| Violet | `.slide.violet` | #4C1D95 | Creative, innovation |
| Rose | `.slide.rose` | #881337 | Attention, important |
| Cyan | `.slide.cyan` | #164E63 | Tech, data, cool |
| Indigo | `.slide.indigo` | #312E81 | Deep, thoughtful |
| Amber | `.slide.amber` | #78350F | Caution, highlight |

### Text Colors
```css
--text-primary: #F0F0F5;     /* Dark theme body */
--text-secondary: #D0D8E8;   /* Dark theme subtitle */
--text-muted: #A0A8B8;       /* Dark theme muted */
--text-dim: #6A7080;         /* Very muted */
--text-dark: #0A0A0F;        /* Light theme body */
--text-dark-sub: #3A4558;    /* Light theme subtitle */
```

### Accent Colors
```css
--accent-blue: #5A9CFF;      /* Primary emphasis */
--accent-blue-light: #8AB8FF;/* Light accent (colored themes) */
--samsung-blue: #1428A0;     /* Samsung blue (active states) */
--red: #FF8080;              /* Warning/negative */
--green: #34D399;            /* Success/positive */
--yellow: #FCD34D;           /* Caution/highlight */
```

### Theme-specific Emphasis
| Theme | .em Color |
|-------|-----------|
| Default | #5A9CFF |
| Light | #1428A0 |
| Blue | #8AB8FF |
| Mint | #6EE7B7 |
| Orange | #FED7AA |
| Violet | #C4B5FD |
| Rose | #FDA4AF |
| Cyan | #67E8F9 |
| Indigo | #A5B4FC |
| Amber | #FDE68A |

---

## Typography

### Font Families
```css
font-family: 'Noto Sans KR', sans-serif;  /* Body text */
font-family: 'JetBrains Mono', 'Consolas', monospace;  /* Code */
```

### Font Weights
| Usage | Weight |
|-------|--------|
| Light text | 300 |
| Body | 400 |
| Semi-bold | 500 |
| Bold/headings | 700 |
| Display | 900 |

### Heading Sizes (responsive clamp)
```css
h1 { font-size: clamp(4rem, 8vw, 8rem); }
h2 { font-size: clamp(3rem, 6vw, 5.5rem); }
h3 { font-size: clamp(3.2rem, 5vw, 4.5rem); }
```

### Body/Secondary Text
```css
.sub { font-size: clamp(2rem, 3vw, 2.8rem); }
.list li { font-size: clamp(1.8rem, 2.5vw, 2.4rem); }
.code { font-size: clamp(1.3rem, 1.5vw, 1.6rem); }
blockquote { font-size: clamp(2rem, 4vw, 3rem); }
```

### Letter Spacing
```css
h1 { letter-spacing: -0.03em; }      /* Tight */
h2 { letter-spacing: -0.02em; }      /* Slightly tight */
h3 { letter-spacing: -0.01em; }      /* Normal */
.meta { letter-spacing: 0.05em; }    /* Wide */
.tag { letter-spacing: 0.15em; }     /* Very wide */
```

### Line Height
```css
h1 { line-height: 1.1; }
h2 { line-height: 1.15; }
.sub { line-height: 1.6; }
.list li { line-height: 1.4; }
.code { line-height: 1.7; }
blockquote { line-height: 1.6; }
```

---

## Spacing System

### Slide Padding
```css
.slide { padding: 5vh 6vw; }
@media (max-width: 768px) { .slide { padding: 32px 28px 72px 28px; } }
```

### Margin Scale
| Size | Value | Usage |
|------|-------|-------|
| xs | 10px | Small gaps |
| sm | 14px | Pipeline gaps |
| md | 20px | Grid gaps |
| lg | 24px | Component gaps |
| xl | 2.5vh | Section margins |
| 2xl | 3vh | Large margins |
| 3xl | 4vh | Extra large |

---

## Component Dimensions

### Max Widths
```css
.list { max-width: 85vw; }
.code { max-width: 90vw; width: 94%; }
.quote-box { max-width: 85vw; }
.warn, .tip { max-width: 85vw; }
blockquote { max-width: 80vw; }
.img { max-width: 680px; }
.two-col { max-width: 90vw; }
```

### Min Widths
```css
.comp-item { min-width: 220px; }
.grid-item { min-width: 200px; }
```

### Aspect Ratios
```css
.img { aspect-ratio: 16/9; }
```

---

## Border & Shadow

### Border Colors
```css
--border-dark: #3F3F46;      /* Dark theme borders */
--border-surface: #52525B;   /* Surface borders */
--border-light: #D0D4E0;     /* Light theme borders */
```

### Border Radius
```css
border-radius: 4px;   /* Components */
border-radius: 8px;   /* Navigation, images */
border-radius: 12px;  /* Large images, quote-box ends */
```

### Shadows
```css
box-shadow: 0 10px 30px rgba(0,0,0,0.3);  /* Image shadow */
```

---

## Navigation

### Button Style
```css
.nav button {
    width: 56px;
    height: 56px;
    background: transparent;
    border: 2px solid #353840;
    color: #7A8090;
    border-radius: 8px;
}

.nav button:hover {
    border-color: #5A9CFF;
    color: #5A9CFF;
}
```

### Progress Bar
```css
.progress {
    height: 3px;
    background: #5A9CFF;
}
```

### Part Label
```css
.part-label {
    font-size: 1.1rem;
    color: #5A6070;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
```
