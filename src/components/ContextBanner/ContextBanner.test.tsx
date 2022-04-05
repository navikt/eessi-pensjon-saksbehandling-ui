import BucWebSocket from 'applications/BUC/websocket/WebSocket'
import { VEDTAKSKONTEKST } from 'constants/constants'
import { render } from '@testing-library/react'
import { stageSelector } from 'setupTests'
import mockPerson from 'mocks/person/personPdl'
import ContextBanner, { Context, ContextBannerProps, ContextBannerSelector, DivWithLinks, Tag } from './ContextBanner'

jest.mock('applications/BUC/websocket/WebSocket', () => ({ title, children }: any) => (
  <div title={title} className='websocket'>{children}</div>
))

const mockPesysContext = VEDTAKSKONTEKST
const mockSakType = 'Generell'

const defaultSelector: ContextBannerSelector = {
  gettingSakType: false,
  personPdl: mockPerson,
  pesysContext: mockPesysContext,
  sakType: mockSakType
}

describe('components/ContextBanner/ContextBanner', () => {
  let wrapper: any

  const initialMockProps: ContextBannerProps = {
    mode: 'buclist'
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<ContextBanner {...initialMockProps} />)
  })

  it('Render: match snapshot', () => {
    const { container } = render(<ContextBanner {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
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
