/**
 * Test utilities for tracking and detecting unmemoized Redux selectors.
 *
 * Unmemoized selectors return NEW object references on every call, even when
 * the underlying data hasn't changed. This causes unnecessary re-renders.
 *
 * Usage:
 * ```typescript
 * import { trackSelectorCalls, assertSelectorsAreMemoized } from 'src/utils/testSelectorUtils'
 *
 * it('uses memoized selectors', () => {
 *   const tracker = trackSelectorCalls(mockState)
 *   const { rerender } = render(<MyComponent />)
 *   rerender(<MyComponent />)
 *   assertSelectorsAreMemoized(tracker)
 * })
 * ```
 */

export interface SelectorCallInfo {
  selector: any
  result: any
  callStack: string
  callNumber: number
}

export interface SelectorTracker {
  calls: SelectorCallInfo[]
  useSelectorSpy: jest.SpyInstance
  restore: () => void
}

/**
 * Extracts component information from call stack
 */
function extractComponentFromStack(stack: string): string {
  const stackLines = stack.split('\n')

  // Find the component that called useSelector (skip the mock implementation lines)
  const componentLine = stackLines
    .slice(2) // Skip Error and mockImplementation lines
    .find(line =>
      line.includes('/P2000/') ||
      line.includes('/P4000/') ||
      line.includes('/P5000/') ||
      line.includes('/P8000/') ||
      line.includes('/BUC/') ||
      line.includes('/components/') ||
      line.includes('/applications/')
    ) || 'Unknown component'

  // Extract just the relevant part (component name and file)
  const match = componentLine.match(/at\s+(\w+)\s+\(([^)]+)\)/) ||
               componentLine.match(/\(([^)]+)\)/)
  return match ? (match[1] || match[0]) : componentLine.trim()
}

/**
 * Creates a selector tracker that intercepts useSelector calls
 *
 * @param state - The Redux state to use for all selector calls
 */
export function trackSelectorCalls(state: any): SelectorTracker {
  const calls: SelectorCallInfo[] = []
  let callCounter = 0

  // Intercept useSelector to check selector stability
  const useSelectorSpy = jest.spyOn(require('react-redux'), 'useSelector')

  useSelectorSpy.mockImplementation((selector: any, _equalityFn?: any) => {
    // Always use the SAME state object
    const result = selector(state)

    // Capture the call stack to identify which component called the selector
    const stack = new Error().stack || ''
    const location = extractComponentFromStack(stack)

    // Store this call with detailed context
    calls.push({
      selector,
      result,
      callStack: location,
      callNumber: callCounter++
    })

    return result
  })

  return {
    calls,
    useSelectorSpy,
    restore: () => {
      useSelectorSpy.mockRestore()
    }
  }
}

/**
 * Groups selector calls by selector function
 */
function groupSelectorCalls(calls: SelectorCallInfo[]): Map<any, SelectorCallInfo[]> {
  const selectorGroups = new Map<any, SelectorCallInfo[]>()

  calls.forEach(call => {
    if (!selectorGroups.has(call.selector)) {
      selectorGroups.set(call.selector, [])
    }
    selectorGroups.get(call.selector)!.push(call)
  })

  return selectorGroups
}

export interface UnmemoizedSelector {
  message: string
  component: string
  firstCall: number
  secondCall: number
  resultType: string
  resultSample: string
}

/**
 * Finds selectors that return different object references for the same state
 */
export function findUnmemoizedSelectors(tracker: SelectorTracker): UnmemoizedSelector[] {
  const selectorGroups = groupSelectorCalls(tracker.calls)
  const unstableSelectors: UnmemoizedSelector[] = []

  selectorGroups.forEach((calls, _selector) => {
    if (calls.length > 1) {
      // Check if all results are the same reference
      const firstCall = calls[0]
      for (let i = 1; i < calls.length; i++) {
        const currentCall = calls[i]

        // Check if selector returns different object for same state
        if (currentCall.result !== firstCall.result &&
            typeof firstCall.result === 'object' &&
            firstCall.result !== null) {

          // Extract component name from call stack
          const componentInfo = firstCall.callStack

          // Determine what type of data is being returned
          const resultType = Array.isArray(firstCall.result) ? 'Array' :
                            firstCall.result.constructor?.name || 'Object'

          // Create a sample of the result for debugging
          const resultSample = JSON.stringify(firstCall.result, null, 2).substring(0, 200)

          unstableSelectors.push({
            message: `Unmemoized selector detected`,
            component: componentInfo,
            firstCall: firstCall.callNumber,
            secondCall: currentCall.callNumber,
            resultType,
            resultSample
          })

          // Output detailed warning to console
          console.warn(
            `\n⚠️  UNMEMOIZED SELECTOR DETECTED ⚠️\n` +
            `Component/Location: ${componentInfo}\n` +
            `First call: #${firstCall.callNumber}, Second call: #${currentCall.callNumber}\n` +
            `Result type: ${resultType}\n` +
            `Result sample: ${resultSample}...\n` +
            `\nThis selector returns a new object reference on every call, causing unnecessary re-renders.\n` +
            `Fix: Use createSelector from @reduxjs/toolkit to memoize the selector.\n` +
            `See: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization\n`
          )
          break
        }
      }
    }
  })

  return unstableSelectors
}

export interface AssertMemoizedOptions {
  /**
   * Whether to console.warn about unmemoized selectors
   * @default true
   */
  logWarnings?: boolean
}

/**
 * Asserts that all Redux selectors are properly memoized.
 * Throws a detailed error if unmemoized selectors are found.
 */
export function assertSelectorsAreMemoized(
  tracker: SelectorTracker,
  _options: AssertMemoizedOptions = {}
): void {
  // Restore spy
  tracker.restore()

  const unstableSelectors = findUnmemoizedSelectors(tracker)

  // If no issues, test passes
  if (unstableSelectors.length === 0) {
    return
  }

  // Provide detailed failure message
  const detailedMessage = unstableSelectors.map((issue, index) =>
    `\n${index + 1}. ${issue.message}\n` +
    `   Component: ${issue.component}\n` +
    `   Calls: #${issue.firstCall} vs #${issue.secondCall}\n` +
    `   Type: ${issue.resultType}\n` +
    `   Sample: ${issue.resultSample.substring(0, 100)}...`
  ).join('\n')

  // Throw detailed error
  throw new Error(
    `\n❌ Found ${unstableSelectors.length} unmemoized selector(s):\n` +
    detailedMessage +
    `\n\nThese selectors need to be memoized using createSelector from @reduxjs/toolkit\n` +
    `See: https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization`
  )
}

