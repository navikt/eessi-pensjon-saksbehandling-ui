import React, { useReducer, useContext, createContext } from 'react'

const Store = createContext()

const StoreProvider = ({ reducer, initialState, children }) => {
  return <Store.Provider value={useReducer(reducer, initialState)}>
    {children}
  </Store.Provider>
}

const connect = (
  mapStateToProps = () => {},
  mapDispatchToProps = () => {}
) => WrappedComponent => {
  return props => {
    const { dispatch, state } = useContext(Store)
    return <WrappedComponent
      dispatch={dispatch}
      {...mapStateToProps(state, props)}
      {...mapDispatchToProps(dispatch, props)}
    />
  }
}

const useStore = () => useContext(Store)

export { StoreProvider, useStore, connect }
