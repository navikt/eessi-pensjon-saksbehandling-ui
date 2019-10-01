import React, { Suspense } from 'react'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'
import { BUCPageIndex } from 'applications/BUC/pages/'
jest.mock('components/TopContainer/TopContainer', () => {
  return ({ children }) => {
    return (
      <div className='mock-c-topcontainer'>
        {children}
      </div>
    )
  }
})

describe('applications/BUC/pages/index', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    actions: {},
    bucsInfo: {},
    bucList: [],
    history: {},
    loading: {},
    locale: 'nb',
    location: {},
    subjectAreaList: [],
    tagList: [],
    t: t
  }

  beforeEach(() => {
    wrapper = mount(
      <StoreProvider initialState={initialState} reducer={reducer}>
        <Suspense fallback={<div />}>
          <BUCPageIndex {...initialMockProps} />
        </Suspense>
      </StoreProvider>)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Inits with BUCStart in page mode', () => {
    expect(wrapper.exists('.a-buc-page')).toBeTruthy()
    expect(wrapper.find('.a-buc-page__title').hostNodes().render().text()).toEqual('buc:step-startBUCTitle')
    expect(wrapper.find('.a-buc-page BUCStart').props().mode).toEqual('page')
  })
})
