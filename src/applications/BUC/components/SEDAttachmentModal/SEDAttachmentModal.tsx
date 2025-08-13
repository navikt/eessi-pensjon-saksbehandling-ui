import JoarkBrowser from 'src/components/JoarkBrowser/JoarkBrowser'
import Modal from 'src/components/Modal/Modal'
import { AlertVariant } from 'src/declarations/components'
import {JoarkBrowserItems, JoarkBrowserItemWithContent} from 'src/declarations/joark'
import { JoarkBrowserItemsFileType } from 'src/declarations/joark.pt'
import { State } from 'src/declarations/reducers'
import PT from 'prop-types'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import { Alert } from '@navikt/ds-react'
//import File from "@navikt/forhandsvisningsfil";
import {setJoarkItemPreview} from "../../../../actions/joark";
import PDFViewer from "src/components/PDFViewer/PDFViewer";

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
  previewFile: JoarkBrowserItemWithContent | undefined
}

const mapState = (state: State): SEDAttachmentModalSelector => ({
  alertVariant: state.alert.stripeStatus as AlertVariant,
  alertMessage: state.alert.stripeMessage,
  alertType: state.alert.type,
  error: state.alert.error,
  previewFile: state.joark.previewFile
})

const SEDAttachmentModal: React.FC<SEDAttachmentModalProps> = ({
  onFinishedSelection, open, onModalClose, sedAttachments, tableId
}: SEDAttachmentModalProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { alertVariant, alertMessage, previewFile } = useSelector<State, SEDAttachmentModalSelector>(mapState)
  const [_items, setItems] = useState<JoarkBrowserItems>(sedAttachments)
  const [_itemsForJoarkBrowser, setItemsForJoarkBrowser] = useState<JoarkBrowserItems>(sedAttachments)
  const [_itemsPerPage, setItemsPerPage] = useState<number>(10)
  const [_preview, setPreview] = useState<any | undefined>(undefined)
  const [_currentPage, setCurrentPage] = useState<number>(1)

  const onRowSelectChange = (items: JoarkBrowserItems): void => {
    setItems(items)
  }

  const onAddAttachmentsButtonClick = (): void => {
    onFinishedSelection(_items)
    resetPreviewAndReturnTrue()
    onModalClose()
  }

  const onCancelButtonClick = (): void => {
    resetPreviewAndReturnTrue()
    onModalClose()
  }

  const resetPreviewAndReturnTrue = (): boolean => {
    resetPreview()
    return true
  }

  const resetPreview = (): boolean => {
    dispatch(setJoarkItemPreview(undefined))
    return false
  }

  useEffect(() => {
    if (!previewFile) {
      return setPreview(undefined)
    }
    setPreview(
      <div
        style={{ cursor: 'pointer'}}
      >
        <PDFViewer
          file={previewFile?.content.base64}
          name={previewFile?.name ?? ''}
          size={previewFile?.size ?? 0}
          width={900}
          height={1200}
        />
      </div>
    )
  }, [previewFile])

  useEffect(() => {
    if (previewFile) {
      setItemsForJoarkBrowser(_items)
    }
  }, [previewFile])

  return (
    <Modal
      open={open}
      modal={{
        modalContent: (
          _preview ? _preview :
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
              existingItems={_itemsForJoarkBrowser}
              mode='select'
              onRowSelectChange={onRowSelectChange}
              tableId={tableId}
              itemsPerPage={_itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              currentPage={_currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ),
        modalButtons: !_preview ? [{
          main: true,
          text: t('buc:form-addSelectedAttachments'),
          onClick: onAddAttachmentsButtonClick
        }, {
          text: t('ui:cancel'),
          onClick: onCancelButtonClick
        }] : []
      }}
      onModalClose={onModalClose}
      onBeforeClose={_preview ? resetPreview : resetPreviewAndReturnTrue}
      width={"900"}
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
