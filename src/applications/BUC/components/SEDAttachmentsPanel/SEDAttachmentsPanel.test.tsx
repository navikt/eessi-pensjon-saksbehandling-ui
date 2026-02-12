import { render } from '@testing-library/react'
import SEDAttachmentsPanel, { SEDAttachmentsPanelProps } from './SEDAttachmentsPanel'
import { trackConsoleIssues, assertNoConsoleIssues } from 'src/utils/testConsoleUtils'
import { trackSelectorCalls, assertSelectorsAreMemoized } from 'src/utils/testSelectorUtils'
import { stageSelector } from 'src/setupTests'
import mockBucs from 'src/mocks/buc/bucs'
import { Buc, Sed } from 'src/declarations/buc'
import _ from 'lodash'

jest.mock('src/actions/buc', () => ({
  createSavingAttachmentJob: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn()
}))

jest.mock('src/applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal', () => {
  return function SEDAttachmentModal({ open }: any) {
    return open ? <div data-testid="sed-attachment-modal">SEDAttachmentModal</div> : null
  }
})

jest.mock('src/applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender', () => {
  return function SEDAttachmentSender() {
    return <div data-testid="sed-attachment-sender">SEDAttachmentSender</div>
  }
})

jest.mock('src/components/JoarkBrowser/JoarkBrowser', () => {
  return function JoarkBrowser() {
    return <div data-testid="joark-browser">JoarkBrowser</div>
  }
})

describe('SEDAttachmentsPanel', () => {
  const bucs = _.keyBy(mockBucs(), 'caseId')
  const currentBuc = '999999'
  const buc: Buc = bucs[currentBuc]
  const sed: Sed = buc?.seds?.find((s: Sed) => s.type === 'P2000')!

  const defaultSelector = {
    buc: {
      attachmentsError: false
    }
  }

  const defaultProps: SEDAttachmentsPanelProps = {
    aktoerId: '123456789',
    buc: buc,
    canHaveAttachments: true,
    sed: sed
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    jest.clearAllMocks()
  })

  describe('console errors and warnings', () => {
    it('renders without console errors or warnings', () => {
      const tracker = trackConsoleIssues()

      render(<SEDAttachmentsPanel {...defaultProps} />)

      assertNoConsoleIssues(tracker)
    })

    it('renders without console errors on rerender', () => {
      const tracker = trackConsoleIssues()

      const { rerender } = render(<SEDAttachmentsPanel {...defaultProps} />)
      rerender(<SEDAttachmentsPanel {...defaultProps} canHaveAttachments={false} />)

      assertNoConsoleIssues(tracker)
    })
  })

  describe('selector memoization', () => {
    it('uses memoized selectors to prevent unnecessary rerenders', () => {
      const mockState = {
        buc: {
          attachmentsError: false
        }
      }

      const tracker = trackSelectorCalls(mockState)

      const { rerender } = render(<SEDAttachmentsPanel {...defaultProps} />)
      rerender(<SEDAttachmentsPanel {...defaultProps} />)


      assertSelectorsAreMemoized(tracker)
    })
  })
})

