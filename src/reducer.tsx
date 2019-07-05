import alertReducer, { initialAlertState } from './reducers/alert'
import appReducer, { initialAppState, AppReducer } from './reducers/app'
import bucReducer, { initialBucState, BucReducer } from './reducers/buc'
import joarkReducer, { initialJoarkState } from './reducers/joark'
import loadingReducer, { initialLoadingState } from './reducers/loading'
import p4000Reducer, { initialP4000State } from './reducers/p4000'
import p6000Reducer, { initialP6000State } from './reducers/p6000'
import pdfReducer, { initialPdfState } from './reducers/pdf'
import pinfoReducer, { initialPinfoState } from './reducers/pinfo'
import storageReducer, { initialStorageState } from './reducers/storage'
import uiReducer, { initialUiState } from './reducers/ui'

interface MainReducer {
  alert: any,
  app: AppReducer,
  buc: BucReducer,
  joark: any,
  loading: any,
  p4000: any,
  p6000: any,
  pdf: any,
  pinfo: any,
  storage: any,
  ui: any
}

const mainReducer = (state: MainReducer, action: any) => {
  return {
    alert: alertReducer(state.alert, action),
    app: appReducer(state.app, action),
    buc: bucReducer(state.buc, action),
    joark: joarkReducer(state.joark, action),
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
  joark: initialJoarkState,
  loading: initialLoadingState,
  p4000: initialP4000State,
  p6000: initialP6000State,
  pdf: initialPdfState,
  pinfo: initialPinfoState,
  storage: initialStorageState,
  ui: initialUiState
}

export default mainReducer
