# Talent Roster Management - UI Visual Guide

## Navigation

```
┌───────────────────────────────────────────────────────────────┐
│  🏢        📜         ⭐          🎬         💰         📅    │
│ DASHBOARD  SCRIPTS   TALENT    STUDIO   FINANCES   TIMELINE   │
└───────────────────────────────────────────────────────────────┘
                         ↑
                    NEW BUTTON!
```

## Talent Section Layout

```
╔═══════════════════════════════════════════════════════════════╗
║                      TALENT ROSTER                            ║
║              Manage actors and directors under contract       ║
╚═══════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────┐
│  PLAYERS UNDER CONTRACT                                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ Clark Gable      │  │ Bette Davis      │  │John Ford    ││
│  │ ACTOR            │  │ ACTOR            │  │DIRECTOR     ││
│  │                  │  │                  │  │             ││
│  │ Star Power: 95   │  │ Star Power: 90   │  │Talent: 96   ││
│  │ Happiness: 75%   │  │ Happiness: 82%   │  │Happiness: 88││
│  │ Weekly: $5,000   │  │ Weekly: $4,500   │  │Weekly: 5,200││
│  │ Expires: 2 years │  │ Expires: 1 year  │  │Expires: 3yr ││
│  │ Films: 3         │  │ Films: 1         │  │Films: 2     ││
│  │                  │  │                  │  │             ││
│  │ [drama][romance] │  │ [drama][thriller]│  │[western]    ││
│  │     [adventure]  │  │   [melodrama]    │  │[drama][war] ││
│  │                  │  │                  │  │             ││
│  │   [ RELEASE ]    │  │   [ RELEASE ]    │  │ [ RELEASE ] ││
│  └──────────────────┘  └──────────────────┘  └─────────────┘│
│                                                               │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  AVAILABLE TALENT                                             │
│  [ALL] [ACTORS] [DIRECTORS] [A-LIST ONLY]                     │
│         ↑ Filters                                             │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐│
│  │ Cary Grant   ⭐  │  │ Humphrey Bogart  │  │Alfred Hitch.││
│  │ ACTOR            │  │ ACTOR            │  │DIRECTOR     ││
│  │ "Sophisticated   │  │ "Tough guy with  │  │"Master of   ││
│  │  leading man"    │  │  a heart"        │  │ Suspense"   ││
│  │                  │  │                  │  │             ││
│  │ Star Power: 93   │  │ Star Power: 92   │  │Talent: 98   ││
│  │ Weekly: $4,700   │  │ Weekly: $4,800   │  │Weekly: 6,000││
│  │ Chemistry: 95    │  │ Chemistry: 90    │  │             ││
│  │                  │  │ 🏆 Oscar Winner  │  │             ││
│  │                  │  │                  │  │             ││
│  │ [comedy][romance]│  │ [noir][crime]    │  │[thriller]   ││
│  │    [thriller]    │  │ [drama][war]     │  │[suspense]   ││
│  │                  │  │                  │  │             ││
│  │ SIGN 3-YR        │  │ SIGN 3-YR        │  │ SIGN 3-YR   ││
│  │  ($366,600)      │  │  ($374,400)      │  │  ($468,000) ││
│  │                  │  │                  │  │             ││
│  │ SIGN 1-YR        │  │ SIGN 1-YR        │  │ SIGN 1-YR   ││
│  │  ($122,200)      │  │  ($124,800)      │  │  ($156,000) ││
│  └──────────────────┘  └──────────────────┘  └─────────────┘│
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Card Details

### Contract Player Card (Clark Gable)

```
┌──────────────────────────────────────┐
│ Clark Gable              ACTOR       │ ← Header
│                                      │
│ Star Power:               95/100    │ ← Stats
│ Happiness:                75% ●●○   │
│ Weekly Rate:              $5,000    │
│ Annual Cost:              $260,000  │
│ Contract Expires:         2 years   │
│ Films Completed:          3         │
│                                      │
│ [drama] [romance] [adventure]       │ ← Genres
│                                      │
│        [ RELEASE CONTRACT ]          │ ← Action
└──────────────────────────────────────┘
```

### Available Talent Card (Cary Grant - A-List)

```
┌──────────────────────────────────────┐
│ Cary Grant               ACTOR       │ ← Header
│ BORDER: GOLD (A-list, 85+ power)    │
│                                      │
│ "Sophisticated leading man"         │ ← Description
│                                      │
│ Star Power:               93/100    │ ← Stats
│ Weekly Rate:              $4,700    │
│ Scandal Risk:             5/100 ●   │
│ Chemistry:                95/100    │
│                                      │
│ [comedy] [romance] [thriller]       │ ← Genres
│                                      │
│    [ SIGN 3-YEAR ($366,600) ]       │ ← Actions
│    [ SIGN 1-YEAR ($122,200) ]       │
└──────────────────────────────────────┘
```

### Available Talent Card (Supporting Player)

```
┌──────────────────────────────────────┐
│ Peter Lorre              ACTOR       │
│ BORDER: BRONZE (Supporting, <70)    │
│                                      │
│ "Character specialist"              │
│                                      │
│ Star Power:               68/100    │
│ Weekly Rate:              $1,800    │
│ Scandal Risk:             12/100 ●● │
│ Chemistry:                72/100    │
│                                      │
│ [thriller] [noir] [horror]          │
│                                      │
│    [ SIGN 3-YEAR ($280,800) ]       │
│    [ SIGN 1-YEAR ($93,600) ]        │
└──────────────────────────────────────┘
```

## Color Scheme

### Tier Borders
```
A-List (85+ power):    ┏━━━━━┓  Gold (#FFD700)
                       ┃     ┃
                       ┗━━━━━┛

B-List (70-84):        ┏━━━━━┓  Silver (#C0C0C0)
                       ┃     ┃
                       ┗━━━━━┛

Supporting (<70):      ┏━━━━━┓  Bronze (#CD7F32)
                       ┃     ┃
                       ┗━━━━━┛

Contract Players:      ┏━━━━━┓  Green (#006400)
                       ┃     ┃
                       ┗━━━━━┛
```

### Happiness Indicators
```
High (75-100):   ●●● (Green)
Medium (50-74):  ●●○ (Amber)
Low (0-49):      ●○○ (Red)
```

### Scandal Risk
```
Low (0-10):      ● (Green)
Medium (11-20):  ●● (Amber)
High (21+):      ●●● (Red)
```

## Filter States

```
┌─────────────────────────────────────────────┐
│  [ALL] [ACTORS] [DIRECTORS] [A-LIST ONLY]   │
│   ↑                                          │
│ Active - Dark background                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  [ALL] [ACTORS] [DIRECTORS] [A-LIST ONLY]   │
│         ↑                                    │
│       Active                                │
└─────────────────────────────────────────────┘

Result: Only actors show, directors hidden
```

## Responsive Behavior

### Desktop (1400px+)
```
3-4 cards per row
Full navigation visible
All stats displayed
```

### Tablet (768px-1400px)
```
2-3 cards per row
Compact navigation
All stats displayed
```

### Mobile (<768px)
```
1 card per row
Stacked navigation
Condensed stats
Touch-friendly buttons
```

## Interaction Flow

### Signing a Contract

```
1. Click TALENT nav button
   ↓
2. Browse Available Talent
   ↓
3. Click [SIGN 3-YEAR] or [SIGN 1-YEAR]
   ↓
4. System checks cash availability
   ↓
5. If sufficient:
   - Deduct signing bonus
   - Add to contract players
   - Update financial dashboard
   - Show success notification
   ↓
6. Contract player appears in top section
```

### Releasing a Contract

```
1. Find contract player
   ↓
2. Click [RELEASE]
   ↓
3. Confirmation dialog appears
   ↓
4. If confirmed:
   - Calculate buyout (50% of remaining)
   - Deduct from cash
   - Remove from contract players
   - Reduce reputation -5
   - Show notification
   ↓
5. Talent moves back to available
```

### Using Filters

```
1. Click filter button
   ↓
2. Button highlights (gold background)
   ↓
3. Other filters dim
   ↓
4. Cards filter instantly:
   - Matching cards: visible
   - Non-matching: display: none
   ↓
5. Grid adjusts automatically
```

## Notifications

### Success (Contract Signed)
```
┌──────────────────────────────────────┐
│ ✓ Contract Signed!                   │
│ Clark Gable signed to exclusive      │
│ contract                             │
└──────────────────────────────────────┘
Green background, auto-dismiss 5s
```

### Error (Insufficient Funds)
```
┌──────────────────────────────────────┐
│ ✗ Cannot Sign                        │
│ Cannot afford signing bonus of       │
│ $65,000                              │
└──────────────────────────────────────┘
Red background, auto-dismiss 5s
```

### Warning (Maximum Actors)
```
┌──────────────────────────────────────┐
│ ⚠ No Director                        │
│ Please select a director             │
└──────────────────────────────────────┘
Amber background, auto-dismiss 5s
```

## Integration with Other Systems

### Financial Dashboard
```
┌─────────────────────────────────────┐
│ CASH ON HAND          $150,000      │ ← Signing bonus deducted
│ MONTHLY BURN          -$45,000      │ ← Contract salaries added
│ RUNWAY                13 weeks      │ ← Recalculated
└─────────────────────────────────────┘
```

### Production System (Future)
```
When greenlighting a film:
┌─────────────────────────────────────┐
│ SELECT DIRECTOR                     │
│ [ ] John Ford (Contract) - $5,200   │
│ [✓] Billy Wilder (Contract) - $5,000│
│ [ ] Alfred Hitchcock (Free) - $9,000│
│                                     │
│ SELECT ACTORS (Up to 3)             │
│ [✓] Clark Gable (Contract) - $5,000 │
│ [✓] Bette Davis (Contract) - $4,500 │
│ [ ] Cary Grant (Free) - $7,050      │
│                                     │
│ Total Cost: $14,500 (vs $21,750)    │
│ Savings: 33% with contract players  │
│                                     │
│     [ GREENLIGHT PRODUCTION ]       │
└─────────────────────────────────────┘
```

---

## Quick Reference

**Navigation:** ⭐ TALENT button
**Sections:** Contract Players, Available Talent
**Filters:** All, Actors, Directors, A-List Only
**Actions:** Sign 1-Year, Sign 3-Year, Release
**Costs:** Signing bonus (25%) + Weekly salary
**Savings:** 33% on productions with contract players

**Color Guide:**
- Gold border = A-List (85+ power)
- Silver border = B-List (70-84)
- Bronze border = Supporting (<70)
- Green border = Contract player
- Green meter = Happy (75+)
- Amber meter = Okay (50-74)
- Red meter = Unhappy (<50)

**Pro Tips:**
- Sign A-list talent early for best value
- Match talent genres to your preferred film types
- Keep contract players happy by casting them
- Watch for contract expiration warnings
- Use freelance for specialty one-off needs
