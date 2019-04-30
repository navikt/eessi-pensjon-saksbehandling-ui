import React from 'react'
import { reducer, initialState } from './reducer'

const Context = React.createContext()

export const Store = (props) => {

  const [ state, dispatch ] = React.useReducer(reducer, initialState)

  return <Context.Provider
    value = {{state, dispatch}}>
    {props.children}
  </Context.Provider>
}
