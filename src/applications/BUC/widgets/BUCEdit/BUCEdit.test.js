import React from 'react'
import BUCEdit from './BUCEdit'
import sampleBucs from 'resources/tests/sampleBucs'

describe('applications/BUC/widgets/BUCEdit/BUCEdit', () => {
  let wrapper
  const initialMockProps = {
    actions: {
      setMode: jest.fn()
    },
    aktoerId: '123',
    buc: sampleBucs[0],
    institutionNames: {},
    loading: {},
    locale: 'nb',
    rinaUrl: 'http://mockUrl/rinaUrl',
    seds: sampleBucs[0].seds,
    t: jest.fn((translationString) => { return translationString }),
    tagList: ['mockTag1', 'mockTag2']
  }

  beforeEach(() => {
    wrapper = mount(<BUCEdit {...initialMockProps} />)
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-bucedit')).toBeTruthy()
    expect(wrapper.exists('#a-buc-bucedit__new-sed-button-id')).toBeTruthy()
    expect(wrapper.exists('SEDSearch')).toBeTruthy()
    expect(wrapper.exists('BUCDetail')).toBeTruthy()
    expect(wrapper.exists('BUCTools')).toBeTruthy()
  })

  it('moves to mode newsed when button pressed', () => {
    const newSedButton = wrapper.find('#a-buc-bucedit__new-sed-button-id').hostNodes()
    newSedButton.simulate('click')
    expect(initialMockProps.actions.setMode).toBeCalledWith('sednew')
  })
})
