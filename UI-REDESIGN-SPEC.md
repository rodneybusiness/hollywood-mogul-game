# Hollywood Mogul UI Redesign Specification

## The Four-Expert Team

| Expert | Focus | Key Question |
|--------|-------|--------------|
| **Game Designer (GD)** | Player joy & engagement | "Does this make players feel something?" |
| **Systems Architect (SA)** | Elegant implementation | "Does this create emergent depth?" |
| **Playtest Analyst (PA)** | Reality & polish | "Does this actually work in practice?" |
| **Frontend/UI Designer (UD)** | Visual excellence | "Does this look and feel extraordinary?" |

---

## Design Philosophy

### Core Principle: Art Deco Modernized

We keep the **1930s Art Deco glamour** as our foundation while adding **modern UI patterns** for better usability:

| Keep (Art Deco DNA) | Add (Modern Patterns) |
|---------------------|----------------------|
| Gold/black palette | Glassmorphism panels |
| Playfair Display headings | Better information hierarchy |
| Cinzel accent text | Micro-animations |
| Film grain texture | Responsive component system |
| Elegant borders | KPI cards with sparklines |
| Period typography | Contextual tooltips |

### The Feel We Want

> "Walking into a 1930s movie palace that somehow has a Bloomberg terminal"

- **Glamorous** - Gold accents, dramatic typography, theatrical presentation
- **Informative** - Dense but scannable data, clear visual hierarchy
- **Responsive** - Smooth transitions, satisfying interactions
- **Period-Authentic** - Nothing that breaks the 1930s illusion

---

## Design Tokens (Art Deco + Modern)

```css
:root {
  /* ===== ART DECO PALETTE (Preserved) ===== */
  --gold-primary: #B8860B;
  --gold-secondary: #DAA520;
  --gold-bright: #F7C96B;
  --black-deep: #0A0A0A;
  --black-elevated: #1A1A1A;
  --ivory: #FFFFF0;
  --ivory-muted: #A1A7D9;

  /* Semantic Colors */
  --danger: #8B0000;
  --success: #006400;
  --warning: #FF8C00;
  --info: #3CB3FF;

  /* ===== NEW: Glassmorphism ===== */
  --glass-panel: rgba(26, 26, 26, 0.85);
  --glass-elevated: rgba(40, 40, 40, 0.90);
  --glass-blur: 12px;
  --border-subtle: rgba(184, 134, 11, 0.3);
  --border-strong: rgba(184, 134, 11, 0.6);

  /* ===== NEW: Accent Colors (Genre-Coded) ===== */
  --accent-comedy: #25D2D0;
  --accent-horror: #FF4560;
  --accent-drama: #F7C96B;
  --accent-action: #FF3F8E;
  --accent-noir: #8E7CFF;
  --accent-musical: #FFB347;
  --accent-western: #CD853F;

  /* ===== TYPOGRAPHY (Enhanced) ===== */
  --font-display: 'Playfair Display', serif;
  --font-accent: 'Cinzel', serif;
  --font-body: 'Lato', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Type Scale */
  --text-display-xl: 2.5rem;  /* 40px - Hero numbers */
  --text-display-lg: 2rem;    /* 32px - Section titles */
  --text-h1: 1.5rem;          /* 24px - Panel headers */
  --text-h2: 1.25rem;         /* 20px - Card titles */
  --text-h3: 1.125rem;        /* 18px - Subheadings */
  --text-body: 1rem;          /* 16px - Body text */
  --text-small: 0.875rem;     /* 14px - Secondary text */
  --text-micro: 0.75rem;      /* 12px - Labels */

  /* ===== SPACING (8px Grid) ===== */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */

  /* ===== EFFECTS ===== */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow-gold: 0 0 20px rgba(184, 134, 11, 0.4);
  --shadow-glow-danger: 0 0 20px rgba(139, 0, 0, 0.4);
  --shadow-glow-success: 0 0 20px rgba(0, 100, 0, 0.4);

  /* ===== MOTION ===== */
  --motion-fast: 120ms;
  --motion-normal: 200ms;
  --motion-slow: 350ms;
  --easing-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  /* ===== BORDERS ===== */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

---

## Component Library

### Atoms (Base Elements)

#### 1. KPI Card
The primary way to display important numbers.

```
┌─────────────────────────────┐
│  CASH ON HAND          [i] │  ← Label (Cinzel, gold, small)
│                             │
│  $410,000                   │  ← Value (Playfair, ivory, display-lg)
│  ▲ +$52,000 this month      │  ← Trend (small, success/danger color)
│  ════════════════           │  ← Sparkline (optional)
└─────────────────────────────┘
```

**Variants**: `default`, `danger` (red glow), `success` (green glow), `highlight` (gold border pulse)

#### 2. Button
```
┌──────────────────┐
│   GREENLIGHT     │  ← Primary: Gold gradient bg, black text
└──────────────────┘

