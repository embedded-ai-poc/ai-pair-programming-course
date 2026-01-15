# Components Reference

## Text Components

### Headings (h1, h2, h3)
```html
<h1>Main Title - cover slides, big statements</h1>
<h2>Section Title - section headers</h2>
<h3>Subsection - content slide titles</h3>
```

### Subtitle (.sub)
```html
<p class="sub">Supporting text with rhythm<br>Use line breaks intentionally</p>
```
- Auto-adapts to theme colors
- Use `<br>` for intentional line breaks

### Emphasis Classes
```html
<span class="em">Blue emphasis - primary highlight</span>
<span class="red">Red - warning, negative, danger</span>
<span class="green">Green - success, positive, good</span>
<span class="yellow">Yellow - caution, highlight, attention</span>
```

### Meta (.meta)
```html
<p class="meta">Presenter · Department · Date</p>
```

---

## Quote Components

### Large Quote (blockquote)
```html
<blockquote>
    "Impactful quote - single powerful sentence"
</blockquote>
<cite>— Name, Title</cite>
```

### Quote Box (.quote-box)
```html
<div class="quote-box">
    <p>"Quote content here with more detail"</p>
</div>
```
- Left blue border
- Background fill

---

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

### Comparison States
| Class | Background | Use Case |
|-------|------------|----------|
| `.comp-item` | Dark gray | Neutral/inactive |
| `.comp-item.on` | Blue | Active/recommended |
| `.comp-item.green-on` | Green | Success/positive |
| `.comp-item.yellow-on` | Yellow | Warning/caution |
| `.comp-item.red-on` | Red | Danger/negative |

---

## List Components

### Divider List (.list)
```html
<ul class="list">
    <li><strong>Bold item</strong> — description</li>
    <li>Regular item</li>
    <li><strong class="em">Blue bold</strong> — special item</li>
    <li><strong class="green">Success</strong> — positive item</li>
    <li><strong class="red">Warning</strong> — negative item</li>
</ul>
```

---

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

### Custom Grid Item Colors (for colored themes)
```html
<div class="grid-item" style="background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2);">
    <p class="name">Title</p>
    <p class="desc" style="color: rgba(255,255,255,0.7);">Description</p>
</div>
```

---

## Pipeline Components

### Process Pipeline (.pipeline)
```html
<div class="pipeline">
    <div class="pipeline-step">Step 1</div>
    <span class="pipeline-arrow">→</span>
    <div class="pipeline-step on">Step 2</div>
    <span class="pipeline-arrow">→</span>
    <div class="pipeline-step green">Done</div>
</div>
```

### Pipeline Step States
| Class | Color | Use Case |
|-------|-------|----------|
| `.pipeline-step` | Gray | Inactive step |
| `.pipeline-step.on` | Blue | Current/active step |
| `.pipeline-step.green` | Green | Completed/success |
| `.pipeline-step.red` | Red | Error/failed |

---

## Image Components

### Real Image
```html
<img src="image.png" alt="Description"
    style="max-width: 35vw; max-height: 40vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
```

### Image Placeholder (.img)
```html
<div class="img">
    <span class="label">Image Prompt</span>
    <p class="prompt">Minimalist style. Subject. Composition. Colors. Mood.</p>
</div>
```

---

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

---

## Table Components

### Data Table (.tbl)
```html
<table class="tbl">
    <tr><th>Header 1</th><th>Header 2</th></tr>
    <tr><td>Data 1</td><td class="green">Good</td></tr>
    <tr><td>Data 2</td><td class="red">Bad</td></tr>
</table>
```

---

## Code Components

### Code Block (.code)
```html
<div class="code"><span class="comment">// Comment</span>
<span class="keyword">const</span> x = <span class="string">"value"</span>;</div>
```

**Syntax Highlighting:**
- `.comment` - Gray (#7A8090)
- `.keyword` - Purple (#D4C5FF)
- `.string` - Green (#7EF7C7)

---

## Alert Components

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

---

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
