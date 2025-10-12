# How to Play Hollywood Mogul

## Quick Start Guide

### Step 1: Open the Game

**Method 1 - Double Click (Easiest)**
1. Open Finder
2. Navigate to: `/Users/newuser/hollywood-mogul-game/`
3. Double-click `index.html`
4. The game will open in your default web browser

**Method 2 - From Terminal**
```bash
cd /Users/newuser/hollywood-mogul-game
open index.html
```

The game should now be running in your browser!

---

## First Time Playing

### The Tutorial

When you first load the game, a **tutorial overlay** will appear. This 18-step guided tutorial will teach you:
- How to read your financial dashboard
- How to greenlight films
- How to manage production
- How to distribute films
- How to handle historical events
- How to unlock achievements

**Tip**: Complete the tutorial! It takes ~5 minutes and explains everything.

To skip the tutorial, click **"Skip Tutorial"** button.

---

## Game Interface Overview

### Top Bar
- **Studio Name**: "MOGUL PICTURES"
- **Current Date**: Shows the current game month and year (starts January 1933)
- **Era Indicator**: Shows which historical period you're in

### Financial Dashboard (Top Section)
- **CASH ON HAND**: Your current money
- **MONTHLY BURN**: How much you spend each month
- **RUNWAY**: How many weeks until you run out of money

**⚠️ IMPORTANT**: If cash reaches $0, you go bankrupt and the game ends!

### Main Sections (Navigate with Bottom Tabs)

#### 🏢 DASHBOARD (Default View)
- **Films in Production**: Your active movies
- **In Theaters**: Movies currently earning box office revenue
- **Alerts**: Important notifications and events
- **Recent Events**: Random industry events

#### 📜 SCRIPTS
- Browse available film scripts
- See budget, genre, quality potential
- Click script to view details
- Click "GREENLIGHT" to start production

#### 🎬 STUDIO
- Manage studio facilities (coming soon)

#### 💰 FINANCES
- View detailed financial information
- See loans and expenses

---

## How to Play the Game

### 1. Start with Money Management

**Starting Situation**:
- Cash: $410,000
- Monthly Burn: $30,000
- Runway: ~54 weeks

**You need to make money fast!** The studio loses $30,000 every month in overhead costs.

### 2. Greenlight Your First Film

**Step-by-Step**:
1. Click the **"REVIEW SCRIPTS"** button
2. Look at available scripts and their budgets
3. **Choose a cheap film first** (under $50,000)
4. Click on the script to see details
5. Click **"GREENLIGHT"** button
6. Cash is deducted immediately

**Script Details**:
- **Genre**: Gangster, Crime, Drama, Comedy, Western, Musical, etc.
- **Budget**: How much it costs to produce
- **Production Time**: How many weeks to complete (12-16 weeks)
- **Quality Potential**: Higher = better box office

### 3. Wait for Production

**During Production**:
- Watch your film progress each week
- The "Weeks Remaining" countdown decreases
- Random events may occur (15% chance per week)
  - Can improve quality
  - Can increase budget
  - Can delay production

**Time Controls** (Bottom Right):
- **ADVANCE 1 WEEK**: Move forward 7 days
- **ADVANCE 1 MONTH**: Move forward ~30 days

### 4. Distribute Your Film

**When film completes**:
1. Film moves to "Completed" status
2. Click **"DISTRIBUTE"** button
3. Choose distribution strategy:
   - **Wide Release**: More theaters, higher revenue potential, higher cost
   - **Limited Release**: Fewer theaters, lower cost, safer

### 5. Earn Box Office Revenue

**In Theaters**:
- Film plays for 8-12 weeks
- Earns money each week
- Weekly gross shown in dashboard
- Total gross accumulates
- Cash increases!

### 6. Repeat and Grow

**The Cycle**:
1. Greenlight film → 2. Watch production → 3. Distribute → 4. Earn money → 5. Greenlight more films!

**Strategy**:
- Start with cheap films ($25,000-$50,000)
- Build up cash reserves
- Graduate to bigger productions
- Manage multiple films at once

---

## Historical Events (Major Turning Points)

### July 1934 - The Hays Code
**What Happens**: The Production Code Administration (PCA) begins enforcing strict censorship
**Impact**:
- All films must be approved by censors
- Certain content (crime, sexuality, violence) is restricted
- Films may be forced to make expensive changes
- Modal will appear explaining the rules

