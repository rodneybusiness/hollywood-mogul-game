# Testing Guide - Hollywood Mogul Game

## Quick Start

### 1. Install Dependencies

```bash
cd hollywood-mogul-game
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (recommended for development)
npm run test:watch
```

## Test Suite Overview

### Current Coverage

**game-state.js** - Core game state management
- ✅ 9 test suites
- ✅ 50+ individual tests
- ✅ ~85% code coverage target

### Test Categories

#### 1. Initialization Tests (6 tests)
Tests game startup, default values, and constants.

```javascript
✓ should initialize with correct default game state
✓ should have correct game constants
✓ should start a new game correctly
```

#### 2. Financial Tests (8 tests)
Tests cash management, spending, revenue tracking.

```javascript
✓ should correctly get current cash
✓ should add cash correctly
✓ should spend cash correctly
✓ should calculate runway weeks correctly
```

#### 3. Time Progression Tests (6 tests)
Tests week/month advancement and date handling.

```javascript
✓ should advance time by one week
✓ should advance time by one month
✓ should deduct monthly expenses after 4 weeks
✓ should update year when crossing year boundary
```

#### 4. Game End Condition Tests (4 tests)
Tests bankruptcy, victory, and game over states.

```javascript
✓ should not end game when cash is positive
✓ should end game on bankruptcy
✓ should end game on survival to 1949
```

#### 5. Alert System Tests (3 tests)
Tests in-game notification system.

```javascript
✓ should add alert to game state
✓ should limit alerts to 10 maximum
✓ should add timestamp and ID to alerts
```

#### 6. Modal Function Tests (2 tests)
Tests popup modal system.

```javascript
✓ should show modal with content
✓ should close modal
```

#### 7. UI Update Tests (6 tests)
Tests DOM manipulation and display updates.

```javascript
✓ should update date display
✓ should update cash display
✓ should show danger status when runway is low
```

#### 8. Statistics Tracking Tests (2 tests)
Tests game statistics and progression tracking.

```javascript
✓ should initialize stats correctly
✓ should update years survived when advancing time
```

#### 9. Integration Tests (3 tests)
End-to-end tests of complete game flows.

```javascript
✓ should handle complete game flow from start to bankruptcy
✓ should maintain data consistency across multiple time advances
```

## Understanding Test Output

### Successful Test Run

```
PASS  tests/game-state.test.js
  HollywoodMogul Game State
    Initialization
      ✓ should initialize with correct default game state (5ms)
      ✓ should have correct game constants (2ms)
    Financial Functions
      ✓ should correctly get current cash (3ms)
      ...

Test Suites: 1 passed, 1 total
Tests:       50 passed, 50 total
Snapshots:   0 total
Time:        2.456s
```

### Failed Test Example

```
FAIL  tests/game-state.test.js
  ● Financial Functions › should add cash correctly

    expect(received).toBe(expected)

    Expected: 100000
    Received: 95000

      65 |       window.HollywoodMogul.addCash(25000);
      66 |       expect(window.HollywoodMogul.getCash()).toBe(100000);
         |                                                ^
```

## Coverage Report

### Viewing Coverage

After running `npm run test:coverage`, open:

```bash
open coverage/index.html
```

### Understanding Coverage Metrics

- **Lines**: Percentage of code lines executed
- **Statements**: Percentage of statements executed
- **Branches**: Percentage of if/else branches taken
- **Functions**: Percentage of functions called

### Coverage Goals

| Metric | Target | Current |
|--------|--------|---------|
| Lines | 80% | TBD |
| Statements | 80% | TBD |
| Branches | 70% | TBD |
| Functions | 75% | TBD |

## Writing Your First Test

### 1. Create Test File

```bash
touch tests/my-feature.test.js
```

### 2. Write Basic Test

