import { resetSavingAttachmentJob, resetSedAttachments } from 'actions/buc'
import { Buc } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'
import SEDBody, { SEDBodyDiv, SEDBodyProps } from './SEDBody'

const defaultSelector = {
  attachmentsError: false
}

jest.mock('actions/buc', () => ({
  createSavingAttachmentJob: jest.fn(),
  resetSavingAttachmentJob: jest.fn(),
  resetSedAttachments: jest.fn(),
  sendAttachmentToSed: jest.fn()
}))

jest.mock('applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal', () => {
  const joarkBrowserItems = require('mocks/joark/items').default
  return (props: any) => (
    <div data-test-id='mock-sedattachmentmodal'>
      <button id='onFinishedSelection' onClick={() => props.onFinishedSelection(joarkBrowserItems)}>click</button>
    </div>
  )
})

jest.mock('components/JoarkBrowser/JoarkBrowser', () => () => (
  <div data-test-id='mock-joarkbrowser' />
))

describe('applications/BUC/components/SEDBody/SEDBody', () => {
  let wrapper: ReactWrapper
  const buc: Buc = mockBucs()[0]
  const initialMockProps: SEDBodyProps = {
    aktoerId: '123',
    buc: buc,
    canHaveAttachments: true,
    highContrast: false,
    initialAttachmentsSent: false,
    initialSeeAttachmentPanel: false,
    initialSendingAttachments: false,
    onAttachmentsSubmit: jest.fn(),
    onAttachmentsPanelOpen: jest.fn(),
    sed: buc.seds![0]
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<SEDBody {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDBodyDiv)).toBeTruthy()
  })

  it('Render: shows JoarkBrowser only if items are not empty', () => {
    expect(_.isEmpty(initialMockProps.sed.attachments)).toBeFalsy()
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedbody__attachments-id\']')).toBeTruthy()
    const newMockProps = {
      ...initialMockProps,
      sed: {
        ...initialMockProps.sed,
        attachments: []
      }
    }
    wrapper = mount(<SEDBody {...newMockProps} />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedbody__attachments-id\']')).toBeFalsy()
  })

  it('Render: shows SEDAttachmentSender', () => {
    wrapper = mount(<SEDBody {...initialMockProps} />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeFalsy()
    wrapper = mount(<SEDBody {...initialMockProps} initialSendingAttachments />)
    expect(wrapper.exists('SEDAttachmentSender')).toBeTruthy()
  })

  it('Render: shows upload button if there are joark attachments to upload', () => {
    wrapper = mount(<SEDBody {...initialMockProps} initialSeeAttachmentPanel />)
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedbody__upload-button-id\']')).toBeFalsy()
    wrapper.find('#onFinishedSelection').hostNodes().simulate('click')
    expect(wrapper.exists('[data-test-id=\'a-buc-c-sedbody__upload-button-id\']')).toBeTruthy()
  })

  it('Render: shows modal open button if SED can have attachments', () => {
    expect(wrapper.exists('[data-test-id=\'mock-sedattachmentmodal\']')).toBeFalsy()
    wrapper.find('[data-test-id=\'a-buc-c-sedbody__show-table-button-id\']').hostNodes().simulate('click')
    expect(wrapper.exists('[data-test-id=\'mock-sedattachmentmodal\']')).toBeTruthy()
  })

  it('UseEffect: cleanup after attachments sent', () => {
    (resetSedAttachments as jest.Mock).mockReset()
    wrapper = mount(<SEDBody {...initialMockProps} initialAttachmentsSent initialSendingAttachments />)
    expect(resetSedAttachments).toHaveBeenCalled()
  })

  it('UseEffect: cleanup after attachments sent, part 2', () => {
    (resetSavingAttachmentJob as jest.Mock).mockReset()
    wrapper = mount(<SEDBody {...initialMockProps} initialAttachmentsSent initialSendingAttachments={false} />)
    expect(resetSavingAttachmentJob).toHaveBeenCalled()
  })
})
