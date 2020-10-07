import SEDBody from 'applications/BUC/components/SEDBody/SEDBody'
import SEDListHeader from 'applications/BUC/components/SEDListHeader/SEDListHeader'
import { Buc, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import mockBucs from 'mocks/buc/bucs'
import React from 'react'
import SEDPanel, { SEDPanelDiv, SEDPanelExpandingPanel, SEDPanelContainer, SEDPanelProps } from './SEDPanel'

jest.mock('applications/BUC/components/SEDListHeader/SEDListHeader', () => ({ children }: any) => (
  <div data-test-id='mock-SEDListHeader'>{children}</div>
))

jest.mock('applications/BUC/components/SEDBody/SEDBody', () => ({ children }: any) => (
  <div data-test-id='mock-SEDBody'>{children}</div>
))

describe('applications/BUC/components/SEDPanel/SEDPanel', () => {
  const buc: Buc = mockBucs()[0]
  const sed: Sed = buc.seds![0]
  sed.status = 'received'
  const initialMockProps: SEDPanelProps = {
    aktoerId: '123',
    buc: buc,
    followUpSeds: [buc.seds![1]],
    highContrast: false,
    newSed: false,
    onSEDNew: jest.fn(),
    sed: sed,
    style: {}
  }
  let wrapper: ReactWrapper

  beforeEach(() => {
    wrapper = mount(<SEDPanel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDPanelContainer)).toBeTruthy()
    expect(wrapper.exists(SEDListHeader)).toBeTruthy()
  })

  it('Render: SED can\'t have attachments', () => {
    expect(wrapper.exists(SEDPanelDiv)).toBeTruthy()
    expect(wrapper.exists(SEDPanelExpandingPanel)).toBeFalsy()
    expect(wrapper.exists(SEDBody)).toBeFalsy()
  })

  it('Render: SED can have attachments', () => {
    const mockProps = {
      ...initialMockProps,
      sed: {
        ...sed,
        allowsAttachments: true,
        status: 'active'
      }
    }
    wrapper = mount(<SEDPanel {...mockProps} />)
    expect(wrapper.exists(SEDPanelDiv)).toBeFalsy()
    expect(wrapper.exists(SEDPanelExpandingPanel)).toBeTruthy()
  })

  it('Render: SED opens to show SED Body', () => {
    const mockProps = {
      ...initialMockProps,
      sed: {
        ...sed,
        allowsAttachments: true,
        status: 'active'
      }
    }
    wrapper = mount(<SEDPanel {...mockProps} />)
    expect(wrapper.exists(SEDBody)).toBeFalsy()

    wrapper.find(SEDPanelExpandingPanel).find('.ekspanderbartPanel__hode').simulate('click')
    expect(wrapper.exists(SEDBody)).toBeTruthy()
  })
})
