import SEDBody from 'src/applications/BUC/components/SEDBody/SEDBody'
import SEDHeader from 'src/applications/BUC/components/SEDHeader/SEDHeader'
import { Buc, Sed } from 'src/declarations/buc'
import { render } from '@testing-library/react'
import mockBucs from 'src/mocks/buc/bucs'
import SEDPanel, { SEDPanelProps } from './SEDPanel'
import { Accordion } from '@navikt/ds-react'

jest.mock('src/applications/BUC/components/SEDHeader/SEDHeader', () => ({ children }: any) => (
  <div data-testid='mock-SEDHeader'>{children}</div>
))

jest.mock('src/applications/BUC/components/SEDBody/SEDBody', () => ({ children }: any) => (
  <div data-testid='mock-SEDBody'>{children}</div>
))

describe('src/applications/BUC/components/SEDPanel/SEDPanel', () => {
  let wrapper: any
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

  beforeEach(() => {
    render(<SEDPanel {...initialMockProps} />)
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.exists(SEDHeader)).toBeTruthy()
  })

  it('Render: SED can\'t have attachments', () => {
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
    wrapper = render(<SEDPanel {...mockProps} />)
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
    wrapper = render(<SEDPanel {...mockProps} />)
    expect(wrapper.exists(SEDBody)).toBeFalsy()

    wrapper.find(Accordion).find('.ekspanderbartPanel--hode').simulate('click')
    expect(wrapper.exists(SEDBody)).toBeTruthy()
  })
})
