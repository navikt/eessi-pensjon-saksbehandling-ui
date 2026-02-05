/**
 * Test utilities for tracking and reporting console errors and warnings during component renders.
 *
 * These utilities help identify:
 * - React console errors (missing keys, prop types, etc.)
 * - Console warnings
 * - The specific component and location that triggered the issue
 *
 * Usage:
 * ```typescript
 * import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'
 *
 * it('renders without errors', () => {
 *   const tracker = trackConsoleIssues()
 *   render(<MyComponent />)
 *   assertNoConsoleIssues(tracker)
 * })
 * ```
 */

export interface ConsoleCallInfo {
  type: 'error' | 'warn'
  message: string
  stack: string
  componentInfo: string
  args: any[]
}

export interface ConsoleTracker {
  calls: ConsoleCallInfo[]
  errorSpy: jest.SpyInstance
  warnSpy: jest.SpyInstance
  restore: () => void
}

/**
 * Extracts stack trace from console call arguments
 */
function extractStack(args: any[]): string {
  const errorArg = args.find(arg => arg instanceof Error)
  if (errorArg) {
    return errorArg.stack || ''
  }

  const argWithStack = args.find(arg => typeof arg === 'object' && arg?.componentStack)
  if (argWithStack) {
    return argWithStack.componentStack || ''
  }

  return new Error().stack || ''
}

/**
 * Extracts component information from stack trace
 */
function extractComponentInfo(stack: string): string {
  const stackLines = stack.split('\n')

  // Find the actual source component (skip test files, mocks, node_modules, and React internals)
  const componentLine = stackLines.find(line =>
    line.includes('/src/') &&
    !line.includes('.test.') &&
    !line.includes('node_modules') &&
    !line.includes('setupTests') &&
    !line.includes('react-dom') &&
    !line.includes('mockImplementation')
  ) || stackLines.find(line =>
    line.includes('/src/') &&
    !line.includes('node_modules') &&
    !line.includes('.test.')
  ) || 'Unknown location'

  // Extract file path and line number
  const fileMatch = componentLine.match(/\(([^)]+):(\d+):(\d+)\)/) ||
                   componentLine.match(/at ([^(]+):(\d+):(\d+)/) ||
                   componentLine.match(/([^(]+):(\d+):(\d+)/)

  return fileMatch
    ? `${fileMatch[1]}:${fileMatch[2]}:${fileMatch[3]}`
    : componentLine.trim()
}

/**
 * Creates a console tracker that captures console.error and console.warn calls
 */
export function trackConsoleIssues(): ConsoleTracker {
  const calls: ConsoleCallInfo[] = []

  const errorSpy = jest.spyOn(console, 'error').mockImplementation((...args) => {
    const stack = extractStack(args)
    const componentInfo = extractComponentInfo(stack)

    calls.push({
      type: 'error',
      message: args.join(' '),
      stack,
      componentInfo,
      args
    })
  })

  const warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const stack = extractStack(args)
    const componentInfo = extractComponentInfo(stack)

    calls.push({
      type: 'warn',
      message: args.join(' '),
      stack,
      componentInfo,
      args
    })
  })

  return {
    calls,
    errorSpy,
    warnSpy,
    restore: () => {
      errorSpy.mockRestore()
      warnSpy.mockRestore()
    }
  }
}

/**
 * Formats a single console call into a detailed error message
 */
function formatConsoleCall(call: ConsoleCallInfo, index: number): string {
  // Extract more specific component info from the message
  const keyPropMatch = call.message.match(/Check the render method of `([^`]+)`/)
  const passedFromMatch = call.message.match(/It was passed a child from `?([^.`\s]+)/)
  const componentName = keyPropMatch ? keyPropMatch[1] : 'Unknown'
  const parentComponent = passedFromMatch ? passedFromMatch[1] : null

  // Try to find file info in the message itself (some React errors include this)
  const fileInfoMatch = call.message.match(/\(([^)]+\.tsx?):(\d+):(\d+)\)/)
  const locationFromMessage = fileInfoMatch
    ? `${fileInfoMatch[1]}:${fileInfoMatch[2]}:${fileInfoMatch[3]}`
    : null

  // Try to find the actual source file in stack (exclude test files)
  const sourceLines = call.stack.split('\n').filter(line =>
    line.includes('/src/') &&
    !line.includes('node_modules') &&
    !line.includes('react-dom') &&
    !line.includes('.test.')
  )

  const location = locationFromMessage || call.componentInfo

  return `\n${index + 1}. ${call.type.toUpperCase()}: ${call.message.substring(0, 300)}\n` +
         `   Component with issue: ${componentName}\n` +
         (parentComponent ? `   Passed from: ${parentComponent}\n` : '') +
         (location !== 'Unknown location' ? `   Location: ${location}\n` : '') +
         `   Stack (if available):\n${sourceLines.slice(0, 5).map(l => `     ${l.trim()}`).join('\n') || '     (No source files in stack)'}\n` +
         `   → To find: Search codebase for "${componentName}" component${parentComponent ? ` in "${parentComponent}"` : ''}`
}

export interface AssertOptions {
  /**
   * Filter function to exclude certain warnings (e.g., deprecation warnings)
   * @default Filters out messages containing 'deprecated'
   */
  filterWarnings?: (message: string) => boolean

  /**
   * Custom error message prefix
   */
  errorPrefix?: string
}

/**
 * Asserts that no console errors or warnings were captured
 * Throws a detailed error if any issues were found
 */
export function assertNoConsoleIssues(
  tracker: ConsoleTracker,
  options: AssertOptions = {}
): void {
  const {
    filterWarnings = (msg) => !msg.includes('deprecated'),
    errorPrefix = 'Console errors/warnings detected during render'
  } = options

  // Restore console methods
  tracker.restore()

  // Filter calls
  const errors = tracker.calls.filter(call => call.type === 'error')
  const warnings = tracker.calls.filter(call =>
    call.type === 'warn' && filterWarnings(call.message)
  )

  // If no issues, test passes
  if (errors.length === 0 && warnings.length === 0) {
    return
  }

  // Format all issues
  const errorDetails = errors.map((call, index) => formatConsoleCall(call, index)).join('\n')
  const warningDetails = warnings.map((call, index) => formatConsoleCall(call, index + errors.length)).join('\n')
  const allIssues = [errorDetails, warningDetails].filter(Boolean).join('\n')

  throw new Error(
    `\n❌ ${errorPrefix}:\n` +
    `\nFound ${errors.length} error(s) and ${warnings.length} warning(s):\n` +
    allIssues +
    `\n\nℹ️  React errors in tests don't include file/line numbers.` +
    `\nUse the component names above to search your codebase.`
  )
}

/**
 * Returns filtered errors and warnings without throwing
 */
export function getConsoleIssues(
  tracker: ConsoleTracker,
  options: AssertOptions = {}
): { errors: ConsoleCallInfo[], warnings: ConsoleCallInfo[] } {
  const {
    filterWarnings = (msg) => !msg.includes('deprecated')
  } = options

  const errors = tracker.calls.filter(call => call.type === 'error')
  const warnings = tracker.calls.filter(call =>
    call.type === 'warn' && filterWarnings(call.message)
  )

  return { errors, warnings }
}

