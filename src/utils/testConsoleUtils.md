# Test Console Utilities

This file provides utilities for tracking and asserting on console errors and warnings during React component tests.

## Overview

The utilities help you:
- **Detect console errors and warnings** during component rendering
- **Get detailed information** about which component triggered the issue
- **Extract stack traces** to identify the source of problems
- **Filter warnings** (e.g., ignore deprecation warnings)
- **Get readable error messages** with component names and locations

## Usage

### Basic Usage

```typescript
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'
import { render } from '@testing-library/react'

it('renders without console errors', () => {
  const tracker = trackConsoleIssues()
  render(<MyComponent/>)
  assertNoConsoleIssues(tracker)
})
```

### With Custom Error Prefix

```typescript
it('renders loading state without errors', () => {
  const tracker = trackConsoleIssues()
  
  render(<MyComponent loading />)
  
  assertNoConsoleIssues(tracker, {
    errorPrefix: 'Console errors/warnings in loading state'
  })
})
```

### With Custom Warning Filter

```typescript
it('renders without unexpected warnings', () => {
  const tracker = trackConsoleIssues()
  
  render(<MyComponent />)
  
  assertNoConsoleIssues(tracker, {
    // Only ignore deprecation warnings
    filterWarnings: (msg) => !msg.includes('deprecated')
  })
})
```

### Manual Inspection (Without Assertion)

```typescript
import { trackConsoleIssues, getConsoleIssues } from 'src/utils/testConsoleUtils'

it('allows specific warnings', () => {
  const tracker = trackConsoleIssues()
  
  render(<MyComponent />)
  
  const { errors, warnings } = getConsoleIssues(tracker)
  
  // Manually restore console
  tracker.restore()
  
  // Custom assertions
  expect(errors.length).toBe(0)
  expect(warnings.filter(w => !w.message.includes('deprecated')).length).toBe(0)
})
```

## API Reference

### `trackConsoleIssues()`

Creates a console tracker that captures `console.error` and `console.warn` calls.

**Returns:** `ConsoleTracker`
- `calls`: Array of captured console calls
- `errorSpy`: Jest spy for console.error
- `warnSpy`: Jest spy for console.warn
- `restore()`: Function to restore original console methods

### `assertNoConsoleIssues(tracker, options?)`

Asserts that no console errors or warnings were captured. Throws a detailed error if issues are found.

**Parameters:**
- `tracker`: ConsoleTracker - The tracker instance
- `options`: AssertOptions (optional)
  - `filterWarnings`: (message: string) => boolean - Filter function for warnings
  - `errorPrefix`: string - Custom error message prefix

**Throws:** Error with detailed information about:
- The error/warning message
- Component name that triggered it
- Stack trace with file locations
- Suggestions for finding the component

### `getConsoleIssues(tracker, options?)`

Returns filtered errors and warnings without throwing an error.

**Parameters:**
- `tracker`: ConsoleTracker - The tracker instance
- `options`: AssertOptions (optional) - Same as assertNoConsoleIssues

**Returns:** Object with:
- `errors`: Array of ConsoleCallInfo
- `warnings`: Array of filtered ConsoleCallInfo

## Example Output

When a test fails, you'll get detailed information:

```
❌ Console errors/warnings detected during render:

Found 1 error(s) and 0 warning(s):

1. ERROR: Warning: Each child in a list should have a unique "key" prop.
   Component with issue: MyListComponent
   Passed from: ParentComponent
   Location: src/components/MyListComponent.tsx:45:12
   Stack (if available):
     at MyListComponent (src/components/MyListComponent.tsx:45:12)
     at ParentComponent (src/components/ParentComponent.tsx:23:5)
     at App (src/App.tsx:15:3)
   → To find: Search codebase for "MyListComponent" component in "ParentComponent"

ℹ️  React errors in tests don't include file/line numbers.
Use the component names above to search your codebase.
```

## Common Use Cases

### Testing a Component Renders Cleanly

```typescript
it('renders without errors', () => {
  const tracker = trackConsoleIssues()
  render(<MyComponent />)
  assertNoConsoleIssues(tracker)
})
```

### Testing Different States

```typescript
it('renders all states without errors', () => {
  const states = [
    { loading: true },
    { error: 'Something went wrong' },
    { data: mockData }
  ]
  
  states.forEach((state) => {
    const tracker = trackConsoleIssues()
    render(<MyComponent {...state} />)
    assertNoConsoleIssues(tracker, {
      errorPrefix: `Console errors in state: ${JSON.stringify(state)}`
    })
  })
})
```

### Allowing Specific Warnings

```typescript
it('renders without unexpected warnings', () => {
  const tracker = trackConsoleIssues()
  render(<MyComponent />)
  
  assertNoConsoleIssues(tracker, {
    filterWarnings: (msg) => {
      // Allow known safe warnings
      return !msg.includes('deprecated') && 
             !msg.includes('experimental feature')
    }
  })
})
```

## Best Practices

1. **Always use trackConsoleIssues at the start** of your test
2. **Call assertNoConsoleIssues after rendering** to verify no issues occurred
3. **Use descriptive error prefixes** when testing different states
4. **Filter warnings carefully** - don't ignore real issues
5. **The tracker automatically restores console** when you call `assertNoConsoleIssues`

## Integration with Existing Tests

Replace manual console tracking:

```typescript
// Before ❌
const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
render(<MyComponent />)
consoleError.mockRestore()
expect(consoleError).not.toHaveBeenCalled()

// After ✅
const tracker = trackConsoleIssues()
render(<MyComponent />)
assertNoConsoleIssues(tracker)
```

