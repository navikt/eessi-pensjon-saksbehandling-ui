import * as api from 'actions/api'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

const mockStore = configureMockStore([thunk])

describe('actions/api', () => {
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
      .reply(500, { message: 'error' })

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
        expect(expectedActions[1]).toHaveProperty('type', 'SERVER/INTERNAL/ERROR')
      })
  })

  it('call() with fake url, 500 response and failWith500', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(500, { message: 'unauthorized' })

    return store.dispatch(api.call({
      url: 'http://mockedurl/',
      failWith500: true,
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

  it('call() with fake url and 401 response', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(401, { message: 'unauthorized' })

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
        expect(expectedActions[1]).toHaveProperty('type', 'SERVER/UNAUTHORIZED/ERROR')
      })
  })

  it('call() with fake url, 401 response and failWith401', () => {
    nock('http://mockedurl')
      .get('/')
      .reply(401, { message: 'unauthorized' })

    return store.dispatch(api.call({
      url: 'http://mockedurl/',
      failWith401: true,
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
        expect(expectedActions[1]).toHaveProperty('type', 'SERVER/UNAUTHORIZED/ERROR')
        expect(expectedActions[2]).toHaveProperty('type', 'FAILURE')
      })
  })

  it('fakecall()', async (done) => {
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
      done()
    })
  })

  it('decides to use call as we are in localhost and test env', () => {
    expect(api.funcCall.name).toEqual('call')
  })

  it('decides to use fakecall as we are in localhost and NOT test env', () => {
    jest.resetModules()
    jest.mock('constants/urls', () => {
      return { HOST: 'localhost' }
    })
    jest.mock('constants/environment', () => {
      return { IS_TEST: false }
    })
    const newapi = require('actions/api')
    expect(newapi.funcCall.name).toEqual('fakecall')
  })
})
