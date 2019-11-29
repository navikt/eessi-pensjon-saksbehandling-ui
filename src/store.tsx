import React, { Context, createContext, useContext } from 'react'
import useThunkReducer from 'react-hook-thunk-reducer'
import { ActionCreator, ActionCreators, Dispatch, State } from './types'

const Store: Context<State> = createContext({} as State)
const useStore = () => useContext(Store)

interface StoreProviderProps {
  reducer: any;
  initialState: {[k: string]: any};
  children: JSX.Element;
}

export const StoreProvider = ({ reducer, initialState, children }: StoreProviderProps) => {
  const [state, dispatch] = useThunkReducer(reducer, initialState)
  return (
    <Store.Provider value={[state, dispatch]}>
      {children}
    </Store.Provider>
  )
}

const bindActionCreator = (actionCreator: Function, dispatch: Dispatch) => {
  return (...args: any[]) => {
    // @ts-ignore
    return dispatch(actionCreator.apply(this, args))
  }
}

export const bindActionCreators = (actionCreators: ActionCreators | ActionCreator, dispatch: Dispatch) => {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  if (typeof actionCreators === 'object') {
    const keys = Object.keys(actionCreators)
    const boundActionCreators = {} as {[k: string]: Function}
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
  mapStateToProps: Function,
  mapDispatchToProps: Function
) => (WrappedComponent: React.FC<any>) => {
  return (props: any) => {
    const [state, dispatch]: any = useStore()
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
