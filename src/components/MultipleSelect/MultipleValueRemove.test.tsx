import { render } from '@testing-library/react'
import MultipleValueRemove from './MultipleValueRemove'

describe('components/MultipleSelect/MultipleValueRemove', () => {
  let wrapper: any
  const initialMockProps = {}

  beforeEach(() => {
    // @ts-ignore
    wrapper = render(<MultipleValueRemove {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<MultipleValueRemove {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('[data-testid=\'c-multipleselect-multiplevalueremove\']')).toBeTruthy()
  })
})
