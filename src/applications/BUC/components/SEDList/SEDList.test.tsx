import { Sed } from 'applications/BUC/declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import sampleBucs from 'resources/tests/sampleBucs'
import SEDList, { SEDListProps } from './SEDList'

describe('applications/BUC/components/SEDList/SEDList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDListProps = {
    buc: sampleBucs[0],
    institutionNames: {},
    locale: 'nb',
    maxSeds: 99,
    onSEDNew: jest.fn(),
    seds: (sampleBucs[0].seds as Array<Sed>),
    t: jest.fn(t => t)
  }

  beforeEach(() => {
    wrapper = mount(<SEDList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Renders', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Has proper HTML structure', () => {
    expect(wrapper.find('SEDHeader').length).toEqual(
      initialMockProps.seds.filter(sed => sed.status !== 'empty').length
    )
    expect(wrapper.exists('.a-buc-c-sedlist__footer')).toBeTruthy()
  })

  it('With no seds', () => {
    wrapper = mount(<SEDList {...initialMockProps} seds={[]} />)
    expect(wrapper.find('SEDRow').length).toEqual(0)
  })
})
