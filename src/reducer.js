import bucReducer, { initialBucState } from './reducers/buc'
import uiReducer, { initialUiState } from './reducers/ui'

const mainReducer = ({ buc, ui }, action) => {
  return {
    buc: bucReducer(buc, action),
    ui: uiReducer(ui, action)
  }
}

export const initialState = {
  buc: initialBucState,
  ui: initialUiState
}

export default mainReducer
