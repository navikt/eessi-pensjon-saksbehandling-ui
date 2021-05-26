import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { BucState } from 'reducers/buc'
import { JoarkState } from 'reducers/joark'
import { LoadingState } from 'reducers/loading'
import { P5000State } from 'reducers/p5000'
import { UiState } from 'reducers/ui'

export interface State {
  alert: AlertState
  app: AppState
  buc: BucState
  joark: JoarkState
  loading: LoadingState
  p5000: P5000State
  ui: UiState
}
