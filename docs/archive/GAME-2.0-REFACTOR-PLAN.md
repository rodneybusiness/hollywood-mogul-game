# Hollywood Mogul 2.0 - Complete Refactor Plan

## Audit Summary

A deep audit of the entire codebase (48,651 lines across 41 JS files and 15 CSS files) revealed a game with **exceptional historical accuracy** and **impressive feature breadth**, but significant architectural debt that will block further development.

### Health Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Historical Accuracy | 9/10 | Authentic scripts, talent, events across 1933-1949 |
| Feature Completeness | 8/10 | 20+ systems: production, finance, censorship, talent, etc. |
| Game Balance | 8/10 | Good foundation, targeted fixes needed |
| CSS/Design System | 8.5/10 | Excellent glassmorphic system, strong responsive design |
| Architecture | 5/10 | God objects, tight coupling, duplicate state |
| Code Quality | 6/10 | Duplication, magic numbers, inconsistent patterns |
| Test Coverage | 1/10 | 16 of 36 tests failing; 0% coverage on major systems |
| Accessibility | 3.5/10 | Zero ARIA, no focus management, no screen reader support |
| Memory Safety | 4/10 | No event listener cleanup, DOM leaks in modals |

---

## Critical Bugs (Fix First)

### 1. Budget Double-Deduction (production.js)
**Severity: GAME-BREAKING**
- Cash deducted in full at greenlight (`gameState.cash -= film.originalBudget`)
- Weekly costs tracked separately (`film.spentToDate += weeklyCost`)
- Overage only deducted after exceeding original budget
- Net effect: players effectively get interest-free loans on production budgets
- **Fix:** Deduct weekly as costs are incurred, not upfront

### 2. Censorship False Positives (censorship.js)
**Severity: HIGH**
- Uses `textToCheck.includes(keyword)` - substring matching
- "incorruptible" triggers "corrupt" violation
- "religion" as a topic triggers religious mockery violation
- **Fix:** Use word-boundary regex `\b${keyword}\b`

### 3. Misplaced Script Tags (index.html:465,473)
**Severity: HIGH**
- `<script>` tags embedded inside `.game-over-content` and `.loading-content` divs
- Blocks rendering, violates DOM integrity
- **Fix:** Move to proper script section at end of body

### 4. Genre Heat Duplicate Key (boxoffice.js)
**Severity: LOW**
- 1939 entry has duplicate "drama" key (1.3 and 1.4)
- JavaScript silently uses last value (1.4)
- **Fix:** Remove duplicate entry

### 5. Test Constants Mismatch
**Severity: HIGH (blocks CI)**
- Tests expect STARTING_CASH=410000, BASE_MONTHLY_BURN=30000
- Game code has STARTING_CASH=600000, BASE_MONTHLY_BURN=20000
- 16 of 36 tests fail
- **Fix:** Update tests to match game constants

---

## Architecture Overhaul

### Problem: God Object (game-state.js = 1004 lines)

Single IIFE mixes state management, financial calculations, alert management, DOM manipulation, and UI rendering. Returns 40+ methods with no organization.

**Refactor into:**

```
js/core/
  state.js              - Pure game state (data only, getters/setters)
  game-controller.js    - Game loop, turn advancement, end conditions
  event-bus.js          - Pub/sub system for decoupling
  constants.js          - All magic numbers in one place

js/core/ (keep existing)
  time-system.js        - Already well-separated
  save-load.js          - Already well-separated
  dom-utils.js          - Already well-separated
```

### Problem: Duplicate UI Rendering (3 places)

The same DOM elements are updated by game-state.js (lines 514-999), integration.js (lines 559-721), AND dashboard.js (lines 94-125).

**Refactor into:**

```
js/ui/
  renderer.js           - Single source of truth for all DOM updates
  dashboard.js          - Dashboard-specific rendering
  modals.js             - Modal lifecycle management (create, focus, destroy)
```

### Problem: Global Coupling (window.*)

Every module accesses `window.HollywoodMogul` directly. Can't test, can't mock, can't run headless.

**Refactor with:**
- Event bus pattern for inter-system communication
- Dependency injection for system initialization
- Clear public API per module

### Problem: Duplicate Data Sources

| Data | Location 1 | Location 2 |
|------|-----------|-----------|
| Genre modifiers | TimeSystem.getEraGenreModifiers() | BoxOfficeSystem.GENRE_HEAT |
| Era classifications | integration.js:getEraForYear() | TimeSystem.getCurrentPeriod() |
| Films | gameState.films | gameState.activeFilms + gameState.completedFilms |
| Alert/Event system | addAlert() | addEvent() |

**Fix:** Single source of truth for each data type.

---

## Game Balance Fixes

### 1. Financial Rebalancing
- **Bank loans:** Reduce from 8%/month to 3-4%/month (still high, but competitive with mob)
- **Theater investment:** Reduce from $500k to $250k (accessible by year 3-4)
- **Investment benefits:** Quantify vague descriptions ("talent attraction" = -15% hire cost)