**Strategy**: Choose safer genres (musicals, comedies) or accept the penalties

### December 1941 - Pearl Harbor
**What Happens**: America enters World War II
**Impact**:
- Male actors may be drafted
- Production materials harder to find
- Patriotic films more popular
- War dramas in high demand

**Strategy**: Produce war-themed films, prepare for actor shortages

### October 1947 - HUAC Hearings
**What Happens**: House Un-American Activities Committee investigates Hollywood
**Impact**:
- Risk of blacklisting
- Potential crises requiring difficult choices
- Political pressure on studios

**Strategy**: Navigate carefully, protect your reputation

### May 1948 - Paramount Decision
**What Happens**: Supreme Court breaks up studio monopolies
**Impact**: Changes to industry structure

---

## Crisis Management

**Crises happen randomly** and require you to make important decisions:

### Types of Crises:
1. **Near Bankruptcy** - Emergency loan options
2. **Star Scandal** - Actor in trouble, affects film performance
3. **Union Strike** - Production delays and cost increases
4. **HUAC Investigation** - Political pressure, reputation at stake
5. **Censor Rejection** - PCA demands changes to your film
6. **Box Office Disaster** - Film fails, financial consequences
7. **Talent Walkout** - Actor/director quits mid-production
8. **Equipment Failure** - Production delays

**Each crisis presents choices**:
- Different options have different costs and consequences
- Consider short-term vs long-term effects
- Your choices affect reputation, money, and future events

---

## Achievement System

**36 Achievements to Unlock!**

### Categories:
- **Production**: Make certain numbers/types of films
- **Financial**: Reach money milestones
- **Historical**: Survive major events
- **Awards**: Win Oscars and critical acclaim
- **Talent**: Work with legendary actors/directors
- **Facilities**: Expand your studio
- **Censorship**: Deal with the PCA
- **Survival**: Reach certain years
- **Secret**: Hidden achievements!

**When you unlock an achievement**:
- Notification appears in top-right corner
- Achievement added to your list
- Points awarded
- Alert added to dashboard

**How to View Achievements**:
- Check the alerts section
- Or open browser console and type: `AchievementSystem.getProgress()`

---

## Save & Load

### Save Your Game
- Click the **"SAVE"** button (bottom right)
- Game state saved to browser localStorage
- Multiple save slots available

### Load Your Game
- Click the **"LOAD"** button
- Choose from your saved games
- Game state restored

**⚠️ NOTE**: Saves are stored in your browser. Clearing browser data will delete saves!

---

## Victory Conditions

The game ends in **1949**. There are **3 possible endings**:

### 🏆 MOGUL VICTORY (Best Ending)
**Requirements**:
- Produce 20+ films
- Have $500,000+ cash
- Survive to 1949
- Good reputation

**Reward**: You're a Hollywood legend!

### 🎬 SURVIVOR ENDING (Good Ending)
**Requirements**:
- Produce 10+ films
- Have $100,000+ cash
- Survive to 1949

**Reward**: You made it through the Golden Age!

### 📺 TELEVISION ENDING (Neutral Ending)
**Requirements**:
- Survive to 1949
- Any number of films
- Any amount of cash

**Reward**: You adapt to the new television era

### 💀 BANKRUPTCY (Game Over)
**Happens when**:
- Cash reaches $0
- Can happen any year

**Result**: Game ends, must restart

---

## Tips & Strategies

### Financial Management
1. **Watch your runway** - Always know how many weeks you can survive
2. **Start small** - Don't greenlight expensive films early
3. **Build cash reserves** - Aim for 6+ months of runway
4. **Multiple films** - Once profitable, run multiple productions

### Film Selection
1. **Genre matters** - Different eras prefer different genres:
   - **Pre-Code (1933-1934)**: Gangster, Crime, Romance
   - **Golden Age (1935-1941)**: Musical, Comedy, Romance
   - **War Years (1941-1945)**: Drama, Musical (escapism)
   - **Post-War (1946-1949)**: Noir, Drama, Crime

2. **Quality vs Budget** - Higher quality = better box office, but costs more

3. **Production Time** - Shorter productions = faster returns

