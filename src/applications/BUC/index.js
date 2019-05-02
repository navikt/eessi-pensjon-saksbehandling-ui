import React from 'react'
import { reducer, initialState } from './reducer'
import BUC from './BUC'

export const Store = React.createContext()

export const StoreProvider = (props) => {

  const [ state, dispatch ] = React.useReducer(reducer, initialState)

  return <Store.Provider
    value = {{state, dispatch}}>
    {props.children}
  </Store.Provider>
}

const App = (props) => {
  return <StoreProvider>
    <div className='a-buc'>
      <BUC/>
    </div>
  </StoreProvider>
}

export default App
