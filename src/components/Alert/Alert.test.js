import React from 'react'
import { connect, bindActionCreators } from 'store'

import { Alert, mapStateToProps } from './Alert'
import * as reducers from '../../../reducers'
import * as alertActions from '../../../actions/alert'

const t = jest.fn((translationString) => { return translationString })

const reducer = combineReducers({
  ...reducers
})

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(Object.assign({}, alertActions), dispatch) }
}

describe('components/Alert/Alert', () => {
  let store, wrapper, ConnectedAlert
  const initialAlertState = {
    alert: {
      clientErrorMessage: 'mockClientErrorMessage',
      clientErrorStatus: 'mockClientErrorStatus',
      serverErrorMessage: 'mockServerErrorMessage',
      uuid: 'MockUuid'
    }
  }

  beforeEach(() => {
    store = createStore(reducer, initialAlertState)
    ConnectedAlert = connect(mapStateToProps, mapDispatchToProps)(Alert)
  })

  it('Alert renders without crashing', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('Alert renders as server', () => {
    wrapper = shallow(<ConnectedAlert t={t} store={store} type='server' />).dive()
    expect(wrapper.render().text()).toEqual('mockServerErrorMessageMockUuid')
  })

  it('Alert renders as client', () => {
    wrapper = shallow(<ConnectedAlert t={t} store={store} type='client' />).dive()
    expect(wrapper.render().text()).toEqual('mockClientErrorMessageMockUuid')
  })

  it('Alert close button works', async (done) => {
    wrapper = shallow(<ConnectedAlert t={t} store={store} type='client' />).dive()
    expect(wrapper.render().text()).toEqual('mockClientErrorMessageMockUuid')
    wrapper.instance().clientClear()
    await new Promise(resolve => {
      setTimeout(() => {
        expect(wrapper.render().text()).toEqual('')
        done()
      }, 500)
    })
  })
})
