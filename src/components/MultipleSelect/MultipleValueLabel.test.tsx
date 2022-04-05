
import MultipleValueLabel from 'components/MultipleSelect/MultipleValueLabel'
import { render } from '@testing-library/react'

describe('components/MultipleSelect/MultipleValueLabel', () => {
  let wrapper: any
  const initialMockProps = {
    data: {
      label: 'mockLabel'
    }
  }

  beforeEach(() => {
    // @ts-ignore
    wrapper = render(<MultipleValueLabel {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<MultipleValueLabel {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find('[data-testid=\'c-multipleselect-multivaluelabel\']')).toBeTruthy()
    expect(wrapper.find('[data-testid=\'c-multipleselect-multivaluelabel\']').render().text().trim()).toEqual(
      initialMockProps.data.label
    )
  })
})
