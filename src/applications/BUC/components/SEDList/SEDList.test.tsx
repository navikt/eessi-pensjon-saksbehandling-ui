import { SEDHeaderSelector } from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Seds } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import { stageSelector } from 'setupTests'
import SEDList, { SEDListProps } from './SEDList'

const defaultSelector: SEDHeaderSelector = {
  locale: 'nb'
}

describe('applications/BUC/components/SEDList/SEDList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDListProps = {
    buc: mockBucs()[0],
    maxSeds: 99,
    onSEDNew: jest.fn(),
    seds: (mockBucs()[0].seds as Seds)
  }

  beforeAll(() => {
    stageSelector(defaultSelector, {})
  })

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
      initialMockProps.seds!.filter(sed => sed.status !== 'empty').length
    )
    expect(wrapper.exists('.a-buc-c-sedlist__footer')).toBeTruthy()
  })

  it('With no seds', () => {
    wrapper = mount(<SEDList {...initialMockProps} seds={[]} />)
    expect(wrapper.find('SEDRow').length).toEqual(0)
  })
})
