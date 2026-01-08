# Components Reference

## Text Components

### Headings (h1, h2, h3)
```html
<h1>Main Title - one or two lines max</h1>
<h2>Section Title - section start</h2>
<h3>Subsection - before detailed content</h3>
```

### Subtitle (.sub)
```html
<p class="sub">Supporting text with rhythm<br>Use line breaks intentionally</p>
```
- Auto-adapts to theme colors
- Use `<br>` for intentional line breaks

### Emphasis (.em, .red)
```html
<span class="em">Blue emphasis</span>
<span class="red">Warning/alert text</span>
```

### Meta (.meta)
```html
<p class="meta">Presenter · Department · Date</p>
```

## Quote Components

### Large Quote (blockquote)
```html
<blockquote>
    "Impactful quote - single powerful sentence"
</blockquote>
<cite>— Name, Title · Source</cite>
```
- Dark theme only
- Center aligned, max-width 760px

### Quote Box (.quote-box)
```html
<div class="quote-box">
    <p>"Quote content here"</p>
    <div class="author">— Source</div>
</div>
```
- Left blue border
- Background fill

## Comparison Components

### Compare Layout (.comp)
```html
<div class="comp">
    <div class="comp-item">
        <p class="tag">Before</p>
        <p>Previous state</p>
    </div>
    <div class="comp-item on">
        <p class="tag">After</p>
        <p>Current state</p>
    </div>
</div>
```
- `.on` class: active/highlight state (blue background)
- Tag: 10px uppercase, wide letter-spacing
- Mobile: vertical stack

### Negative Comparison (custom colors)
```html
<div class="comp-item" style="background: rgba(248,113,113,0.15); border-color: #F87171;">
    <p class="tag" style="color: #F87171;">Problem</p>
    <p style="color: #F87171;">Issue description</p>
</div>
```

## List Components

### Divider List (.list)
```html
<ul class="list">
    <li><strong>Bold item</strong> — description</li>
    <li>Regular item</li>
    <li><strong class="em">Blue bold</strong> — special item</li>
</ul>
```
- Max-width 580px
- Bottom dividers (except last)
- `<strong>`: white/black emphasis
- `<strong class="em">`: blue emphasis

## Grid Components

### Grid Layout (.grid)
```html
<div class="grid">
    <div class="grid-item">
        <p class="name em">Highlighted</p>
        <p class="desc">Description</p>
    </div>
    <div class="grid-item">
        <p class="name">Normal</p>
        <p class="desc">Description</p>
    </div>
</div>
```
- Flexbox, centered, auto-wrap
- Min-width 150px per item
- Mobile: vertical stack

## Pipeline Components

### Process Pipeline (.pipeline)
```html
<div class="pipeline">
    <div class="pipeline-step">Step 1</div>
    <span class="pipeline-arrow">→</span>
    <div class="pipeline-step on">Step 2</div>
    <span class="pipeline-arrow">→</span>
    <div class="pipeline-step">Step 3</div>
</div>
```
- `.on` class: active step (blue)
- Mobile: vertical with rotated arrows

## Image Components

### Image Placeholder (.img)
```html
<div class="img">
    <span class="label">Image Prompt</span>
    <p class="prompt">Minimalist style. Subject. Composition. Colors. Mood.</p>
</div>
```
- 16:9 aspect ratio
- Always include AI generation prompt

## Statistics Components

### Big Stat (.stat)
```html
<div class="stat">
    <p class="number">85%</p>
    <p class="label">Metric description</p>
</div>
```

### Big Background Number (.big)
```html
<p class="big">01</p>
```
- 25% opacity, decorative

## Table Components

### Data Table (.tbl)
```html
<table class="tbl">
    <tr><th>Header 1</th><th>Header 2</th></tr>
    <tr><td>Data 1</td><td>Data 2</td></tr>
</table>
```

## Code Components

### Code Block (.code)
```html
<div class="code">
    <span class="comment">// Comment</span>
    <span class="keyword">const</span> x = <span class="string">"value"</span>;
</div>
```

## Alert Components

### Warning Box (.warn)
```html
<div class="warn">
    <p>Warning message here</p>
</div>
```
- Yellow left border
- Light theme: yellow background

## Layout Components

### Two Column (.two-col)
```html
<div class="two-col">
    <div class="col">
        <h3>Left Column</h3>
        <ul class="list">...</ul>
    </div>
    <div class="col">
        <h3>Right Column</h3>
        <ul class="list">...</ul>
    </div>
</div>
```
- 60px gap
- Mobile: single column
