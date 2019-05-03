import React, { useReducer, useContext, createContext } from 'react'

const Store = createContext()
const useStore = () => useContext(Store)

const StoreProvider = ({ reducer, initialState, children }) => {
  const [ state, dispatch ] = useReducer(reducer, initialState)
  const thunkDispatch = (action) => {
    if (typeof action === 'function') {
      return action(dispatch, state)
    }
    return dispatch(action)
  }
  return <Store.Provider value={[ state, thunkDispatch ]}>
     {children}
   </Store.Provider>
}

const bindActionCreator = (actionCreator, dispatch) => {
  return function() {
    return dispatch(actionCreator.apply(this, arguments))
  }
}

const bindActionCreators = (actionCreators, dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators === 'object') {
    const keys = Object.keys(actionCreators)
    const boundActionCreators = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const actionCreator = actionCreators[key]
      if (typeof actionCreator === 'function') {
        boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
      }
    }
    return boundActionCreators
  }
  return {}
}

const connect = (
  mapStateToProps = () => {},
  mapDispatchToProps = () => {}
) => WrappedComponent => {
  return props => {
    const [ state, dispatch ] = useStore()
    return <WrappedComponent
      dispatch={dispatch}
      {...mapStateToProps(state, props)}
      {...mapDispatchToProps(dispatch, props)}
    />
  }
}

export { StoreProvider, useStore, connect, bindActionCreators }
