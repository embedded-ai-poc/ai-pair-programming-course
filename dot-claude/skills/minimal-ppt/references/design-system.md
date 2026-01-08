# Design System

## Color Palette

### Background Colors
```css
--bg-dark: #0A0A0F;       /* Dark theme background */
--bg-surface: #0F1015;    /* Surface theme background */
--bg-light: #F5F6FA;      /* Light theme background */
--bg-card-dark: #12141A;  /* Dark theme cards */
--bg-card-light: #EAECF2; /* Light theme cards */
```

### Border Colors
```css
--border-dark: #252830;   /* Dark theme borders */
--border-light: #D0D4E0;  /* Light theme borders */
```

### Text Colors
```css
--text-primary: #F0F0F5;  /* Dark theme body */
--text-secondary: #A0A8B8;/* Dark theme secondary */
--text-muted: #8890A0;    /* Dark theme muted */
--text-dim: #5A6070;      /* Very muted */
--text-dark: #0A0A0F;     /* Light theme body */
```

### Accent Colors
```css
--accent-blue: #4A8CFF;       /* Primary accent */
--accent-blue-light: #8AB8FF; /* Light accent */
--samsung-blue: #1428A0;      /* Samsung blue */
--red: #F87171;               /* Warning/alert */
--warning: #F59E0B;           /* Warning box */
```

### Blue Gradient
```css
background: linear-gradient(135deg, #0D1B3E 0%, #1428A0 100%);
```

## Typography

### Font Family
```css
font-family: 'Noto Sans KR', sans-serif;
```

### Font Weights
| Usage | Weight |
|-------|--------|
| Light text | 300 |
| Body | 400 |
| Bold/headings | 700 |
| Display | 900 |

### Heading Sizes (responsive clamp)
```css
h1 { font-size: clamp(2.8rem, 7vw, 5.5rem); }
h2 { font-size: clamp(2rem, 5vw, 3.5rem); }
h3 { font-size: clamp(1.4rem, 3vw, 2rem); }
```

### Body/Secondary Text
```css
.sub { font-size: clamp(1.05rem, 2vw, 1.3rem); }
blockquote { font-size: clamp(1.4rem, 3.5vw, 2.1rem); }
```

### Letter Spacing
```css
h1 { letter-spacing: -0.03em; }      /* Tight */
h2 { letter-spacing: -0.02em; }      /* Slightly tight */
h3 { letter-spacing: -0.01em; }      /* Normal */
.meta, cite { letter-spacing: 0.05em; } /* Wide */
.label { letter-spacing: 0.15em; }   /* Very wide */
```

### Line Height
```css
h1 { line-height: 1.12; }
h2 { line-height: 1.2; }
.sub { line-height: 1.9; }
blockquote { line-height: 1.7; }
.code { line-height: 1.8; }
```

## Spacing System

### Slide Padding
```css
.slide { padding: 80px; }
@media (max-width: 768px) { .slide { padding: 48px 28px; } }
```

### Margin Scale
| Size | Value | Usage |
|------|-------|-------|
| xs | 8px | Button gaps |
| sm | 12px | Pipeline gaps |
| md | 16px | Grid gaps |
| lg | 24px | Component gaps |
| xl | 32px | Section gaps |
| 2xl | 40px | Large element margins |
| 3xl | 48px | Component margins |
| 4xl | 60px | Column gaps |

## Component Dimensions

### Max Widths
```css
blockquote { max-width: 760px; }
.img { max-width: 680px; }
.list { max-width: 580px; }
.warn { max-width: 480px; }
.quote-box { max-width: 600px; }
.code { max-width: 700px; }
.two-col { max-width: 1000px; }
```

### Min Widths
```css
.comp-item { min-width: 200px; }
.grid-item { min-width: 150px; }
```

### Aspect Ratios
```css
.img { aspect-ratio: 16/9; }
```

## Theme Variations

### Dark Theme (default)
- Background: #0A0A0F
- Text: #F0F0F5
- Cards: #12141A
- Borders: #252830

### Surface Theme (.surface)
- Background: #0F1015
- Same text/card colors as dark

### Light Theme (.light)
- Background: #F5F6FA
- Text: #0A0A0F
- Cards: #EAECF2
- Borders: #D0D4E0
- Accent: #1428A0

### Blue Theme (.blue)
- Background: gradient
- Text: white
- Muted: rgba(255,255,255,0.7)
- Accent: #8AB8FF
