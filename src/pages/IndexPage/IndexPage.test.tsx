import {  screen, render } from '@testing-library/react'

import { IndexPage, IndexPageProps } from './IndexPage'

jest.mock('src/constants/environment.ts', () => {
  return {
    IS_DEVELOPMENT: 'development',
    IS_PRODUCTION: 'production',
    IS_TEST: 'test'
  };
})

jest.mock('src/components/TopContainer/TopContainer', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-topcontainer' data-testid="topcontainer">
      {children}
    </div>
  )
})
jest.mock('src/components/ContextBanner/ContextBanner', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-contextbanner'>
      {children}
    </div>
  )
})

jest.mock('src/applications/PersonPanel/PersonPanel', () => {
  return ({ children }: {children: JSX.Element}) => (
    <div className='mock-c-personpanel' data-testid="personpanel">
      {children}
    </div>
  )
})

describe('src/pages/IndexPage', () => {
  const initialMockProps: IndexPageProps = {}

  it('Render: has proper HTML structure', () => {
    render(<IndexPage {...initialMockProps} />)

    expect(screen.getByTestId("topcontainer")).toBeTruthy()
    expect(screen.getByTestId("personpanel")).toBeTruthy()
  })
})
