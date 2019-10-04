import alertReducer, { initialAlertState } from './reducers/alert'
import appReducer, { initialAppState } from './reducers/app'
import bucReducer, { initialBucState } from './reducers/buc'
import joarkReducer, { initialJoarkState } from './reducers/joark'
import loadingReducer, { initialLoadingState } from './reducers/loading'
import pinfoReducer, { initialPinfoState } from './reducers/pinfo'
import storageReducer, { initialStorageState } from './reducers/storage'
import uiReducer, { initialUiState } from './reducers/ui'

const mainReducer = (state, action) => {
  return {
    alert: alertReducer(state.alert, action),
    app: appReducer(state.app, action),
    buc: bucReducer(state.buc, action),
    joark: joarkReducer(state.joark, action),
    loading: loadingReducer(state.loading, action),
    pinfo: pinfoReducer(state.pinfo, action),
    storage: storageReducer(state.storage, action),
    ui: uiReducer(state.ui, action)
  }
}

export const initialState = {
  alert: initialAlertState,
  app: initialAppState,
  buc: initialBucState,
  joark: initialJoarkState,
  loading: initialLoadingState,
  pinfo: initialPinfoState,
  storage: initialStorageState,
  ui: initialUiState
}

export default mainReducer
