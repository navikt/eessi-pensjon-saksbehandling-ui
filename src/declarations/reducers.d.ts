import { AdminState } from 'reducers/admin'
import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { BucState } from 'reducers/buc'
import { JoarkState } from 'reducers/joark'
import { LoadingState } from 'reducers/loading'
import { LocalStorageState } from 'reducers/localStorage'
import { P5000State } from 'reducers/p5000'
import { PersonState } from 'reducers/person'
import { UiState } from 'reducers/ui'
import { ValidationState } from 'reducers/validation'

export interface State {
  admin: AdminState
  alert: AlertState
  app: AppState
  buc: BucState
  joark: JoarkState
  loading: LoadingState
  localStorage: LocalStorageState
  p5000: P5000State
  person: PersonState
  ui: UiState,
  validation: ValidationState
}
