import { AdminState } from 'src/reducers/admin'
import { AlertState } from 'src/reducers/alert'
import { AppState } from 'src/reducers/app'
import { BucState } from 'src/reducers/buc'
import { JoarkState } from 'src/reducers/joark'
import { LoadingState } from 'src/reducers/loading'
import { LocalStorageState } from 'src/reducers/localStorage'
import { P5000State } from 'src/reducers/p5000'
import { PersonState } from 'src/reducers/person'
import { UiState } from 'src/reducers/ui'
import { ValidationState } from 'src/reducers/validation'

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
