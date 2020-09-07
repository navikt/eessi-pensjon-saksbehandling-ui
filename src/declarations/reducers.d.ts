import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { BucState } from 'reducers/buc'
import { JoarkState } from 'reducers/joark'
import { LoadingState } from 'reducers/loading'
import { PInfoState } from 'reducers/pinfo'
import { UiState } from 'reducers/ui'

export interface State {
  alert: AlertState
  app: AppState
  buc: BucState
  joark: JoarkState
  loading: LoadingState
  pinfo: PInfoState
  ui: UiState
}
