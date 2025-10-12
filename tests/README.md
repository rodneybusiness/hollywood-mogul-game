# Hollywood Mogul Game - Test Suite

Comprehensive test suite for the Hollywood Mogul game core systems.

## Overview

This test suite provides extensive coverage of the game's core functionality including:

- **Game State Initialization** - Testing game setup and default values
- **Financial System** - Cash management, expenses, and runway calculations
- **Time Progression** - Week/month advancement and calendar logic
- **Game End Conditions** - Bankruptcy, victory, and game over scenarios
- **Alert System** - In-game notification management
- **UI Updates** - Display updates and DOM manipulation
- **Integration Tests** - End-to-end game flow testing

## Test Coverage

Current test coverage for `game-state.js`:

| Module | Lines | Functions | Coverage |
|--------|-------|-----------|----------|
| game-state.js | TBD | TBD | Target: 80%+ |

## Setup

### Install Dependencies

```bash
cd hollywood-mogul-game
npm install
```

This will install:
- `jest` - Testing framework
- `jest-environment-jsdom` - DOM environment for browser code
- `@types/jest` - TypeScript definitions for better IDE support

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

Automatically re-run tests when files change:

```bash
npm run test:watch
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

This generates a coverage report in `coverage/` directory.

### Run Specific Test File

```bash
npx jest tests/game-state.test.js
```

### Run Tests Matching a Pattern

```bash
npx jest --testNamePattern="Financial"
```

## Test Structure

### Test Organization

Tests are organized by functionality:

1. **Initialization Tests**
   - Default state values
   - Game constants
   - New game setup

2. **Financial Tests**
   - Cash operations (add/spend)
   - Runway calculations
   - Revenue/expense tracking

3. **Time Progression Tests**
   - Week advancement
   - Month advancement
   - Date formatting
   - Cross-boundary transitions

4. **Game End Condition Tests**
   - Bankruptcy detection
   - Victory conditions
   - Game over state management

5. **Alert System Tests**
   - Alert creation
   - Alert limits
   - Priority handling

6. **UI Update Tests**
   - Display updates
   - CSS class changes
   - DOM manipulation

7. **Integration Tests**
   - Complete game flows
   - Multi-step scenarios
   - State consistency

## Writing New Tests

### Test Template

```javascript
describe('Feature Name', () => {
    beforeEach(() => {
        // Setup before each test
        window.HollywoodMogul.startNewGame();
    });

    test('should do something specific', () => {
        // Arrange
        const initialValue = window.HollywoodMogul.getCash();

        // Act
        window.HollywoodMogul.addCash(1000);

        // Assert
        expect(window.HollywoodMogul.getCash()).toBe(initialValue + 1000);
    });
});
```

### Best Practices

1. **Descriptive Test Names** - Use clear, specific descriptions
2. **Arrange-Act-Assert** - Follow AAA pattern
3. **One Assertion Per Test** - Focus on single responsibility
4. **Clean Setup/Teardown** - Use beforeEach/afterEach
5. **Test Edge Cases** - Include boundary conditions
6. **Mock External Dependencies** - Isolate the system under test

## Common Test Patterns

### Testing State Changes

```javascript
test('should update state correctly', () => {
    const gameState = window.HollywoodMogul.getGameState();
    const before = gameState.cash;

    window.HollywoodMogul.spendCash(1000);

    const after = window.HollywoodMogul.getGameState().cash;
    expect(after).toBe(before - 1000);
});
```

### Testing UI Updates

```javascript
test('should update DOM element', () => {
    window.HollywoodMogul.addCash(1000);

    const element = document.getElementById('cash-display');
    expect(element.textContent).toContain('76,000');
});
```

### Testing Time-Based Logic

```javascript
test('should process monthly expenses after 4 weeks', () => {
    const initialCash = window.HollywoodMogul.getCash();

    for (let i = 0; i < 4; i++) {
        window.HollywoodMogul.advanceTime('week');
    }

    const finalCash = window.HollywoodMogul.getCash();
    expect(finalCash).toBeLessThan(initialCash);
});
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "document is not defined"
```bash
# Solution: Ensure jest-environment-jsdom is installed
npm install --save-dev jest-environment-jsdom
```

**Issue**: Module not found errors
```bash
# Solution: Check that paths are correct relative to test file
# Tests expect game files in ../js/core/
```

**Issue**: Tests timeout
```bash
# Solution: Increase timeout in jest.config or test
jest.setTimeout(10000);
```

## Future Test Additions

As the game develops, add tests for:

- [ ] Film Production System (Phase 2)
- [ ] Script Library (Phase 2)
- [ ] Box Office Simulation (Phase 2)
- [ ] Historical Events (Phase 3)
- [ ] Talent Management (Phase 3)
- [ ] Crisis Management (Phase 3)
- [ ] Save/Load System (Phase 4)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Performance Benchmarks

Target performance for test suite:

- **Total runtime**: < 5 seconds
- **Individual test**: < 100ms
- **Setup/teardown**: < 10ms per test

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain >80% code coverage
4. Update this README with new test sections

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://testingjavascript.com/)
- [JavaScript Testing Guide](https://javascript.info/testing-mocha)

---

**Last Updated**: 2025-10-12
**Test Framework**: Jest 29.7.0
**Coverage Target**: 80%+
