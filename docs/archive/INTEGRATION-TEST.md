# Hollywood Mogul - Integration Test Checklist

**Date**: 2025-10-12
**Purpose**: Verify all Phase 1-4 systems work correctly together

---

## Pre-Flight Checklist

### 1. File Verification
- [x] All CSS files exist and loaded
  - [x] `css/main.css`
  - [x] `css/responsive.css`
  - [x] `css/tutorial.css`
  - [x] `css/achievements.css`
  - [x] `css/modals-extended.css`

- [x] All JavaScript files exist and loaded
  - [x] Core: game-state.js, time-system.js, save-load.js, integration.js
  - [x] Systems: financial.js, production.js, boxoffice.js, events.js, censorship.js, crisis.js, achievements.js
  - [x] Data: scripts.js, historical-events.js, talent-roster.js
  - [x] UI: dashboard.js, modals.js, tutorial.js

### 2. Browser Console Check
Open `index.html` in browser and check Developer Tools console:

**Expected Console Output**:
```
Initializing Hollywood Mogul...
Game State initialized
Time System initialized
Financial System initialized
Production System initialized
Box Office System initialized
Event System initialized
Censorship System initialized
Crisis System initialized
Historical Events initialized
Talent Roster initialized
Achievement System initialized
Tutorial System initialized
Integration initialized
Hollywood Mogul initialized successfully!
```

**Check for Errors**:
- [ ] No JavaScript errors
- [ ] No missing file errors (404)
- [ ] No undefined references
- [ ] All systems report "initialized"

---

## Test Suite 1: Basic Functionality

### Tutorial System (5 min)
- [ ] Game loads with tutorial overlay
- [ ] Tutorial step 1 displays correctly
- [ ] "Next" button advances to step 2
- [ ] Element highlighting works (financial dashboard highlighted on step 2)
- [ ] Tutorial progress shows "Step X of 18"
- [ ] "Skip Tutorial" button shows confirmation
- [ ] Complete all 18 steps
- [ ] "Start Playing!" closes tutorial
- [ ] Tutorial overlay removed from DOM

### Dashboard & Navigation (2 min)
- [ ] Financial dashboard shows correct values
  - [ ] Cash: $75,000
  - [ ] Monthly Burn: -$30,000
  - [ ] Runway: 10 weeks
- [ ] Current date shows: January 1933
- [ ] Era indicator shows: "Pre-Code Era"
- [ ] Navigation buttons work
  - [ ] DASHBOARD (active by default)
  - [ ] SCRIPTS
  - [ ] STUDIO
  - [ ] FINANCES

### Time Controls (2 min)
- [ ] "ADVANCE 1 WEEK" button works
  - [ ] Date advances by 7 days
  - [ ] Game week increments
  - [ ] Console logs time advancement
- [ ] "ADVANCE 1 MONTH" button works
  - [ ] Date advances by ~30 days
  - [ ] Game week increments by 4
  - [ ] Monthly burn deducted from cash
  - [ ] New scripts may appear (random)

---

## Test Suite 2: Production Pipeline

### Script Selection (5 min)
- [ ] Click "REVIEW SCRIPTS" button
- [ ] Modal opens with available scripts
- [ ] At least 3 scripts visible
- [ ] Each script shows:
  - [ ] Title
  - [ ] Genre
  - [ ] Budget range
  - [ ] Synopsis
  - [ ] Quality potential
- [ ] Select a low-budget script ($50,000)
- [ ] "GREENLIGHT" button appears
- [ ] Click "GREENLIGHT"
- [ ] Cash deducted from balance
- [ ] Film appears in "Films in Production"

### Production Progress (10 min)
- [ ] Active film shows in dashboard
  - [ ] Title displayed
  - [ ] Status: "In Production"
  - [ ] Budget shown
  - [ ] Weeks remaining countdown
  - [ ] Quality score visible
- [ ] Advance time week by week
- [ ] Weeks remaining decreases
- [ ] Watch for random events (15% chance per week)
  - [ ] Event notification appears if triggered
  - [ ] Alert added to alerts section
  - [ ] Film stats updated (quality, budget, or weeks)
- [ ] Continue until film completes (12-16 weeks)
- [ ] Film moves to "completed" status

### Distribution & Box Office (10 min)
- [ ] Completed film shows "DISTRIBUTE" button
- [ ] Click "DISTRIBUTE"
- [ ] Distribution modal appears
  - [ ] Wide Release option
  - [ ] Limited Release option
