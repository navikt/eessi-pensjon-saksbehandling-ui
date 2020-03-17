import { Sed, Seds } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import _ from 'lodash'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'
import SEDP5000, { SEDP5000Props } from './SEDP5000'
import sampleSedP50001 from 'resources/tests/sampleSedP50001'
import sampleSedP50002 from 'resources/tests/sampleSedP50002'

describe('applications/BUC/components/SEDP5000/SEDP5000', () => {
  let wrapper: ReactWrapper

  const initialMockProps: SEDP5000Props = {
    locale: 'nb',
    seds: _.filter(sampleBucs[0].seds, (sed: Sed) => sed.type === 'P5000') as Seds,
    sedContent: {
      '60578cf8bf9f45a7819a39987c6c8fd4': sampleSedP50001,
      '50578cf8bf9f45a7819a39987c6c8fd4': sampleSedP50002
    }
  }

  beforeEach(() => {
    wrapper = mount(<SEDP5000 {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.exists('.a-buc-c-sedp5000')).toBeTruthy()
    expect(wrapper.exists('#checkbox-60578cf8bf9f45a7819a39987c6c8fd4')).toBeTruthy()
    expect(wrapper.exists('#checkbox-50578cf8bf9f45a7819a39987c6c8fd4')).toBeTruthy()
    expect(wrapper.exists('.c-tableSorter')).toBeTruthy()
    expect(wrapper.find('.c-tableSorter th').map(it => it.render().text())).toEqual([
      '', 'ui:country', 'ui:type', 'ui:startDate', 'ui:endDate', 'ui:year', 'ui:quarter', 'ui:month',
      'ui:week', 'ui:days/ui:unit', 'ui:relevantForPerformance', 'ui:scheme', 'ui:calculationInformation'
    ])
  })
})
