import * as api from 'actions/api'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const mockStore = configureMockStore([thunk])

describe('api actions', () => {
  let store

  beforeEach(() => {
    store = mockStore({})
  })

  it('call() with fake url and 404 response', () => {
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

  it('call() with fake url and 200 response', () => {
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

  it('call() with fake url and 500 response', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(500, 'error')

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
        expect(expectedActions.length).toBe(3)
        expect(expectedActions[0]).toHaveProperty('type', 'REQUEST')
        expect(expectedActions[1]).toHaveProperty('type', 'SERVER/INTERNAL/ERROR')
        expect(expectedActions[2]).toHaveProperty('type', 'FAILURE')
      })
  })

  it('fakecall()', () => {
    const mockedPayload = { foo: 'bar' }
    store.dispatch(api.fakecall({
      url: 'http://mockedurl/',
      type: {
        request: 'REQUEST',
        success: 'SUCCESS',
        failure: 'FAILURE'
      },
      expectedPayload: mockedPayload
    })).then(() => {
      const expectedActions = store.getActions()
      expect(expectedActions.length).toBe(2)
      expect(expectedActions[0]).toHaveProperty('type', 'REQUEST')
      expect(expectedActions[1]).toHaveProperty('type', 'SUCCESS')
      expect(expectedActions[1]).toHaveProperty('payload', mockedPayload)
    })
  })
})
