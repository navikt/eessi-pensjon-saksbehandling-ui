import SEDBody from 'applications/BUC/components/SEDBody/SEDBody'
import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, Sed } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import mockBucs from 'mocks/buc/bucs'
import SEDPanel, { SEDPanelDiv, SEDPanelContainer, SEDPanelProps } from './SEDPanel'
import { Accordion } from '@navikt/ds-react'

jest.mock('applications/BUC/components/SEDHeader/SEDHeader', () => ({ children }: any) => (
  <div data-test-id='mock-SEDHeader'>{children}</div>
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
    buc,
    newSed: false,
    onFollowUpSed: jest.fn(),
    setMode: jest.fn(),
    sed,
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
    expect(wrapper.exists(SEDHeader)).toBeTruthy()
  })

  it('Render: SED can\'t have attachments', () => {
    expect(wrapper.exists(SEDPanelDiv)).toBeTruthy()
    expect(wrapper.exists(Accordion)).toBeFalsy()
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
    expect(wrapper.exists(Accordion)).toBeTruthy()
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

    wrapper.find(Accordion).find('.ekspanderbartPanel__hode').simulate('click')
    expect(wrapper.exists(SEDBody)).toBeTruthy()
  })
})