- [ ] Select "Wide Release"
- [ ] Film appears in "In Theaters" section
- [ ] Advance weeks to see box office revenue
  - [ ] Weekly gross shown
  - [ ] Total gross accumulates
  - [ ] Cash increases
- [ ] Film stays in theaters 8-12 weeks
- [ ] Film eventually leaves theaters
- [ ] Total profit/loss calculated

---

## Test Suite 3: Historical Events

### 1934 - Hays Code (15 min)
**Setup**: Advance time to July 1934

- [ ] Historical event modal appears automatically
- [ ] Title: "The Hays Code - July 1934"
- [ ] Full explanation of censorship rules
- [ ] "CONTINUE" button closes modal
- [ ] Game state updated: `censorshipActive = true`
- [ ] Alert added: "Production Code Administration Established"

**Test PCA Evaluation**:
- [ ] Greenlight a noir or crime script
- [ ] PCA evaluation modal appears
- [ ] Violations listed (if any)
- [ ] Options presented:
  - [ ] Make Changes (penalties shown)
  - [ ] Abandon Project
- [ ] Choose "Make Changes"
- [ ] Penalties applied:
  - [ ] Quality reduced
  - [ ] Budget increased
  - [ ] Weeks added
- [ ] Production proceeds

### 1941 - Pearl Harbor (5 min)
**Setup**: Advance time to December 1941

- [ ] Historical event modal appears
- [ ] Title: "Pearl Harbor - December 7, 1941"
- [ ] WWII effects explained
- [ ] Game state updated: `warActive = true`
- [ ] Actor draft risk enabled
- [ ] Material rationing explained

### 1947 - HUAC Hearings (15 min)
**Setup**: Advance time to October 1947

- [ ] Historical event modal appears
- [ ] Title: "HUAC Hearings - October 1947"
- [ ] Red Scare context provided
- [ ] Game state updated: `huacActive = true`

**Test HUAC Crisis** (may trigger randomly):
- [ ] Advance weeks/months after HUAC begins
- [ ] Watch for HUAC-related crisis
  - [ ] "HUAC Calls You to Testify"
  - [ ] OR "Your Employee Accused"
- [ ] Crisis modal appears with choices
- [ ] Test each choice path:
  - [ ] Cooperate: reputation drops, HUAC risk decreases
  - [ ] Plead Fifth: moderate penalties
  - [ ] Defiant Stand: high reputation, high HUAC risk
- [ ] Long-term effect applied to game state

---

## Test Suite 4: Crisis Management

### Trigger Crises Manually (10 min each)

**Near Bankruptcy Crisis**:
- [ ] Spend cash until below $10,000
- [ ] Advance time
- [ ] Crisis modal should trigger
- [ ] Test "Emergency Loan" option
  - [ ] Receive $50,000
  - [ ] Loan added to game state
  - [ ] Interest applies monthly

**Star Scandal Crisis** (random):
- [ ] Have active film with actors
- [ ] Advance weeks until scandal triggers (8% chance)
- [ ] Crisis modal appears
- [ ] Test "Hire PR Firm" option
  - [ ] $25,000 deducted
  - [ ] Reputation protected
  - [ ] Box office penalty minimal

**Union Strike Crisis** (random, 1945-1947):
- [ ] Have active film during 1945-1947
- [ ] Advance weeks until strike triggers (10% chance)
- [ ] Crisis modal appears
- [ ] Test "Negotiate Compromise" option
  - [ ] Monthly burn increases
  - [ ] Production delay applied
  - [ ] Reputation maintained

---

## Test Suite 5: Achievements

### Early Achievements (5 min)
- [ ] Greenlight first film
  - [ ] Achievement unlocks: "Lights, Camera, Action!"
  - [ ] Notification appears (top-right)
  - [ ] Animation plays (shake effect)
  - [ ] Alert added to alert system
  - [ ] Points awarded (+10)

- [ ] Earn first profit
  - [ ] Achievement unlocks: "In the Black"
  - [ ] Notification appears
  - [ ] Points awarded (+15)

- [ ] Reach 1940
  - [ ] Achievement unlocks: "Depression Survivor"
  - [ ] Notification appears
  - [ ] Points awarded (+20)

### Check Achievement Tracking
- [ ] Open browser console
- [ ] Type: `AchievementSystem.getProgress()`
- [ ] Verify output shows:
  - [ ] Total achievements: 36
  - [ ] Unlocked: (number unlocked)
  - [ ] Percentage: (% complete)

---

## Test Suite 6: Save/Load System

### Save Game (2 min)
- [ ] Play game for 10+ weeks
- [ ] Produce 1-2 films
- [ ] Unlock 1-2 achievements
- [ ] Click "SAVE" button
- [ ] Check browser console: "Game saved successfully"

