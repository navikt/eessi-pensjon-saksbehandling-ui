import { render, screen/*, fireEvent*/ } from '@testing-library/react'
import joarkBrowserItems from 'src/mocks/joark/items'
import { stageSelector } from 'src/setupTests'
import SEDAttachmentModal, { SEDAttachmentModalProps } from './SEDAttachmentModal'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/components/JoarkBrowser/JoarkBrowser', () => {
  return () => <div data-testid='mock-joarkbrowser' />
})

jest.mock('@navikt/ds-react', () => ({
  Alert: (() => () => <div data-testid='mock-c-alert' />)
}));

jest.mock('src/components/Modal/Modal', () => {
  return (props: any) =>
    <div>
      {props.modal?.modalContent || (
        <div />
      )}
    </div>
})

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

  it('Render: Has proper HTML structure', () => {
    render(<SEDAttachmentModal {...initialMockProps} />)
    expect(screen.getByTestId('mock-joarkbrowser')).toBeTruthy()
  })

/*  it('Render: show alert inside modal if there is an error', () => {
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
  })*/
})
