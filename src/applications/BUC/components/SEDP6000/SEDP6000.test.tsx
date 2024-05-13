import { getSedP6000PDF, resetSedP6000PDF } from 'src/actions/buc'
import { render } from '@testing-library/react'
import { stageSelector } from 'src/setupTests'
import SEDP6000, { SEDP6000Props, SEDP6000Selector } from './SEDP6000'
import mockP6000s from 'src/mocks/buc/p6000'
import mockP6000PDF from 'src/mocks/buc/p6000pdf'

const defaultSelector: SEDP6000Selector = {
  gettingP6000PDF: false,
  P6000PDF: undefined
}

jest.mock('actions/buc', () => ({
  getSedP6000PDF: jest.fn(),
  resetSedP6000PDF: jest.fn()
}))

jest.mock('components/Modal/Modal', () => (props: any) => (
  <div className='mock-c-modal' tabIndex={0} role='button' onKeyPress={props.onModalClose} onClick={props.onModalClose}>{props.children}</div>
))

describe('applications/BUC/components/SEDP6000/SEDP6000', () => {
  let wrapper: any
  const initialMockProps: SEDP6000Props = {
    feil: undefined,
    locale: 'nb',
    p6000s: mockP6000s,
    onChanged: jest.fn()
  }

  beforeEach(() => {
    stageSelector(defaultSelector, {})
    wrapper = render(<SEDP6000 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<SEDP6000 {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('div.a_buc_c_sedstart--p6000').hostNodes().length).toEqual(mockP6000s.length)
  })

  it('Handling: preview click', () => {
    (getSedP6000PDF as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'a_buc_c_sedstart--p6000-preview-' + mockP6000s[0].documentID + '\']')
      .hostNodes().simulate('click')
    expect(getSedP6000PDF).toHaveBeenCalled()
  })

  it('Handling: select click', () => {
    (initialMockProps.onChanged as jest.Mock).mockReset()
    wrapper.find('[data-testid=\'a_buc_c_sedstart--p6000-checkbox-' + mockP6000s[0].documentID + '\']')
      .hostNodes().simulate('change', { target: { checked: true } })
    expect(initialMockProps.onChanged).toHaveBeenCalled()
  })

  it('Handling: modal close', () => {
    (resetSedP6000PDF as jest.Mock).mockReset()
    stageSelector(defaultSelector, { P6000PDF: mockP6000PDF })
    wrapper = render(<SEDP6000 {...initialMockProps} />)
    wrapper.find('div.mock-c-modal').simulate('click')
    expect(resetSedP6000PDF).toHaveBeenCalled()
  })
})