┌──────────────────┐
│   DISTRIBUTE     │  ← Secondary: Transparent, gold border
└──────────────────┘

┌──────────────────┐
│   CANCEL         │  ← Ghost: No border, gold text
└──────────────────┘
```

#### 3. Chip/Tag
For genres, status, filters.
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ DRAMA   │  │ COMEDY  │  │ HORROR  │
└─────────┘  └─────────┘  └─────────┘
    ↑            ↑            ↑
  gold        teal         crimson
```

#### 4. Progress Bar
For production progress, runway, etc.
```
PRODUCTION PROGRESS
████████████░░░░░░░░░░░░  45%
         12 weeks remaining
```

### Molecules (Composed Components)

#### 5. Film Card
```
┌─────────────────────────────────────┐
│ [DRAMA]                    $75,000  │  ← Genre chip + Budget
│                                     │
│ THE LOST WEEKEND                    │  ← Title (Playfair, gold)
│ Directed by Billy Wilder            │  ← Credits (Lato, muted)
│                                     │
│ ████████████████░░░░░░  75%        │  ← Progress
│          4 weeks remaining          │
│                                     │
│ Quality: ████████░░ 8.2            │  ← Quality meter
│                                     │
│ ┌──────────┐  ┌──────────┐         │
│ │ DETAILS  │  │DISTRIBUTE│         │  ← Actions
│ └──────────┘  └──────────┘         │
└─────────────────────────────────────┘
```

#### 6. Talent Card
```
┌─────────────────────────────────────┐
│ ┌─────┐  HUMPHREY BOGART           │
│ │ 👤  │  ★★★★★ A-List              │  ← Star rating
│ └─────┘  Drama • Noir • Crime      │  ← Specialties
│                                     │
│  Salary: $15,000/film              │
│  Status: AVAILABLE                  │  ← Green badge
│  Loyalty: ████████░░               │
│                                     │
│     ┌────────────┐                  │
│     │   CAST     │                  │
│     └────────────┘                  │
└─────────────────────────────────────┘
```

#### 7. Event Card
```
┌─────────────────────────────────────┐
│ ⚡ HISTORICAL EVENT                  │
│                                     │
│ THE HAYS CODE                       │  ← Title (Playfair, gold)
│ July 1934                           │
│                                     │
│ The Production Code Administration  │
│ begins strict enforcement of        │
│ content guidelines...               │
│                                     │
│ IMPACT: All films now require       │
│ PCA approval before release.        │
│                                     │
│     ┌────────────┐                  │
│     │ ACKNOWLEDGE│                  │
│     └────────────┘                  │
└─────────────────────────────────────┘
```

#### 8. Alert Item
```
┌─────────────────────────────────────┐
│ ⚠️  RUNWAY WARNING                   │  ← Icon + Title
│                                     │
│ Only 12 weeks of cash remaining.    │
│ Consider reducing overhead or       │
│ releasing a film soon.              │
│                               [→]   │  ← Action arrow
└─────────────────────────────────────┘
```

### Organisms (Screen Sections)

#### 9. Dashboard Hero (KPI Row)
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ CASH ON HAND│ MONTHLY BURN│   RUNWAY    │ REPUTATION  │
│  $410,000   │  -$30,000   │  54 weeks   │    72/100   │
│  ▲ +$52k    │  ─ steady   │  ▼ -2 wks   │   ▲ +5      │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### 10. Production Slate
Horizontal scrollable row of Film Cards.
```
┌──────────────────────────────────────────────────────────┐
│ FILMS IN PRODUCTION (3)                            [+]   │
├──────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                     │
│ │ Film 1  │ │ Film 2  │ │ Film 3  │     ← scroll →      │
│ │  45%    │ │  78%    │ │  12%    │                     │
│ └─────────┘ └─────────┘ └─────────┘                     │
└──────────────────────────────────────────────────────────┘
```

