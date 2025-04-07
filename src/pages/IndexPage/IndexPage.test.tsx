import {  screen, render } from '@testing-library/react'

import { IndexPage, IndexPageProps } from './IndexPage'

jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-topcontainer' data-testid="topcontainer">
      {children}
    </div>
  )
})
jest.mock('components/ContextBanner/ContextBanner', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-contextbanner'>
      {children}
    </div>
  )
})

describe('pages/IndexPage', () => {
  const initialMockProps: IndexPageProps = {}

  beforeEach(() => {
    render(<IndexPage {...initialMockProps} />)
  })


  it('Render: match snapshot', () => {
    const { container } = render(<IndexPage {...initialMockProps} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(screen.getByTestId("topcontainer")).toBeTruthy()
  })
})
