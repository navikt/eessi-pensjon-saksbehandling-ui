import SEDHeader from 'applications/BUC/components/SEDHeader/SEDHeader'
import { Seds } from 'declarations/buc'
import { mount, ReactWrapper } from 'enzyme'
import React from 'react'
import mockBucs from 'mocks/buc/bucs'
import SEDList, { SEDFooterDiv, SEDListProps } from './SEDList'

jest.mock('applications/BUC/components/SEDHeader/SEDHeader', () => {
  return () => <div className='mock-sedheader' />
})

describe('applications/BUC/components/SEDList/SEDList', () => {
  let wrapper: ReactWrapper
  const initialMockProps: SEDListProps = {
    buc: mockBucs()[0],
    maxSeds: 99,
    onSEDNew: jest.fn(),
    seds: (mockBucs()[0].seds as Seds)
  }

  beforeEach(() => {
    wrapper = mount(<SEDList {...initialMockProps} />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('Render: match snapshot', () => {
    expect(wrapper.isEmptyRender()).toBeFalsy()
    expect(wrapper).toMatchSnapshot()
  })

  it('Render: has proper HTML structure', () => {
    expect(wrapper.find(SEDHeader).length).toEqual(
      initialMockProps.seds!.filter(sed => sed.status !== 'empty').length
    )
    expect(wrapper.exists(SEDFooterDiv)).toBeTruthy()
  })

  it('Render: with no seds', () => {
    wrapper = mount(<SEDList {...initialMockProps} seds={[]} />)
    expect(wrapper.find(SEDHeader).length).toEqual(0)
  })
})
