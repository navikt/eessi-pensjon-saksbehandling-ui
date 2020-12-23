import Document from 'assets/icons/document'
import Alert from 'components/Alert/Alert'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import Modal from 'components/Modal/Modal'
import { AlertStatus } from 'declarations/components'
import { JoarkBrowserItems } from 'declarations/joark'
import { JoarkBrowserItemsFileType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import NavHighContrast from 'nav-hoykontrast'

export interface SEDAttachmentModalProps {
  highContrast: boolean
  onFinishedSelection: (jbi: JoarkBrowserItems) => void
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
  highContrast, onFinishedSelection, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const { clientErrorParam, clientErrorMessage, clientErrorStatus, error } = useSelector<State, SEDAttachmentModalSelector>(mapState)
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
    <NavHighContrast highContrast={highContrast}>
      <Modal
        highContrast={highContrast}
        icon={<Document />}
        modal={{
          closeButton: true,
          modalContent: (
            <>
              {clientErrorMessage && clientErrorStatus === 'ERROR' && (
                <Alert
                  type='client'
                  message={t(clientErrorMessage, clientErrorParam)}
                  status={clientErrorStatus}
                  error={error}
                />
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
    </NavHighContrast>
  )
}

SEDAttachmentModal.propTypes = {
  highContrast: PT.bool.isRequired,
  onFinishedSelection: PT.func.isRequired,
  onModalClose: PT.func.isRequired,
  sedAttachments: JoarkBrowserItemsFileType.isRequired,
  tableId: PT.string.isRequired
}

export default SEDAttachmentModal
