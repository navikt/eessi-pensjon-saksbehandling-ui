import { AlertVariant } from 'declarations/components.d'
import PT from 'prop-types'

export const AlertErrorPropType = PT.shape({
  status: PT.oneOf<AlertVariant>(['info', 'error', 'warning', 'success']).isRequired,
  message: PT.string.isRequired,
  error: PT.string.isRequired,
  uuid: PT.string.isRequired
})

export const ModalButtonPropType = PT.shape({
  onClick: PT.func,
  disabled: PT.bool,
  main: PT.bool,
  text: PT.string.isRequired
})

export const ModalContentPropType = PT.shape({
  modalTitle: PT.string,
  modalContent: PT.oneOfType([PT.element, PT.string]),
  modalText: PT.string,
  modalButtons: PT.arrayOf(ModalButtonPropType.isRequired),
})
