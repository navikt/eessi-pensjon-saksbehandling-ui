import React from 'react'
import BUCList from './BUCList'
import sampleBucs from 'resources/tests/sampleBucs'
import sampleBucsInfo from 'resources/tests/sampleBucsInfo'

jest.mock('components/Nav', () => {
  return {
    ...jest.requireActual('components/Nav'),
    EkspanderbartpanelBase: () => { return <div className='mock-EkspanderbartpanelBase' /> }
  }
})

const bucReducer = (currentBucs, newBuc) => {
  currentBucs[newBuc.caseId] = newBuc
  return currentBucs
}
const mockBucs = sampleBucs.reduce(bucReducer, {})

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
    bucs: mockBucs,
    bucsInfoList: [],
    bucsInfo: sampleBucsInfo,
    gettingBUCs: false,
    institutionList: [{
      NO: [{
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

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-buclist')).toBeTruthy()
    expect(wrapper.exists('.a-buc-buclist__buttons')).toBeTruthy()
    expect(wrapper.exists('#a-buc-buclist__newbuc-button-id')).toBeTruthy()
    expect(wrapper.find('.mock-EkspanderbartpanelBase').hostNodes().length).toEqual(sampleBucs.length)
    expect(wrapper.exists('.a-buc-buclist__footer')).toBeTruthy()
  })

  it('Moves to mode newbuc when button pressed', () => {
    const newBucButton = wrapper.find('#a-buc-buclist__newbuc-button-id').hostNodes()
    newBucButton.simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('bucnew')
  })
})
