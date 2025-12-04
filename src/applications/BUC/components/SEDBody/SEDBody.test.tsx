import { resetSavingAttachmentJob, resetSedAttachments } from 'src/actions/buc'
import { Buc } from 'src/declarations/buc'
import { render, screen } from '@testing-library/react'
import _ from 'lodash'
import mockBucs from 'src/mocks/buc/bucs'
import { stageSelector } from 'src/setupTests'
import SEDBody, { SEDBodyProps } from './SEDBody'

const defaultSelector = {
  attachmentsError: false
}

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/actions/buc', () => ({
  createSavingAttachmentJob: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn()
}))

jest.mock('src/applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal', () => {
  const joarkBrowserItems = require('src/mocks/joark/items').default
  return (props: any) => (
    <div data-testid='mock-sedattachmentmodal'>
      <button id='onFinishedSelection' onClick={() => props.onFinishedSelection(joarkBrowserItems)}>click</button>
    </div>
  )
})

jest.mock('src/components/JoarkBrowser/JoarkBrowser', () => () => (
  <div data-testid='mock-joarkbrowser' />
))

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper: any
  const buc: Buc = mockBucs()[0]
  const initialMockProps: SEDBodyProps = {
    aktoerId: '123',
    buc,
    canHaveAttachments: true,
    initialAttachmentsSent: false,
    initialSeeAttachmentPanel: false,
    initialSendingAttachments: false,
    onAttachmentsSubmit: jest.fn(),
    onAttachmentsPanelOpen: jest.fn(),
    sed: buc.seds![0]
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<SEDBody {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: shows JoarkBrowser only if items are not empty', () => {
    expect(_.isEmpty(initialMockProps.sed.attachments)).toBeFalsy()
    expect(screen.getByTestId('a_buc_c_sedbody--attachments-id')).toBeTruthy()
    const newMockProps = {
      ...initialMockProps,
      sed: {
        ...initialMockProps.sed,
        attachments: []
      }
    }
    wrapper = render(<SEDBody {...newMockProps} />)
    expect(screen.getByTestId('a_buc_c_sedbody--attachments-id')).toBeFalsy()
  })

  it('Render: shows SEDAttachmentSender', () => {
    wrapper = render(<SEDBody {...initialMockProps} />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeFalsy()
    wrapper = render(<SEDBody {...initialMockProps} initialSendingAttachments />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeTruthy()
  })

  it('Render: shows upload button if there are joark attachments to upload', () => {
    wrapper = render(<SEDBody {...initialMockProps} initialSeeAttachmentPanel />)
    expect(screen.getByTestId('a_buc_c_sedbody--upload-button-id')).toBeFalsy()
    wrapper.find('#onFinishedSelection').hostNodes().simulate('click')
    expect(screen.getByTestId('a_buc_c_sedbody--upload-button-id')).toBeTruthy()
  })

  it('Render: shows modal open button if SED can have attachments', () => {
    expect(screen.getByTestId('mock-sedattachmentmodal\']')).toBeFalsy()
    wrapper.find('[data-testid=\'a_buc_c_sedbody--show-table-button-id').hostNodes().simulate('click')
    expect(screen.getByTestId('mock-sedattachmentmodal\']')).toBeTruthy()
  })

  it('UseEffect: cleanup after attachments sent', () => {
    (resetSedAttachments as jest.Mock).mockReset()
    wrapper = render(<SEDBody {...initialMockProps} initialAttachmentsSent initialSendingAttachments />)
    expect(resetSedAttachments).toHaveBeenCalled()
  })

  it('UseEffect: cleanup after attachments sent, part 2', () => {
    (resetSavingAttachmentJob as jest.Mock).mockReset()
    wrapper = render(<SEDBody {...initialMockProps} initialAttachmentsSent initialSendingAttachments={false} />)
    expect(resetSavingAttachmentJob).toHaveBeenCalled()
  })
})