### Load Game (2 min)
- [ ] Refresh page (F5)
- [ ] Game resets to initial state
- [ ] Click "LOAD" button
- [ ] Game state restored:
  - [ ] Current date correct
  - [ ] Cash balance correct
  - [ ] Active films restored
  - [ ] Completed films restored
  - [ ] Achievements restored
  - [ ] Historical events tracked
  - [ ] Crises resolved tracked

---

## Test Suite 7: Complete Playthrough

### Victory Condition: Mogul Ending (30 min)
- [ ] Play from 1933 to 1949
- [ ] Produce 20+ films
- [ ] Maintain $500,000+ cash
- [ ] Navigate all historical events
- [ ] Handle crises successfully
- [ ] Check final statistics:
  - [ ] Films produced: 20+
  - [ ] Cash: $500,000+
  - [ ] Year: 1949
- [ ] Game end triggers
- [ ] Victory modal appears: "MOGUL VICTORY"

### Alternative: Speed Test (10 min)
- [ ] Use "ADVANCE 1 MONTH" rapidly
- [ ] Skip through years quickly
- [ ] Verify no JavaScript errors
- [ ] Verify historical events still trigger
- [ ] Verify game doesn't break

---

## Test Suite 8: Edge Cases & Bugs

### Financial Edge Cases
- [ ] Test bankruptcy (cash = $0)
  - [ ] Game over modal appears
  - [ ] Cannot advance time
  - [ ] "Restart" button works

- [ ] Test negative cash with loan
  - [ ] Can take loan when negative
  - [ ] Loan proceeds correctly

### Production Edge Cases
- [ ] Greenlight multiple films simultaneously
  - [ ] All films tracked independently
  - [ ] Each progresses at own pace
  - [ ] Each can trigger random events

- [ ] Test film completion same week
  - [ ] Multiple films complete
  - [ ] All show distribute buttons
  - [ ] Dashboard updates correctly

### UI Edge Cases
- [ ] Test modal stacking
  - [ ] Historical event + crisis
  - [ ] Close in correct order

- [ ] Test long alert list
  - [ ] Alerts truncate at 10
  - [ ] Oldest alerts removed

---

## Test Suite 9: Browser Compatibility

### Chrome
- [ ] Load game
- [ ] All systems work
- [ ] CSS renders correctly
- [ ] No console errors

### Firefox
- [ ] Load game
- [ ] All systems work
- [ ] CSS renders correctly
- [ ] No console errors

### Safari (if available)
- [ ] Load game
- [ ] All systems work
- [ ] CSS renders correctly
- [ ] No console errors

---

## Test Suite 10: Performance

### Load Time
- [ ] Measure initial page load
- [ ] Target: <2 seconds
- [ ] Check Network tab for slow resources

### Memory Usage
- [ ] Play for 100+ game weeks
- [ ] Check Memory tab in DevTools
- [ ] Target: <50MB total
- [ ] No memory leaks

### Frame Rate
- [ ] Advance time rapidly
- [ ] UI should remain responsive
- [ ] No stuttering or freezing

---

## Known Issues Log

### Critical Bugs
_Document any game-breaking bugs here_

### Medium Bugs
_Document any annoying but not game-breaking bugs_

### Minor Bugs
_Document cosmetic or minor issues_

---

## Sign-Off

### Tester Information
- **Tester Name**: _______________
- **Test Date**: _______________
- **Browser**: _______________
- **OS**: _______________

### Test Results
- [ ] All critical tests passed
- [ ] All historical events trigger correctly
- [ ] All crisis scenarios work
- [ ] Achievement system functional
- [ ] Save/load works reliably
- [ ] No game-breaking bugs found

### Approval
- [ ] Ready for launch
- [ ] Needs fixes (list below)

### Notes
_Additional observations or feedback_

---

## Quick Test (5 minutes)

**For rapid verification after changes:**

1. [ ] Load game - no errors
2. [ ] Tutorial appears
3. [ ] Skip tutorial
4. [ ] Greenlight a film
5. [ ] Advance to 1934
6. [ ] Hays Code modal appears
7. [ ] Advance to 1941
8. [ ] Pearl Harbor modal appears
9. [ ] Save game
10. [ ] Refresh page
11. [ ] Load game - state restored
12. [ ] Achievement notification works

**If all 12 quick tests pass, game is likely stable.**

---

**Document Version**: 1.0
**Created**: 2025-10-12
**Purpose**: Complete integration testing before launch