### 2. Censorship Tuning
- **Noir penalty:** Reduce from 60% auto-crime-violation to 30% (1946-47), 15% (1948-49)
- **Post-war relaxation:** Increase era adjustment from -5 to -10/-15
- **Interracial content:** Auto-reject post-1934 instead of -25 quality penalty (historically accurate)

### 3. Undefined Mechanics
- **Feud system:** Define consequences (recurring negative events, reduced cooperation)
- **FBI attention:** Define threshold (50+ = investigation, 75+ = studio shutdown risk)
- **Draft risk:** Implement actual unavailability during service years
- **Bankruptcy:** Explicit game-over at $0 cash with warning at <$50k

---

## CSS & UI Improvements

### Accessibility (WCAG AA compliance)
1. Add `focus-visible` indicators on all interactive elements
2. Add ARIA labels to all emoji-only buttons
3. Add `role="dialog"` and `aria-modal="true"` to modals
4. Implement focus trap in modals
5. Add `aria-live` regions for dynamic updates (cash, alerts)
6. Fix heading hierarchy (multiple h1 elements)
7. Add color-blind-safe indicators (not color-only)

### Memory Leak Fixes
1. Add `removeEventListener` cleanup to all UI modules
2. Add `destroy()` methods to all IIFE modules
3. Remove modal DOM elements after close (currently persist forever)
4. Fix event listener accumulation in save-load-ui.js tab switching
5. Clear all `setInterval`/`setTimeout` on module teardown

### CSS Consolidation
1. Replace ~50 hardcoded color values with design token variables
2. Merge duplicate button systems (`.action-btn` vs `.btn-primary`)
3. Consolidate 6 card patterns into base `.card` + variants
4. Move all animations to animations.css (currently scattered)
5. **Estimated reduction:** 800-1,200 lines of CSS

### HTML Fixes
1. Move misplaced script tags to end of body
2. Change second `<h1>` to `<h2>` (loading screen)
3. Add `<time>` element for game date
4. Add `aria-label` to emoji buttons

---

## Test Strategy

### Phase 1: Fix Existing Tests
- Update constants in tests to match game code (600k/20k)
- All 36 tests should pass

### Phase 2: Critical System Tests
Priority test files to create:

```
tests/production-system.test.js    - Film lifecycle, budget tracking
tests/boxoffice-system.test.js     - Revenue calculation, genre heat
tests/financial-system.test.js     - Loans, interest, investments
tests/censorship-system.test.js    - Violation detection, approval logic
tests/save-load.test.js            - Persistence, corruption handling
```

### Phase 3: Integration Tests
```
tests/game-flow.test.js            - Full game lifecycle
tests/event-cascading.test.js      - Multi-system event propagation
tests/balance-validation.test.js   - Profit margins, difficulty curve
```

### Coverage Target: 80%+ (currently ~10%)

---

## Implementation Phases

### Phase 1: Stabilize (Critical fixes, no architecture changes)
- [ ] Fix budget double-deduction bug
- [ ] Fix censorship keyword matching (word boundaries)
- [ ] Fix HTML script tag placement
- [ ] Fix genre heat duplicate key
- [ ] Fix test constants → all 36 tests green
- [ ] Add constants.js (extract all magic numbers)

### Phase 2: Architecture Foundation
- [ ] Create event-bus.js (pub/sub for decoupling)
- [ ] Extract pure state from game-state.js → state.js
- [ ] Extract game loop from game-state.js → game-controller.js
- [ ] Consolidate UI rendering to single renderer
- [ ] Remove duplicate data sources (genre modifiers, era classifications)
- [ ] Consolidate alert/event systems into one

### Phase 3: System Improvements
- [ ] Rebalance financial system (bank loans, investments)
- [ ] Tune censorship by era (noir penalty, post-war relaxation)
- [ ] Implement draft risk mechanics (actual unavailability)
- [ ] Define feud/FBI/bankruptcy mechanics
- [ ] Implement proper production budget flow (weekly deductions)

### Phase 4: UI/UX Overhaul
- [ ] Add ARIA attributes and focus management
- [ ] Fix memory leaks (event listeners, modal cleanup)
- [ ] Add module destroy() methods
- [ ] Consolidate CSS (colors, buttons, cards)
- [ ] Fix HTML semantic issues

### Phase 5: Test Coverage
- [ ] Production system tests
- [ ] Box office system tests
- [ ] Financial system tests
- [ ] Censorship system tests
- [ ] Save/load system tests
- [ ] Integration tests

---

## Metrics After 2.0

| Metric | Before | Target |
|--------|--------|--------|
| Tests passing | 20/36 (55%) | 100+ tests, 100% passing |
| Test coverage | ~10% | 80%+ |
| Failing tests | 16 | 0 |
| Critical bugs | 5 | 0 |
| ARIA attributes | 0 | 50+ |
| Magic numbers in code | 30+ | 0 (all in constants.js) |
| Duplicate UI renders | 3 locations | 1 location |
| God object size | 1004 lines | <300 lines per module |
| Memory leaks | 6+ identified | 0 |
| removeEventListener calls | 0 | Matches addEventListener count |
