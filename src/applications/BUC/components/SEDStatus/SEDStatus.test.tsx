import { render } from '@testing-library/react'
import SEDStatus, { MyTag, SEDStatusProps } from './SEDStatus'

describe('applications/BUC/components/SEDStatus/SEDStatus', () => {
  let wrapper: any

  const initialMockProps: SEDStatusProps = {
    status: 'new'
  }

  it('Render: match snapshot', () => {
    const { container } = render(<SEDStatus {...initialMockProps} status='new' />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure for sent status', () => {
    render(<SEDStatus {...initialMockProps} status='sent' />)
    expect(wrapper.exists(MyTag)).toBeTruthy()
    expect(wrapper.find(MyTag).props().type).toEqual('suksess')
  })
})
