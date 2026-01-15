# Slide Types Reference

## 1. Cover Slide

**Purpose:** Presentation start, title introduction
**Theme:** `.slide.blue`

```html
<div class="slide blue">
    <h1>Presentation<br>Title</h1>
    <p class="sub">Subtitle or one-line description</p>
    <p class="meta" style="color: rgba(255,255,255,0.4);">
        Presenter · Department · Date
    </p>
</div>
```

**Guidelines:**
- Title: 2 lines max
- Subtitle: 1-2 lines
- Meta: apply transparency

---

## 2. Section Divider

**Purpose:** Separate major sections
**Theme:** Any colored theme (`.violet`, `.mint`, `.orange`, `.rose`, etc.)

```html
<div class="slide violet">
    <h1>Section<br>Title</h1>
    <p class="sub">Brief section overview with <span class="em">emphasis</span></p>
</div>
```

---

## 3. Content with List

**Purpose:** Key points, agenda, features
**Theme:** `.slide` (dark) or `.slide.surface`

```html
<div class="slide surface">
    <h2>Section Title</h2>
    <ul class="list">
        <li><strong>Point 1</strong> — Description</li>
        <li><strong class="em">Highlighted</strong> — Important</li>
        <li><strong class="green">Success</strong> — Positive item</li>
        <li><strong class="red">Warning</strong> — Negative item</li>
    </ul>
</div>
```

---

## 4. Comparison Slide

**Purpose:** Before/after, pros/cons, options
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <h3>Comparison Title</h3>
    <div class="comp">
        <div class="comp-item red-on">
            <p class="tag">Before</p>
            <p>Previous state<br>or problem</p>
        </div>
        <div class="comp-item on">
            <p class="tag">After</p>
            <p>Current state<br>or solution</p>
        </div>
    </div>
</div>
```

**Multi-option comparison:**
```html
<div class="comp">
    <div class="comp-item">
        <p class="tag">Option A</p>
        <p>Description</p>
    </div>
    <div class="comp-item on">
        <p class="tag">Recommended</p>
        <p>Best choice</p>
    </div>
    <div class="comp-item">
        <p class="tag">Option C</p>
        <p>Description</p>
    </div>
</div>
```

---

## 5. Visual/Image Slide

**Purpose:** Diagrams, screenshots, concepts
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <img src="diagram.png" alt="Diagram"
        style="max-width: 35vw; max-height: 40vh; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
    <p class="sub">Caption or description</p>
</div>
```

**With title:**
```html
<div class="slide">
    <h3>Visual Title</h3>
    <img src="image.png" alt="Description"
        style="max-width: 32vw; max-height: 32vh; margin-bottom: 2vh; border-radius: 8px;">
    <p class="sub">Supporting text</p>
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
    <cite>— Name, Title</cite>
</div>
```

---

## 7. Statistics Slide

**Purpose:** Key metrics, data highlights
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <div class="stat">
        <p class="number">85%</p>
        <p class="label">Metric description</p>
    </div>
</div>
```

---

## 8. Grid Slide

**Purpose:** Features, categories, team
**Theme:** Any theme

```html
<div class="slide mint">
    <h3>Features Overview</h3>
    <div class="grid">
        <div class="grid-item" style="background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2);">
            <p class="name em">Feature 1</p>
            <p class="desc" style="color: rgba(255,255,255,0.7);">Description</p>
        </div>
        <div class="grid-item" style="background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.2);">
            <p class="name">Feature 2</p>
            <p class="desc" style="color: rgba(255,255,255,0.7);">Description</p>
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
        <span class="pipeline-arrow">→</span>
        <div class="pipeline-step green">Done</div>
    </div>
    <p class="sub">Process description</p>
</div>
```

---

## 10. Code Slide

**Purpose:** Technical demos, syntax examples
**Theme:** `.slide.surface`

```html
<div class="slide surface">
    <h3>Code Example</h3>
    <div class="code"><span class="comment">// Initialize configuration</span>
<span class="keyword">const</span> config = {
    theme: <span class="string">"dark"</span>,
    enabled: <span class="keyword">true</span>
};</div>
</div>
```

---

## 11. Table Slide

**Purpose:** Data comparison, specifications
**Theme:** `.slide.surface`

```html
<div class="slide surface">
    <h3>Comparison Table</h3>
    <table class="tbl">
        <tr><th>Feature</th><th>Basic</th><th>Pro</th></tr>
        <tr><td>Storage</td><td>10GB</td><td>100GB</td></tr>
        <tr><td>Support</td><td class="red">Email only</td><td class="green">24/7</td></tr>
    </table>
</div>
```

---

## 12. Warning/Tip Slide

**Purpose:** Important notices, helpful tips
**Theme:** `.slide` (dark)

```html
<div class="slide">
    <h3>Important Notes</h3>
    <div class="warn">
        <p>Warning: Critical caveat or caution message here.</p>
    </div>
    <div class="tip">
        <p>Tip: Helpful suggestion or positive note here.</p>
    </div>
</div>
```

---

## 13. Two Column Slide

**Purpose:** Side-by-side comparison, parallel content
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

1. **Start strong:** Cover (blue) → Section divider (colored)
2. **Build rhythm:** Alternate dark/surface/colored themes
3. **Data sandwich:** Context → Stat → Insight
4. **Visual breaks:** Insert image slides between text-heavy slides
5. **End with impact:** Quote → Summary → Closing (blue)

### Recommended Theme Pairings
| Content Type | Primary Theme | Accent Theme |
|--------------|---------------|--------------|
| Technical | surface | cyan |
| Business | dark | blue |
| Creative | dark | violet |
| Success story | dark | mint |
| Warning/Risk | dark | orange/rose |
| Learning | surface | indigo |
