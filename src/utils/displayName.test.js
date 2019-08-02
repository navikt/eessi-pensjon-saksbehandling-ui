import React from 'React'
import { getDisplayName } from './displayName'

describe('utils/displayName', () => {
  const mockWrappedComponent = (props) => {
    return <div className='mock-wrappedComponent' />
  }

  const mockWrappedComponent2 = (props) => {
    return () => { return <div className='mock-wrappedComponent2' /> }
  }

  const mockWrappedComponent3 = mockWrappedComponent2()

  it('Returns right string', () => {
    expect(getDisplayName(mockWrappedComponent)).toEqual('mockWrappedComponent')
    expect(getDisplayName(mockWrappedComponent2)).toEqual('mockWrappedComponent2')
    expect(getDisplayName(mockWrappedComponent3)).toEqual('Component')
  })
})
