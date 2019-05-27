import alertReducer, { initialAlertState } from './reducers/alert'
import appReducer, { initialAppState } from './reducers/app'
import bucReducer, { initialBucState } from './reducers/buc'
import loadingReducer, { initialLoadingState } from './reducers/loading'
import p4000Reducer, { initialP4000State } from './reducers/p4000'
import p6000Reducer, { initialP6000State } from './reducers/p6000'
import pdfReducer, { initialPdfState } from './reducers/pdf'
import pinfoReducer, { initialPinfoState } from './reducers/pinfo'
import storageReducer, { initialStorageState } from './reducers/storage'
import uiReducer, { initialUiState } from './reducers/ui'

const mainReducer = (state, action) => {
  return {
    alert: alertReducer(state.alert, action),
    app: appReducer(state.app, action),
    buc: bucReducer(state.buc, action),
    loading: loadingReducer(state.loading, action),
    p4000: p4000Reducer(state.p4000, action),
    p6000: p6000Reducer(state.p6000, action),
    pdf: pdfReducer(state.pdf, action),
    pinfo: pinfoReducer(state.pinfo, action),
    storage: storageReducer(state.storage, action),
    ui: uiReducer(state.ui, action)
  }
}

export const initialState = {
  alert: initialAlertState,
  app: initialAppState,
  buc: initialBucState,
  loading: initialLoadingState,
  p4000: initialP4000State,
  p6000: initialP6000State,
  pdf: initialPdfState,
  pinfo: initialPinfoState,
  storage: initialStorageState,
  ui: initialUiState
}

export default mainReducer
