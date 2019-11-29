import reducer, { initialState } from './reducer'

describe('reducer', () => {
  it('is a function', () => {
    expect(typeof reducer).toEqual('function')
  })

  it('inits', () => {
    const generatedReducer = reducer({}, {})
    expect(generatedReducer).toHaveProperty('alert')
    expect(generatedReducer).toHaveProperty('app')
    expect(generatedReducer).toHaveProperty('buc')
    expect(generatedReducer).toHaveProperty('joark')
    expect(generatedReducer).toHaveProperty('loading')
    expect(generatedReducer).toHaveProperty('pinfo')
    expect(generatedReducer).toHaveProperty('storage')
    expect(generatedReducer).toHaveProperty('ui')
  })

  it('initStates', () => {
    expect(initialState).toHaveProperty('alert')
    expect(initialState).toHaveProperty('app')
    expect(initialState).toHaveProperty('buc')
    expect(initialState).toHaveProperty('joark')
    expect(initialState).toHaveProperty('loading')
    expect(initialState).toHaveProperty('pinfo')
    expect(initialState).toHaveProperty('storage')
    expect(initialState).toHaveProperty('ui')
  })
})
