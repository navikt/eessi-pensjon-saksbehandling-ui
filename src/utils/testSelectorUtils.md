# Test Selector Utilities

This file provides utilities for detecting unmemoized Redux selectors in tests.

## Overview

Unmemoized selectors are a common performance issue in Redux applications. When a selector returns a new object or array reference on every call (even when the underlying data hasn't changed), it causes unnecessary re-renders.

The utilities help you:
- **Detect unmemoized selectors** automatically in tests
- **Get detailed information** about which component uses the selector
- **See what data** the selector returns (for debugging)
- **Track selector calls** across renders with the same state

## The Problem

```typescript
// ❌ BAD: This selector returns a NEW object every time
const mapState = (state: RootState) => ({
  user: state.user,
  settings: state.settings
})

// Even if state.user and state.settings don't change,
// this returns a NEW object reference: { user: ..., settings: ... }
// This causes the component to re-render unnecessarily!
```

```typescript
// ✅ GOOD: Use createSelector to memoize
import { createSelector } from '@reduxjs/toolkit'

const selectUser = (state: RootState) => state.user
const selectSettings = (state: RootState) => state.settings

const selectUserAndSettings = createSelector(
  [selectUser, selectSettings],
  (user, settings) => ({ user, settings })
)

// Now it only returns a NEW object when user or settings actually change
```

## Usage

### Basic Usage

```typescript
import { trackSelectorCalls, assertSelectorsAreMemoized } from 'src/utils/testSelectorUtils'
import { render } from '@testing-library/react'

it('uses memoized selectors', () => {
  const tracker = trackSelectorCalls(mockReduxState)
  
  // Render twice with the SAME state
  const { rerender } = render(<MyComponent />)
  rerender(<MyComponent />)
  
  // If any selector returns different objects for the same state, this will fail
  assertSelectorsAreMemoized(tracker)
})
```

### With Redux State Mock

```typescript
const mockState = {
  buc: {
    PSED: mockData
  },
  loading: {
    gettingSed: false
  },
  app: {
    params: { aktoerId: '123' }
  }
}

it('P2000 uses memoized selectors', () => {
  const tracker = trackSelectorCalls(mockState)
  
  const { rerender } = render(<P2000 />)
  rerender(<P2000 />)
  
  assertSelectorsAreMemoized(tracker)
})
```

## API Reference

### `trackSelectorCalls(state)`

Creates a selector tracker that intercepts all `useSelector` calls.

**Parameters:**
- `state`: any - The Redux state to use for all selector calls

**Returns:** `SelectorTracker`
- `calls`: Array of selector call information
- `useSelectorSpy`: Jest spy for useSelector
- `restore()`: Function to restore original useSelector

**Important:** The tracker uses the SAME state object for all calls. This is how we detect if a selector is stable - if it returns different references for the same state, it's not memoized.

### `assertSelectorsAreMemoized(tracker, options?)`

Asserts that all selectors are properly memoized. Throws a detailed error if unmemoized selectors are found.

**Parameters:**
- `tracker`: SelectorTracker - The tracker instance
- `options`: AssertMemoizedOptions (optional)
  - `logWarnings`: boolean - Whether to console.warn about issues (default: true)

**Throws:** Error with detailed information about:
- Which component uses the unmemoized selector
- Call numbers where the issue was detected
- Type of data being returned (Array, Object, etc.)
- Sample of the returned data
- Link to Redux documentation on memoization

### `findUnmemoizedSelectors(tracker)`

Finds unmemoized selectors without throwing an error.

**Parameters:**
- `tracker`: SelectorTracker - The tracker instance

**Returns:** Array of `UnmemoizedSelector` objects with:
- `message`: Description of the issue
- `component`: Component that uses the selector
- `firstCall`: Call number of first invocation
- `secondCall`: Call number of second invocation
- `resultType`: Type of data returned (Array, Object, etc.)
- `resultSample`: JSON sample of the data

## Example Output

When a test fails, you'll get detailed information:

```
❌ Found 2 unmemoized selector(s):

1. Unmemoized selector detected
   Component: SaveAndSendSED
   Calls: #4 vs #16
   Type: Object
   Sample: {
     "currentPSED": {
       "sed": "P2000",
       "nav": {
         "eessisak": [...]
       }
     }
   }

2. Unmemoized selector detected
   Component: SEDBody
   Calls: #2 vs #7
   Type: Object
   Sample: {}

These selectors need to be memoized using createSelector from @reduxjs/toolkit
See: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
```

Plus console warnings during the test:

```
⚠️  UNMEMOIZED SELECTOR DETECTED ⚠️
Component/Location: SaveAndSendSED
First call: #4, Second call: #16
Result type: Object
Result sample: {
  "currentPSED": {...}
}

This selector returns a new object reference on every call, causing unnecessary re-renders.
Fix: Use createSelector from @reduxjs/toolkit to memoize the selector.
```

## How It Works

1. **Intercepts `useSelector`**: The tracker creates a Jest spy on `react-redux`'s `useSelector`
2. **Uses same state**: Every selector call uses the SAME state object
3. **Tracks results**: Stores the result of each selector call
4. **Compares references**: Groups calls by selector function and checks if results are the same reference
5. **Reports differences**: If a selector returns different object references for the same state, it's not memoized

## Common Scenarios

### Testing a Component

```typescript
it('renders without unmemoized selectors', () => {
  const tracker = trackSelectorCalls(defaultSelector)
  
  const { rerender } = render(<MyComponent />)
  rerender(<MyComponent />)
  
  assertSelectorsAreMemoized(tracker)
})
```

### Testing with Props Changes

```typescript
it('handles prop changes with memoized selectors', () => {
  const tracker = trackSelectorCalls(defaultSelector)
  
  // Render with different props
  const { rerender } = render(<MyComponent id="1" />)
  rerender(<MyComponent id="2" />)
  
  // State didn't change, so selectors should return same references
  assertSelectorsAreMemoized(tracker)
})
```

### Manual Checking

```typescript
it('allows some unmemoized selectors', () => {
  const tracker = trackSelectorCalls(defaultSelector)
  
  const { rerender } = render(<MyComponent />)
  rerender(<MyComponent />)
  
  const unmemoized = findUnmemoizedSelectors(tracker)
  tracker.restore()
  
  // Only fail if specific components have issues
  const problematicSelectors = unmemoized.filter(s => 
    s.component.includes('CriticalComponent')
  )
  
  expect(problematicSelectors).toEqual([])
})
```

## Fixing Unmemoized Selectors

When you find an unmemoized selector:

1. **Find the mapState function** in the component mentioned in the error
2. **Check if it returns a new object/array** every time
3. **Refactor using createSelector**:

```typescript
// Before ❌
const MyComponent = () => {
  const data = useSelector((state: RootState) => ({
    items: state.items,
    user: state.user
  }))
  // ...
}

// After ✅
import { createSelector } from '@reduxjs/toolkit'

const selectItems = (state: RootState) => state.items
const selectUser = (state: RootState) => state.user

const selectItemsAndUser = createSelector(
  [selectItems, selectUser],
  (items, user) => ({ items, user })
)

const MyComponent = () => {
  const data = useSelector(selectItemsAndUser)
  // ...
}
```

## Best Practices

1. **Always rerender** - You need to render at least twice to detect the issue
2. **Use same state** - The tracker automatically uses the same state for all calls
3. **Check the output** - The error message tells you exactly which component and what data
4. **Fix at the source** - Memoize the selector, don't ignore the warning
5. **Test critical paths** - Focus on components that render frequently

## Integration with Console Utilities

You can use both utilities together:

```typescript
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'
import { trackSelectorCalls, assertSelectorsAreMemoized } from 'src/utils/testSelectorUtils'

it('renders cleanly with memoized selectors', () => {
  // Track console issues
  const consoleTracker = trackConsoleIssues()
  
  // Track selector memoization
  const selectorTracker = trackSelectorCalls(mockState)
  
  const { rerender } = render(<MyComponent />)
  rerender(<MyComponent />)
  
  // Assert both
  assertNoConsoleIssues(consoleTracker)
  assertSelectorsAreMemoized(selectorTracker)
})
```

