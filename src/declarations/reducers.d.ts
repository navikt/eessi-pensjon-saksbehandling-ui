import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { BucState } from 'reducers/buc'
import { JoarkState } from 'reducers/joark'
import { LoadingState } from 'reducers/loading'
import { LocalStorageState } from 'reducers/localStorage'
import { P5000State } from 'reducers/p5000'
import { PersonState } from 'reducers/person'
import { PageNotificationState } from 'reducers/pagenotification'
import { UiState } from 'reducers/ui'
import { ValidationState } from 'reducers/validation'

export interface State {
  alert: AlertState
  app: AppState
  buc: BucState
  joark: JoarkState
  loading: LoadingState
  localStorage: LocalStorageState
  pagenotification: PageNotificationState
  p5000: P5000State
  person: PersonState
  ui: UiState,
  validation: ValidationState
}
