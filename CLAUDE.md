# hollywood-mogul-game

A historically authentic Hollywood studio management game (1933-1949). Greenlight films, manage production, navigate the Hays Code, survive WWII, and build your studio empire.

## Commands

| Action | Command |
|--------|---------|
| Test | `npm test` |
| Test (watch) | `npm test:watch` |
| Test (coverage) | `npm test:coverage` |
| Run | Open `index.html` in browser |

## Stack

- Vanilla JavaScript (browser-based)
- Jest for testing
- No build step - runs directly in browser

## Structure

```
js/            # Game logic
css/           # Styles
assets/        # Game assets
index.html     # Entry point
*.test.js      # Test files
```

## Sharp Edges

1. **Browser-only** - No Node.js runtime, open index.html directly
2. **Jest for browser code** - Uses jsdom environment
3. **Historical accuracy matters** - Game mechanics tied to 1933-1949 Hollywood history
4. **Many .md files** - Lots of planning/status docs from development
