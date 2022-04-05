import { render, screen } from '@testing-library/react'
import EESSIPensjonVeileder from './EESSIPensjonVeileder'

describe('components/EESSIPensjonVeileder/EESSIPensjonVeileder', () => {
  let wrapper: any

  it('Render: match snapshot', () => {
    const { container } = render(<EESSIPensjonVeileder />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: chooses veileder correctly', () => {
    wrapper = render(<EESSIPensjonVeileder mood='smilende' />)
    expect(screen.getByTestId('c-eessipensjonveileder\']')).toBeTruthy()
    expect(wrapper.find('img').props().alt).toEqual('nav-smilende-veileder')
    wrapper.setProps({ mood: 'trist' })
    expect(wrapper.find('img').props().alt).toEqual('nav-trist-veileder')
  })
})
