import { AlertStatus } from 'declarations/components.d'
import PT from 'prop-types'

export const AlertErrorPropType = PT.shape({
  status: PT.oneOf<AlertStatus>(['OK', 'ERROR', 'WARNING']).isRequired,
  message: PT.string.isRequired,
  error: PT.string.isRequired,
  uuid: PT.string.isRequired
})

export const FilePropType = PT.shape({
  id: PT.string,
  size: PT.number.isRequired,
  name: PT.string.isRequired,
  numPages: PT.number,
  mimetype: PT.string.isRequired,
  content: PT.shape({
    text: PT.string,
    base64: PT.string
  }).isRequired
})

export const FilesPropType = PT.arrayOf(FilePropType.isRequired)

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
  closeButton: PT.bool
})
