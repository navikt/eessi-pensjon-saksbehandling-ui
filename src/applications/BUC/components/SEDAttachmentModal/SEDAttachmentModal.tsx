import Document from 'assets/icons/document'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { AlertVariant } from 'declarations/components'
import { JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemsFileType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'
import PT from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Alert } from '@navikt/ds-react'

export interface SEDAttachmentModalProps {
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
  open: boolean
  onModalClose: () => void
  sedAttachments: JoarkBrowserItems
  tableId: string
}

export interface SEDAttachmentModalSelector {
  alertType: string | undefined
  alertMessage: JSX.Element | string | undefined
  alertVariant: AlertVariant | undefined
  error: any | undefined
}

const mapState = (state: State): SEDAttachmentModalSelector => ({
  alertVariant: state.alert.stripeStatus as AlertVariant,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  error: state.alert.error
})

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  onFinishedSelection, open, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const { alertVariant, alertMessage } = useSelector<State, SEDAttachmentModalSelector>(mapState)
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
      icon={<Document />}
      modal={{
        modalContent: (
          <>
            {alertMessage && alertVariant === 'error' && (
              <Alert
                data-testid='a_buc_c_sedattachmentmodal--alert_id'
                variant='error'
              >
                {alertMessage}
              </Alert>
            )}
            <JoarkBrowser
              data-testid='a_buc_c_sedattachmentmodal--joarkbrowser-id'
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
