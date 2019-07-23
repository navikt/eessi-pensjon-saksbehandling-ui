import React from 'react'
import BUCList from './BUCList'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

describe('applications/BUC/widgets/BUCList/BUCList', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      setMode: jest.fn(),
      setBuc: jest.fn(),
      setSeds: jest.fn(),
      getInstitutionsListForBucAndCountry: jest.fn(),
      fetchBucs: jest.fn(),
      fetchBucsInfoList: jest.fn()
    },
    aktoerId: '123',
    bucs: sampleBucs,
    bucsInfoList: [],
    bucsInfo: sampleBucsInfo,
    gettingBUCs: false,
    institutionList: [{
      'NO': [{
        navn: 'mockInstitution1',
        akronym: 'MI1',
        id: 'NO:MI1',
        landkode: 'NO'
      }]
    }],
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rinaUrl',
    sakId: '456',
    t: jest.fn((translationString) => { return translationString })
  }

  beforeEach(() => {
    wrapper = mount(<BUCList {...initialMockProps} />)
  })

  it('renders successfully', () => {
    expect(wrapper.isEmptyRender()).toEqual(false)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders', () => {
    expect(wrapper.exists('.a-buc-buclist')).toEqual(true)
    expect(wrapper.exists('.a-buc-buclist__buttons')).toEqual(true)
    expect(wrapper.exists('#a-buc-buclist__newbuc-button-id')).toEqual(true)
    expect(wrapper.find('.a-buc-buclist__buc').hostNodes().length).toEqual(sampleBucs.length)
    expect(wrapper.exists('.a-buc-buclist__footer')).toEqual(true)
  })

  it('moves to mode newbuc when button pressed', () => {
    const newBucButton = wrapper.find('#a-buc-buclist__newbuc-button-id').hostNodes()
    newBucButton.simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucnew')
  })
})
