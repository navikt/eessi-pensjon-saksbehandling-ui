import React, { Suspense } from 'react'
import { StoreProvider } from 'store'
import reducer, { initialState } from 'reducer'
import { BUCPageIndex } from 'applications/BUC/pages/'

jest.doMock('applications/BUC/components/BUCStart/BUCStart', () => {
  return () => <div />
})

import BUCStart from 'applications/BUC/components/BUCStart/BUCStart'

describe('applications/BUC/pages/index', () => {
  let wrapper
  const t = jest.fn((translationString) => { return translationString })
  const initialMockProps = {
    bucsInfo: {},
    bucList: [],
    history: {},
    loading: {},
    locale: 'nb',
    location: {},
    subjectAreaList: [],
    tagList: [],
    t: t,
    userRole: 'mockUserRole'
  }

  beforeEach(() => {
    wrapper = mount(<StoreProvider initialState={initialState} reducer={reducer}>
      <Suspense fallback={<div/>}>
        <BUCPageIndex {...initialMockProps} />
      </Suspense>
    </StoreProvider>)
  })

  it('renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders BUCStart in page mode', () => {
    expect(wrapper.exists('.a-buc-page')).toEqual(true)
    expect(wrapper.find('.a-buc-page__title').hostNodes().render().text()).toEqual('buc:step-startBUCTitle')
    expect(wrapper.find('.a-buc-page BUCStart').props().mode).toEqual('page')
  })
})
