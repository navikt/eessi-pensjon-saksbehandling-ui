import { AlertState } from 'reducers/alert'
import { AppState } from 'reducers/app'
import { BucState } from 'reducers/buc'
import { JoarkState } from 'reducers/joark'
import { JournalføringState } from 'reducers/journalføring'
import { LoadingState } from 'reducers/loading'
import { P5000State } from 'reducers/p5000'
import { PageNotificationState } from 'reducers/pagenotification'
import { UiState } from 'reducers/ui'

export interface State {
  alert: AlertState
  app: AppState
  buc: BucState
  joark: JoarkState
  journalføring: JournalføringState
  loading: LoadingState
  pagenotification: PageNotificationState
  p5000: P5000State
  ui: UiState
}