### Historical Awareness
1. **Plan for Hays Code (1934)** - After July 1934, avoid controversial content
2. **Prepare for WWII (1941)** - Male actors may be unavailable
3. **HUAC (1947)** - Build strong reputation before hearings

### Crisis Handling
1. **Read choices carefully** - Long-term consequences matter
2. **Protect reputation** - It affects future opportunities
3. **Emergency loans** - Last resort, expensive but can save you

### Achievement Hunting
1. **Diverse filmography** - Try different genres
2. **Historical films** - Make films during each era
3. **Talent relationships** - Work with famous actors/directors
4. **Complete playthroughs** - Some achievements require reaching 1949

---

## Keyboard Shortcuts

- **ESC**: Close modal/dialog
- **Click navigation tabs**: Switch between sections

---

## Troubleshooting

### Game Won't Load
- Check browser console for errors (F12 → Console tab)
- Try a different browser (Chrome, Firefox, Safari)
- Ensure JavaScript is enabled

### Game Runs Slow
- Close other browser tabs
- Clear browser cache
- Check TESTING-COMPLETE.md for performance notes

### Can't Greenlight Films
- Check if you have enough cash
- Verify scripts are available (may need to advance time)

### Saves Not Working
- Check browser localStorage is enabled
- Don't use private/incognito mode
- Some browsers restrict localStorage on local files

### Historical Events Not Triggering
- Advance time to the correct date
- July 1934 for Hays Code
- December 1941 for Pearl Harbor
- October 1947 for HUAC

---

## Console Commands (Advanced)

Open browser console (F12) and try these:

### View Game State
```javascript
HollywoodMogul.getGameState()
```

### Check Achievements
```javascript
AchievementSystem.getProgress()
AchievementSystem.getUnlockedAchievements()
```

### View Historical Events
```javascript
HistoricalEvents.getTriggeredEvents()
```

### Add Cash (Cheat)
```javascript
HollywoodMogul.addCash(1000000)  // Add $1M
```

### Time Travel (Cheat)
```javascript
// Jump to specific year
for(let i = 0; i < 100; i++) {
    HollywoodMogul.advanceTime('month')
}
```

---

## Getting Help

### Documentation
- **README.md** - Game overview and features
- **TESTING-COMPLETE.md** - Technical details and test results
- **INTEGRATION-TEST.md** - Complete testing checklist
- **LAUNCH-READY.md** - Deployment guide

### Common Questions

**Q: How long does a playthrough take?**
A: 30-60 minutes for a complete run (1933-1949)

**Q: Can I make multiple films at once?**
A: Yes! Once profitable, greenlight multiple scripts

**Q: What happens if I run out of money?**
A: Game over (bankruptcy). You can restart or load a save.

**Q: Do I have to watch every week?**
A: No! Use "ADVANCE 1 MONTH" to skip ahead faster

**Q: Can I avoid the Hays Code?**
A: No, it's historical. Plan accordingly after July 1934.

**Q: What's the best strategy?**
A: Start with cheap gangster films (pre-1934), build cash, then diversify

---

## Quick Reference Card

### Game Flow
1. Review Scripts → 2. Greenlight → 3. Advance Time → 4. Complete → 5. Distribute → 6. Box Office → 7. Profit!

### Important Dates
- **July 1934**: Hays Code begins
- **December 1941**: Pearl Harbor / WWII starts
- **August 1945**: WWII ends
- **October 1947**: HUAC hearings begin
- **1949**: Game ends

### Financial Targets
- **Survival**: Keep cash above $0
- **Comfortable**: $400,000+ and 40+ weeks runway
- **Victory**: $500,000+ by 1949

### Film Strategy
- **Early (1933-1934)**: Cheap gangster/crime films
- **Mid (1935-1941)**: Musicals, comedies, epics
- **War (1941-1945)**: War dramas, escapist musicals
- **Late (1946-1949)**: Film noir, serious dramas

---

## Ready to Play?

**You now have everything you need!**

1. Open `index.html` in your browser
2. Complete the tutorial
3. Greenlight your first film
4. Build your Hollywood empire!

**Good luck, and may your studio produce legendary films!** 🎬

---

**Last Updated**: 2025-10-12
**Game Version**: 1.0
**Status**: Fully Playable
