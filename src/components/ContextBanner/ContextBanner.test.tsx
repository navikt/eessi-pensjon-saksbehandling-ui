import BucWebSocket from 'applications/BUC/websocket/WebSocket'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { stageSelector } from 'setupTests'
import mockPerson from 'mocks/app/person'
import ContextBanner, { Context, ContextBannerProps, ContextBannerSelector, DivWithLinks, Tag } from './ContextBanner'

jest.mock('applications/BUC/websocket/WebSocket', () => ({ title, children }: any) => (
  <div title={title} className='websocket'>{children}</div>
))

jest.mock('nav-frontend-popover', () => ({
  __esModule: true, // this property makes it work
  default: ({ children }: any) => (
    <div className='mock-popover'>{children}</div>
  ),
  PopoverOrientering: {
    Under: 'Under'
  }
}))

const mockPesysContext = VEDTAKSKONTEKST
const mockSakType = 'mockSakType'

const defaultSelector: ContextBannerSelector = {
  person: mockPerson.person,
  pesysContext: mockPesysContext,
  sakType: mockSakType
}

describe('components/ContextBanner/ContextBanner', () => {
  let wrapper: ReactWrapper
  const initialMockProps: ContextBannerProps = {
    highContrast: false,
    mode: 'buclist'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = mount(<ContextBanner {...initialMockProps} />)
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(Context)).toBeTruthy()
    expect(wrapper.exists(BucWebSocket)).toBeTruthy()
    expect(wrapper.exists(Tag)).toBeTruthy()
    expect(wrapper.find(Tag).first().render().text()).toEqual('ui:youComeFrom' + mockPesysContext + '.')
    expect(wrapper.find(Tag).last().render().text()).toEqual('buc:form-caseType' + ': ' + mockSakType)
    expect(wrapper.exists(DivWithLinks)).toBeTruthy()
    expect(wrapper.find(DivWithLinks).render().text()).toEqual('ui:lawsource' + '•' + 'ui:help')
  })
})
