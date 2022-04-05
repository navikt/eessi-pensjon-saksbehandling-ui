import { render } from '@testing-library/react'
import Select from 'components/Select/Select'

import ReactSelect from 'react-select'

describe('components/Select/Select', () => {
  let wrapper: any
  const initialMockProps = {
    error: undefined
  }

  beforeEach(() => {
    wrapper = render(<Select {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    const { container } = render(<Select {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(ReactSelect)).toBeTruthy()
  })
})
