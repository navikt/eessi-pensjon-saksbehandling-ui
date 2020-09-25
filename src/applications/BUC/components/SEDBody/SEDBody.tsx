import {
  createSavingAttachmentJob,
  resetSavingAttachmentJob,
  resetSedAttachments,
  sendAttachmentToSed
} from 'actions/buc'
import { sedAttachmentSorter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDAttachmentModal from 'applications/BUC/components/SEDAttachmentModal/SEDAttachmentModal'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { HighContrastHovedknapp, HighContrastKnapp, VerticalSeparatorDiv } from 'components/StyledComponents'
import { Buc, SEDAttachment, SEDAttachments, SavingAttachmentsJob, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkBrowserItem, JoarkBrowserItems } from 'declarations/joark'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

export interface SEDBodyProps {
  aktoerId: string
  buc: Buc
  canHaveAttachments: boolean
  canShowProperties: boolean
  highContrast: boolean
  initialAttachmentsSent?: boolean
  initialSeeAttachmentPanel?: boolean
  initialSendingAttachments?: boolean
  onAttachmentsSubmit?: (jbi: JoarkBrowserItems) => void
  onAttachmentsPanelOpen?: (o: boolean) => void
  sed: Sed
}

export interface SEDBodySelector {
  attachmentsError?: boolean
}

const mapState = (state: State): SEDBodySelector => ({
  attachmentsError: state.buc.attachmentsError
})

const SEDBodyDiv = styled.div``

const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`

const SEDBody: React.FC<SEDBodyProps> = ({
  aktoerId, buc, canHaveAttachments, initialAttachmentsSent = false, highContrast, initialSeeAttachmentPanel = false,
  initialSendingAttachments = false, onAttachmentsSubmit, sed
}: SEDBodyProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const convertSedAttachmentsToJoarkBrowserItems = (sedAttachments: SEDAttachments): JoarkBrowserItems | undefined => {
    if (!sedAttachments) {
      return undefined
    }
    return sedAttachments.map((att: SEDAttachment) => {
      return {
        key: att.id,
        type: 'sed',
        title: att.name,
        date: att.lastUpdate,
        hasSubrows: false,
        disabled: false,
        dokumentInfoId: att.documentId,
        journalpostId: '',
        openSubrows: false,
        tema: undefined,
        variant: undefined,
        visible: true,
        selected: false
      } as JoarkBrowserItem
    })
  }

  // initially, joark is empty
  const [items, setItems] = useState<JoarkBrowserItems>(
    convertSedAttachmentsToJoarkBrowserItems(sed.attachments) || []
  )

  const [sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(initialSeeAttachmentPanel)
  const { attachmentsError }: SEDBodySelector = useSelector<State, SEDBodySelector>(mapState)

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkBrowserItem): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const onAttachmentsPanelClose = () => {
    setAttachmentsTableVisible(false)
  }

  const onAttachmentsPanelOpen = () => {
    setAttachmentsTableVisible(true)
    setAttachmentsSent(false)
  }

  const onRowViewDelete = (newItems: JoarkBrowserItems) => {
    setItems(newItems)
  }

  const onSedAttachmentsChanged = useCallback((sedAttachments: SEDAttachments) => {
    setItems(convertSedAttachmentsToJoarkBrowserItems(sedAttachments) || [])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setItems])

  const onJoarkAttachmentsChanged = (jbi: JoarkBrowserItems) => {
    const sedOriginalAttachments = _.filter(items, (att) => att.type !== 'joark')
    const newAttachments = sedOriginalAttachments.concat(jbi).sort(sedAttachmentSorter)
    setItems(newAttachments)
  }

  const onAttachmentsSubmitted = () => {
    setSendingAttachments(true)
    setAttachmentsTableVisible(false)

    const joarkItemsToUpload: JoarkBrowserItems = _.filter(items, f => f.type === 'joark')
    standardLogger('buc.edit.attachments.data', {
      numberOfJoarkAttachments: joarkItemsToUpload.length
    })

    dispatch(createSavingAttachmentJob(joarkItemsToUpload))
    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(joarkItemsToUpload)
    }
  }

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      setSendingAttachments(false)
      setAttachmentsTableVisible(false)
      dispatch(resetSedAttachments())
    }
    if (!sendingAttachments && attachmentsSent) {
      setAttachmentsSent(false)
      dispatch(resetSavingAttachmentJob())
    }
  }, [attachmentsSent, dispatch, sendingAttachments])

  useEffect(() => {
    onSedAttachmentsChanged(sed.attachments)
  }, [onSedAttachmentsChanged, sed])

  return (
    <SEDBodyDiv>
      <VerticalSeparatorDiv />
      <Undertittel>
        {t('ui:attachments')}
      </Undertittel>
      <VerticalSeparatorDiv data-size='2' />
      {items && (
        <JoarkBrowser
          tableId={'viewsed-' + sed.id}
          mode='view'
          highContrast={highContrast}
          existingItems={items}
          onRowViewDelete={onRowViewDelete}
        />
      )}
      <>
        <VerticalSeparatorDiv />
        {!attachmentsSent && _.find(items, (item) => item.type === 'joark') !== undefined && (
          <HighContrastHovedknapp
            disabled={sendingAttachments}
            spinner={sendingAttachments}
            onClick={onAttachmentsSubmitted}
          >
            {sendingAttachments ? t('ui:uploading') : t('buc:form-submitSelectedAttachments')}
          </HighContrastHovedknapp>
        )}
      </>
      <VerticalSeparatorDiv />
      {canHaveAttachments && (
        (sendingAttachments || attachmentsSent) ? (
          <SEDAttachmentSenderDiv>
            <>
              <SEDAttachmentSender
                attachmentsError={attachmentsError}
                sendAttachmentToSed={_sendAttachmentToSed}
                payload={{
                  aktoerId: aktoerId,
                  rinaId: buc.caseId,
                  rinaDokumentId: sed.id
                } as SEDAttachmentPayload}
                onSaved={(savingAttachmentsJob: SavingAttachmentsJob) => onJoarkAttachmentsChanged(savingAttachmentsJob.remaining)}
                onFinished={() => setAttachmentsSent(true)}
              />
              <VerticalSeparatorDiv />
            </>
          </SEDAttachmentSenderDiv>
        ) : (
          <>
            <HighContrastKnapp
              data-testid='a-buc-c-sedattachments-button-id'
              onClick={() => !attachmentsTableVisible ? onAttachmentsPanelOpen() : onAttachmentsPanelClose()}
            >
              {t(attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
            </HighContrastKnapp>
            <VerticalSeparatorDiv />
          </>
        ))}
      {attachmentsTableVisible && (
        <SEDAttachmentModal
          tableId={'sedview' + sed.id + '-modal'}
          sedAttachments={items}
          onModalClose={onAttachmentsPanelClose}
          onFinishedSelection={onJoarkAttachmentsChanged}
        />
      )}
    </SEDBodyDiv>
  )
}

SEDBody.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  canHaveAttachments: PT.bool.isRequired,
  canShowProperties: PT.bool.isRequired,
  initialAttachmentsSent: PT.bool,
  initialSeeAttachmentPanel: PT.bool,
  initialSendingAttachments: PT.bool,
  onAttachmentsSubmit: PT.func,
  onAttachmentsPanelOpen: PT.func,
  sed: SedPropType.isRequired
}

export default SEDBody