#### 11. Navigation Rail
Vertical side navigation (collapsed by default on mobile).
```
┌─────┐
│ 🏢  │  DASHBOARD
├─────┤
│ 📜  │  SCRIPTS
├─────┤
│ 🎬  │  STUDIO
├─────┤
│ 💰  │  FINANCES
├─────┤
│ 🎭  │  TALENT
├─────┤
│ 📊  │  MARKET
├─────┤
│ 🏆  │  AWARDS
├─────┤
│ ⚙️  │  SETTINGS
└─────┘
```

---

## Screen Layouts

### Dashboard (Studio HQ)

```
┌────────────────────────────────────────────────────────────────┐
│  MOGUL PICTURES                            January 1933        │
│  Est. 1933                                 Pre-Code Era        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────┬─────────┬─────────┬─────────┐                    │
│  │  CASH   │  BURN   │ RUNWAY  │  REP    │  ← KPI Hero Row    │
│  │ $410k   │ -$30k   │ 54 wks  │  72     │                    │
│  └─────────┴─────────┴─────────┴─────────┘                    │
│                                                                │
│  ┌────────────────────────────┬───────────────────────────┐   │
│  │ FILMS IN PRODUCTION        │ NEXT BIG DECISION         │   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐   │                           │   │
│  │ │Film1│ │Film2│ │Film3│   │ "The Lost Weekend" is     │   │
│  │ └─────┘ └─────┘ └─────┘   │ ready for distribution.   │   │
│  │                            │                           │   │
│  │ [REVIEW SCRIPTS]           │ [DISTRIBUTE NOW]          │   │
│  └────────────────────────────┴───────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────┬───────────────────────────┐   │
│  │ IN THEATERS                │ ALERTS                    │   │
│  │ "Casablanca"   Week 3/10   │ ⚠️ Runway warning         │   │
│  │  $245,000 gross            │ 📋 New scripts available  │   │
│  │                            │ 🏆 Achievement unlocked   │   │
│  └────────────────────────────┴───────────────────────────┘   │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  [ADVANCE WEEK]  [ADVANCE MONTH]           [SAVE]  [LOAD]     │
└────────────────────────────────────────────────────────────────┘
```

### Project Planner (New Screen)

```
┌────────────────────────────────────────────────────────────────┐
│  PROJECT PLANNER                                               │
├────────────────────────────────────────────────────────────────┤
│  FILTERS: [All] [In Production] [Completed] [In Theaters]     │
│                                                                │
│  TIMELINE VIEW                                                 │
│  ────────────────────────────────────────────────────────────  │
│  Jan 1933 ─────────────────────────────────── Dec 1933        │
│                                                                │
│  ██████████████░░░░░░░░░░░░  "The Big Sleep"   Feb-Jun        │
│       ████████████████░░░░░  "Casablanca"      Mar-Aug        │
│            ██████████████████████  "Maltese"   Apr-Oct        │
│                    ░░░░░░░░░░░░░░░░░░░░░░░░░   (available)    │
│                                                                │
│  CONTROLS                                                      │
│  ┌────────────────┬────────────────┬────────────────┐         │
│  │ BUDGET SLIDER  │ QUALITY TARGET │ RELEASE DATE   │         │
│  │ $50k ───●── $2M│ ░░░●░░░░░░ 7.5 │ [Summer '33]   │         │
│  └────────────────┴────────────────┴────────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

### Market Trends (New Screen)

```
┌────────────────────────────────────────────────────────────────┐
│  MARKET TRENDS                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  GENRE HEAT MAP                          AUDIENCE SENTIMENT    │
│  ┌────────────────────────────┐         ┌──────────────────┐  │
│  │ Drama     ████████████ HOT │         │                  │  │
│  │ Comedy    ██████████░░     │         │    ◐  72%       │  │
│  │ Horror    ████░░░░░░░░     │         │   OPTIMISTIC    │  │
│  │ Musical   ███████████░ ↑   │         │                  │  │
│  │ Western   █████░░░░░░░ ↓   │         └──────────────────┘  │
│  │ Noir      ░░░░░░░░░░░░ N/A │                               │
│  └────────────────────────────┘                               │
│                                                                │
│  UPCOMING EVENTS                                               │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Jul 1934 │ HAYS CODE ENFORCEMENT │ Censorship tightens │   │
│  │ Dec 1941 │ PEARL HARBOR          │ War production      │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## Implementation Approach

