import * as api from './api'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const mockStore = configureMockStore([thunk])

describe('api actions', () => {
  let store

  beforeEach(() => {
    store = mockStore({})
  })

  it('call call() with fake url', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(404, 'nope')

    return store.dispatch(api.call({
      url: 'http://mockedurl',
      type: {
        request: 'REQUEST',
        success: 'SUCCESS',
        failure: 'FAILURE'
      }
    }))
      .then(() => {
        const expectedActions = store.getActions()
        expect(expectedActions.length).toBe(2)
        expect(expectedActions[0]).toHaveProperty('type', 'REQUEST')
        expect(expectedActions[1]).toHaveProperty('type', 'FAILURE')
      })
  })

  it('call call() with fake url', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(200, { foo: 'bar' })

    return store.dispatch(api.call({
      url: 'http://mockedurl/',
      type: {
        request: 'REQUEST',
        success: 'SUCCESS',
        failure: 'FAILURE'
      }
    }))
      .then(() => {
        const expectedActions = store.getActions()
        expect(expectedActions.length).toBe(2)
        expect(expectedActions[0]).toHaveProperty('type', 'REQUEST')
        expect(expectedActions[1]).toHaveProperty('type', 'SUCCESS')
      })
  })
})
