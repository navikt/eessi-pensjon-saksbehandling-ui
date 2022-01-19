import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'

export type AlertVariant = 'error' | 'warning' | 'info' | 'success'

export interface AlertError {
  status?: AlertVariant
  message?: JSX.Element | string
  error?: string | undefined
  uuid ?: string | undefined
}

export interface ModalButton {
  onClick?: () => void
  disabled ?: boolean
  main?: boolean
  flat?: boolean
  text: string
}

export interface ModalContent {
  modalTitle?: string | null
  modalContent ?: JSX.Element |string |null
  modalText ?: string |null
  modalButtons?: Array<ModalButton> |null
  closeButton?: boolean | null
}

export interface GetS3FilesJob {
  total: Array<any>
  loaded: Array<any>
  notloaded: Array<any>
  loading: any | undefined
  remaining: Array<any>
}
