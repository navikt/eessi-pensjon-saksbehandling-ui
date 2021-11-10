import Document from 'assets/icons/document'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { AlertStatus } from 'declarations/components'
import { JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemsFileType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'
import PT from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import AlertStripe from 'nav-frontend-alertstriper'

export interface SEDAttachmentModalProps {
  highContrast: boolean
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  open: boolean
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

export interface SEDAttachmentModalSelector {
  clientErrorParam: any | undefined
  clientErrorStatus: AlertStatus | undefined
  clientErrorMessage: string | undefined
  serverErrorMessage: string | undefined
  error: any | undefined
}

const mapState = (state: State): SEDAttachmentModalSelector => ({
  clientErrorParam: state.alert.clientErrorParam,
  clientErrorStatus: state.alert.clientErrorStatus,
  clientErrorMessage: state.alert.clientErrorMessage,
  serverErrorMessage: state.alert.serverErrorMessage,
  error: state.alert.error
})

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  highContrast, onFinishedSelection, open, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const { clientErrorParam, clientErrorMessage, clientErrorStatus } = useSelector<State, SEDAttachmentModalSelector>(mapState)
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)

  const onRowSelectChange = (items: JoarkBrowserItems): void => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = (): void => {
    onFinishedSelection(_items)
    onModalClose()
  }

  const onCancelButtonClick = (): void => {
    onModalClose()
  }

  return (
    <Modal
      open={open}
      highContrast={highContrast}
      icon={<Document />}
      modal={{
        closeButton: true,
        modalContent: (
          <>
            {clientErrorMessage && clientErrorStatus === 'ERROR' && (
              <AlertStripe type='feil'>
                {t(clientErrorMessage, clientErrorParam)}
              </AlertStripe>
            )}
            <JoarkBrowser
              data-test-id='a-buc-c-sedattachmentmodal__joarkbrowser-id'
              existingItems={sedAttachments}
              mode='select'
              onRowSelectChange={onRowSelectChange}
              tableId={tableId}
            />
          </>
        ),
        modalButtons: [{
          main: true,
          text: t('buc:form-addSelectedAttachments'),
          onClick: onAddAttachmentsButtonClick
        }, {
          text: t('ui:cancel'),
          onClick: onCancelButtonClick
        }]
      }}
      onModalClose={onModalClose}
    />
  )
}

SEDAttachmentModal.propTypes = {
  onFinishedSelection: PT.func.isRequired,
  onModalClose: PT.func.isRequired,
  sedAttachments: JoarkBrowserItemsFileType.isRequired,
  tableId: PT.string.isRequired
}

export default SEDAttachmentModal
