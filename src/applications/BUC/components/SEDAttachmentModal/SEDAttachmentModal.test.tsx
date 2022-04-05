import { render, screen, fireEvent } from '@testing-library/react'
import joarkBrowserItems from 'mocks/joark/items'
import { stageSelector } from 'setupTests'
import SEDAttachmentModal, { SEDAttachmentModalProps } from './SEDAttachmentModal'

jest.mock('components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div data-testid='mock-joarkbrowser' />
})

jest.mock('components/Alert/Alert', () => () => <div data-testid='mock-c-alert' />)

const defaultSelector = {
  alertType: undefined,
  alertMessage: undefined,
  alertVariant: undefined,
  error: undefined
}

describe('applications/BUC/components/InstitutionList/InstitutionList', () => {
  const initialMockProps: SEDAttachmentModalProps = {
    open: false,
    onFinishedSelection: jest.fn(),
    onModalClose: jest.fn(),
    sedAttachments: joarkBrowserItems,
    tableId: 'test-id'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
  })

  it('Render: match snapshot', () => {
    const { container } = render(<SEDAttachmentModal {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: Has proper HTML structure', () => {
    render(<SEDAttachmentModal {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_sedattachmentmodal--joarkbrowser-id')).toBeTruthy()
  })

  it('Render: show alert inside modal if there is an error', () => {
    stageSelector(defaultSelector, {
      clientErrorStatus: 'error',
      clientErrorMessage: 'something'
    })
    render(<SEDAttachmentModal {...initialMockProps} />)
    expect(screen.getByTestId('a_buc_c_sedattachmentmodal--alert_id')).toBeInTheDocument()
  })

  it('Handling: clicking ok', () => {
    (initialMockProps.onFinishedSelection as jest.Mock).mockReset()
    render(<SEDAttachmentModal {...initialMockProps} />)
    fireEvent.click(screen.getByTestId('c-modal--button-id-0'))
    expect(initialMockProps.onFinishedSelection).toHaveBeenCalled()
  })
})
