import {JSX} from 'react'
import {  screen, render } from '@testing-library/react'

import IndexPage, {IndexPageProps, IndexPageSelector} from './IndexPage'
import mockFeatureToggles from "src/mocks/app/featureToggles";
import {stageSelector} from "src/setupTests";

const defaultSelector: IndexPageSelector = {
  featureToggles: mockFeatureToggles
}

jest.mock('src/constants/environment.ts', () => {
  return {
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
  stageSelector(defaultSelector, {})

  it('Render: has proper HTML structure', () => {
    render(<IndexPage {...initialMockProps} />)

    expect(screen.getByTestId("topcontainer")).toBeTruthy()
    expect(screen.getByTestId("personpanel")).toBeTruthy()
  })
})
