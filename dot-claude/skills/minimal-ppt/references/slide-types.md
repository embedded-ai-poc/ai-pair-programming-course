# Slide Types Reference

## 1. Cover Slide

**Purpose:** Presentation start, title introduction
**Theme:** `.slide.blue`

```html
<div class="slide blue">
    <h1>Presentation Title</h1>
    <p class="sub">Subtitle or one-line description</p>
    <p class="meta" style="color: rgba(255,255,255,0.4);">
        Presenter · Department · Date
    </p>
</div>
```

**Guidelines:**
- Title: 2 lines max
- Subtitle: 1 line
- Meta: apply transparency

---

## 2. Section Divider

**Purpose:** Separate major sections
**Theme:** `.slide.blue` or `.slide.light`

```html
<div class="slide blue">
    <p class="big">01</p>
    <h2>Section Name</h2>
    <p class="sub">Brief section overview</p>
</div>
```

---

## 3. Content with List

**Purpose:** Key points, agenda, features
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <h2>Section Title</h2>
    <ul class="list">
        <li><strong>Point 1</strong> — Description</li>
        <li><strong>Point 2</strong> — Description</li>
        <li><strong class="em">Highlighted</strong> — Important</li>
    </ul>
</div>
```

---

## 4. Comparison Slide

**Purpose:** Before/after, pros/cons
**Theme:** `.slide` (dark) or `.slide.light`

```html
<div class="slide">
    <h3>Comparison Title</h3>
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
</div>
```

---

## 5. Visual/Image Slide

**Purpose:** Diagrams, screenshots, concepts
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <h3>Visual Title</h3>
    <div class="img">
        <span class="label">Image Prompt</span>
        <p class="prompt">Style. Subject. Composition. Colors. Mood.</p>
    </div>
    <p class="sub">Caption or description</p>
</div>
```

---

## 6. Quote Slide

**Purpose:** Testimonials, key statements
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <blockquote>
        "Powerful quote that captures<br>your key message."
    </blockquote>
    <cite>— Name, Title · Source</cite>
</div>
```

---

## 7. Statistics Slide

**Purpose:** Key metrics, data highlights
**Theme:** `.slide` (dark) or `.slide.light`

```html
<div class="slide">
    <div class="stat">
        <p class="number">85%</p>
        <p class="label">Metric description</p>
    </div>
</div>
```

**Multiple stats:**
```html
<div class="slide">
    <div class="grid">
        <div class="stat">
            <p class="number" style="font-size: 3rem;">42%</p>
            <p class="label">Metric 1</p>
        </div>
        <div class="stat">
            <p class="number" style="font-size: 3rem;">3.5x</p>
            <p class="label">Metric 2</p>
        </div>
    </div>
</div>
```

---

## 8. Grid Slide

**Purpose:** Features, team, categories
**Theme:** `.slide.light` or `.slide`

```html
<div class="slide light">
    <h3>Features Overview</h3>
    <div class="grid">
        <div class="grid-item">
            <p class="name em">Feature 1</p>
            <p class="desc">Description</p>
        </div>
        <div class="grid-item">
            <p class="name">Feature 2</p>
            <p class="desc">Description</p>
        </div>
    </div>
</div>
```

---

## 9. Pipeline/Process Slide

**Purpose:** Workflows, timelines, steps
**Theme:** `.slide.surface`

```html
<div class="slide surface">
    <h3>Process Flow</h3>
    <div class="pipeline">
        <div class="pipeline-step">Step 1</div>
        <span class="pipeline-arrow">→</span>
        <div class="pipeline-step on">Step 2</div>
        <span class="pipeline-arrow">→</span>
        <div class="pipeline-step">Step 3</div>
    </div>
</div>
```

---

## 10. Code Slide

**Purpose:** Technical demos, syntax
**Theme:** `.slide.surface`

```html
<div class="slide surface">
    <h3>Code Example</h3>
    <div class="code">
        <span class="comment">// Initialize</span>
        <span class="keyword">const</span> config = {
            theme: <span class="string">"dark"</span>
        };
    </div>
</div>
```

---

## 11. Two Column Slide

**Purpose:** Side-by-side comparison, details
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <div class="two-col">
        <div class="col">
            <h3>Left Title</h3>
            <ul class="list">
                <li>Item 1</li>
                <li>Item 2</li>
            </ul>
        </div>
        <div class="col">
            <h3>Right Title</h3>
            <ul class="list">
                <li>Item A</li>
                <li>Item B</li>
            </ul>
        </div>
    </div>
</div>
```

---

## 12. Warning/Notice Slide

**Purpose:** Important notices, caveats
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <h2>Important Notice</h2>
    <div class="warn">
        <p>Warning message or important caveat here.</p>
    </div>
</div>
```

---

## 13. Table Slide

**Purpose:** Data comparison, specs
**Theme:** `.slide.surface`

```html
<div class="slide surface">
    <h3>Comparison Table</h3>
    <table class="tbl">
        <tr><th>Feature</th><th>Basic</th><th>Pro</th></tr>
        <tr><td>Storage</td><td>10GB</td><td>100GB</td></tr>
        <tr><td>Support</td><td>Email</td><td>24/7</td></tr>
    </table>
</div>
```

---

## 14. Closing Slide

**Purpose:** Thank you, Q&A, contact
**Theme:** `.slide.blue`

```html
<div class="slide blue">
    <h1>Thank You</h1>
    <p class="sub">Questions?</p>
    <p class="meta" style="color: rgba(255,255,255,0.4);">
        email@example.com
    </p>
</div>
```

---

## Slide Sequencing Tips

1. **Start strong:** Cover → Section divider
2. **Build rhythm:** Alternate dark/light themes
3. **Data sandwich:** Context → Stat → Insight
4. **Visual breaks:** Insert image slides between text-heavy slides
5. **End with impact:** Quote → Summary → Closing