### Phase 1: CSS Variable Modernization (No JS Changes)
1. Update `:root` with new design tokens
2. Add glassmorphism panel styles
3. Add genre accent color classes
4. Improve existing component styles
5. **Timeline**: 1-2 days

### Phase 2: Component Refactoring (Minimal JS)
1. Create reusable CSS component classes
2. Update dashboard.js to use new classes
3. Add KPI trend indicators
4. Improve card layouts
5. **Timeline**: 2-3 days

### Phase 3: New Screen Components (JS + HTML)
1. Build genre heat display
2. Build financial forecast widget
3. Build production calendar
4. Add to navigation
5. **Timeline**: 3-5 days

### Phase 4: Polish & Animation
1. Add micro-animations
2. Add hover states
3. Add loading states
4. Performance optimization
5. **Timeline**: 1-2 days

---

## Expert Verdicts on UI Redesign

### Game Designer (GD)
> "The Art Deco theme IS the game's identity - don't lose it. But the current UI doesn't celebrate wins enough. Film premieres should feel like Oscar night. Bankruptcy should feel like the end of an era. Add drama through motion and emphasis."

### Systems Architect (SA)
> "Keep vanilla JS for now - no React migration needed. The component patterns can be achieved with CSS classes and template literals. Focus on CSS variables for theming, BEM-style class naming for components."

### Playtest Analyst (PA)
> "Players struggle with information overload. The redesign should surface the 3 most important things: Cash runway, active productions, next decision. Everything else is secondary. Test: Can a player answer 'how am I doing?' in 3 seconds?"

### Frontend/UI Designer (UD)
> "Art Deco is perfect for this game. Modernize with glassmorphism (period-neutral effect), better typography hierarchy, and genre-coded colors. The gold should glow on important elements. Every panel should feel like a movie poster."

---

## When UI Work Happens

The UI Redesign is a **cross-cutting concern** that enhances all 20 improvements:

```
CHAIN A (Feel the Stakes)
  └── UI makes premieres dramatic, awards glamorous

CHAIN B (Master the Craft)
  └── UI shows production decisions clearly

CHAIN C (Live the Era)
  └── UI themes shift with historical periods

CHAIN D (See Your Empire)
  └── UI IS the dashboard/calendar/forecast

CHAIN E (Own the Experience)
  └── UI enables settings and customization
```

### Recommended Sequence

1. **First**: Implement Chain D improvements (#13, #14, #15, #16)
2. **During Chain D**: Apply UI redesign to new components
3. **After Chain D**: Retrofit UI improvements to existing screens
4. **Ongoing**: Each new feature uses new component patterns

---

## File Structure (After Redesign)

```
css/
├── tokens.css           # Design tokens (colors, typography, spacing)
├── components/
│   ├── buttons.css      # Button variants
│   ├── cards.css        # KPI, Film, Talent, Event cards
│   ├── chips.css        # Genre tags, status badges
│   ├── progress.css     # Progress bars, gauges
│   ├── panels.css       # Glass panels, sections
│   └── navigation.css   # Nav rail, tabs
├── screens/
│   ├── dashboard.css    # Dashboard layout
│   ├── planner.css      # Project planner
│   ├── market.css       # Market trends
│   └── modals.css       # All modal types
├── utilities.css        # Helper classes
└── main.css             # Imports all above
```

---

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| "How am I doing?" time | ~10 sec | <3 sec | User testing |
| Visual appeal rating | Unknown | 8+/10 | User survey |
| Information scanability | Poor | Excellent | Heatmap testing |
| Mobile usability | Basic | Good | Device testing |
| Load time | ~2 sec | <1.5 sec | Lighthouse |

---

**Document Version**: 1.0
**Created**: 2025-12-06
**Status**: Ready for Review
**Waiting On**: Reference images for final color/layout decisions
