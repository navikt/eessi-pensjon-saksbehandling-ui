import React, { useContext, createContext } from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'

const Store = createContext()
const useStore = () => useContext(Store)

export const StoreProvider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useThunkReducer(reducer, initialState)
  return (
    <Store.Provider value={[state, dispatch]}>
      {children}
    </Store.Provider>
  )
}

const bindActionCreator = (actionCreator, dispatch) => {
  return (...args) => {
    return dispatch(actionCreator.apply(this, args))
  }
}

export const bindActionCreators = (actionCreators, dispatch) => {
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

export const connect = (
  mapStateToProps = () => {},
  mapDispatchToProps = () => {}
) => WrappedComponent => {
  return props => {
    const [state, dispatch] = useStore()
    return (
      <WrappedComponent
        {...props}
        dispatch={dispatch}
        {...mapStateToProps(state, props)}
        {...mapDispatchToProps(dispatch, props)}
      />
    )
  }
}