```javascript
describe('My Feature', () => {
  beforeEach(() => {
    // Setup runs before each test
    window.HollywoodMogul.startNewGame();
  });

  test('should do something', () => {
    // Arrange - set up test data
    const initial = window.HollywoodMogul.getCash();

    // Act - perform the action
    window.HollywoodMogul.addCash(1000);

    // Assert - check the result
    expect(window.HollywoodMogul.getCash()).toBe(initial + 1000);
  });
});
```

### 3. Run Your Test

```bash
npx jest tests/my-feature.test.js
```

## Common Testing Patterns

### Testing State Changes

```javascript
test('should update game state', () => {
  const stateBefore = window.HollywoodMogul.getGameState();

  window.HollywoodMogul.advanceTime('week');

  const stateAfter = window.HollywoodMogul.getGameState();
  expect(stateAfter.gameWeek).toBe(stateBefore.gameWeek + 1);
});
```

### Testing DOM Updates

```javascript
test('should update display', () => {
  window.HollywoodMogul.addCash(1000);

  const element = document.getElementById('cash-display');
  expect(element.textContent).toContain('76,000');
});
```

### Testing Loops/Iterations

```javascript
test('should process multiple months', () => {
  const initialCash = window.HollywoodMogul.getCash();

  for (let i = 0; i < 12; i++) {
    window.HollywoodMogul.advanceTime('month');
  }

  expect(window.HollywoodMogul.getCash()).toBeLessThan(initialCash);
});
```

### Testing Edge Cases

```javascript
test('should handle negative cash', () => {
  window.HollywoodMogul.spendCash(100000);

  const cash = window.HollywoodMogul.getCash();
  expect(cash).toBeLessThan(0);

  const element = document.getElementById('cash-display');
  expect(element.className).toContain('negative');
});
```

## Test Utilities

### Available Global Utilities

```javascript
// Create mock DOM structure
global.testUtils.createMockDOM();

// Create mock game state
const mockState = global.testUtils.createMockGameState({
  cash: 100000,
  reputation: 75
});

// Create mock film
const mockFilm = global.testUtils.createMockFilm({
  title: 'My Film',
  budget: 50000
});

// Advance time easily
global.testUtils.advanceGameTime(game, weeks=4, months=2);
```

## Debugging Tests

### Running Single Test

```bash
# Run specific file
npx jest game-state.test.js

# Run specific test by name
npx jest -t "should add cash correctly"
```

### Debug Mode

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
# See all test output
npx jest --verbose
```

### Console Logging

```javascript
test('debug test', () => {
  const state = window.HollywoodMogul.getGameState();
  console.log('Current state:', state); // Will appear in output
  expect(state.cash).toBe(75000);
});
```

## Continuous Integration

### GitHub Actions Setup

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test

    - name: Generate coverage
      run: npm run test:coverage

    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## Troubleshooting

### Issue: Tests not running

**Solution**: Ensure Jest is installed
```bash
npm install --save-dev jest jest-environment-jsdom
```

### Issue: Module not found

**Solution**: Check file paths are correct
```javascript
// Wrong
require('./game-state.js')

// Correct
require('../js/core/game-state.js')
```

### Issue: DOM elements not found

**Solution**: Ensure DOM is set up in beforeEach
```javascript
beforeEach(() => {
  global.testUtils.createMockDOM();
  window.HollywoodMogul.startNewGame();
});
```

### Issue: Tests timing out

**Solution**: Increase timeout
```javascript
jest.setTimeout(10000); // 10 seconds
```

## Best Practices

### ✅ DO

- Write descriptive test names
- Test one thing per test
- Use beforeEach for setup
- Test edge cases
- Keep tests independent
- Use meaningful assertions

### ❌ DON'T

- Test implementation details
- Share state between tests
- Write tests that depend on order
- Ignore failing tests
- Write tests without assertions
- Duplicate test logic

## Next Steps

1. **Run the tests**: `npm test`
2. **Check coverage**: `npm run test:coverage`
3. **Add more tests** as features are developed
4. **Keep coverage above 80%**

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)
- [Test Setup](./tests/README.md)

---

**Need Help?** Open an issue or check the [tests/README.md](./tests/README.md) for more details.
