import { SEDHeaderSelector } from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Seds } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import { useSelector } from 'react-redux'
import sampleBucs from 'resources/tests/sampleBucs'
import SEDList, { SEDListProps } from './SEDList'

jest.mock('react-redux')
const defaultSelector: SEDHeaderSelector = {
  locale: 'nb'
};
(useSelector as jest.Mock).mockImplementation(() => defaultSelector)

describe('applications/BUC/components/SEDList/SEDList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDListProps = {
    buc: sampleBucs[0],
    maxSeds: 99,
    onSEDNew: jest.fn(),
    seds: (sampleBucs[0].seds as Seds),
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
