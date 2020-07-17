import {
  createSavingAttachmentJob,
  resetSavingAttachmentJob,
  resetSedAttachments,
  sendAttachmentToSed
} from 'actions/buc'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import JoarkBrowser from 'components/JoarkBrowser/JoarkBrowser'
import { HighContrastHovedknapp, HighContrastKnapp, VerticalSeparatorDiv } from 'components/StyledComponents'
import { AttachedFiles, Buc, BUCAttachments, SavingAttachmentsJob, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
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
  onAttachmentsSubmit?: (jf: JoarkFiles) => void
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

  // initially, joark is empty
  const [sedAttachments, setSedAttachments] = useState<AttachedFiles>({
    sed: sed.attachments || [] as BUCAttachments,
    joark: [] as JoarkFiles
  })

  const [sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [attachmentsTableVisible, setAttachmentsTableVisible] = useState<boolean>(initialSeeAttachmentPanel)
  const { attachmentsError }: SEDBodySelector = useSelector<State, SEDBodySelector>(mapState)

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkFile): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const onAttachmentsPanelClose = () => {
    setAttachmentsTableVisible(false)
  }

  const onAttachmentsPanelOpen = () => {
    setAttachmentsTableVisible(true)
    setAttachmentsSent(false)
  }

  const onSedAttachmentsChanged = useCallback((sedFiles: BUCAttachments) => {
    const newFiles: AttachedFiles = {
      ...sedAttachments,
      sed: sedFiles
    }
    console.log('newFiles Sed', newFiles)
    setSedAttachments(newFiles)
  }, [setSedAttachments])

  const onJoarkAttachmentsChanged = (joarkFiles: JoarkFiles) => {
    const newFiles: AttachedFiles = {
      ...sedAttachments,
      joark: joarkFiles
    }
    console.log('newFiles Joark', newFiles)
    setSedAttachments(newFiles)
  }

  const onAttachmentsSubmitted = () => {
    setSendingAttachments(true)
    setAttachmentsTableVisible(false)
    standardLogger('buc.edit.attachments.data', {
      numberOfJoarkAttachments: sedAttachments.joark.length
    })
    const joarksToUpload: JoarkFiles = _.cloneDeep(sedAttachments.joark as JoarkFiles)
    dispatch(createSavingAttachmentJob(joarksToUpload))
    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(joarksToUpload)
    }
  }

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      setSendingAttachments(false)
      setAttachmentsTableVisible(false)
      dispatch(resetSedAttachments())
    }
  }, [attachmentsSent, dispatch, sendingAttachments])

  useEffect(() => {
    onSedAttachmentsChanged(sed.attachments)
  }, [onSedAttachmentsChanged, sed])

  return (
    <SEDBodyDiv>
      {canHaveAttachments && (
        <>
          <VerticalSeparatorDiv/>
          <Undertittel>
            {t('ui:attachments')}
          </Undertittel>
          <VerticalSeparatorDiv data-size='2'/>
            {sedAttachments && (sedAttachments.sed || sedAttachments.joark) && (
              <SEDAttachmentsTable
                attachments={sedAttachments}
                highContrast={highContrast}
                onJoarkAttachmentsChanged={onJoarkAttachmentsChanged}
              />
            )}
            <>
              <VerticalSeparatorDiv/>
              {!attachmentsSent ?
                sedAttachments.joark.length > 0 && (
                  <HighContrastHovedknapp
                    disabled={sendingAttachments}
                    spinner={sendingAttachments}
                    onClick={onAttachmentsSubmitted}
                  >
                    {sendingAttachments ? t('ui:uploading') : t('buc:form-submitSelectedAttachments')}
                  </HighContrastHovedknapp>
                )
              : (
                <HighContrastKnapp
                  onClick= {() => {
                    setAttachmentsSent(false)
                    dispatch(resetSavingAttachmentJob())
                  }}
                >
                  {t('ui:ok')}
                </HighContrastKnapp>
              )}
            </>
          <VerticalSeparatorDiv/>
          {(sendingAttachments || attachmentsSent) ? (
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
                <VerticalSeparatorDiv/>
              </>
            </SEDAttachmentSenderDiv>
          ) : (
            <>
             <HighContrastKnapp
                data-testid='a-buc-c-sedattachments-button-id'
                onClick={() => !attachmentsTableVisible ? onAttachmentsPanelOpen() :  onAttachmentsPanelClose()}
              >
                {t(attachmentsTableVisible ? 'ui:hideAttachments' : 'ui:showAttachments')}
             </HighContrastKnapp>
             <VerticalSeparatorDiv/>
            </>
          )}
          {attachmentsTableVisible && (
            <>
              <JoarkBrowser
                files={sedAttachments.joark as JoarkFiles}
                onFilesChange={onJoarkAttachmentsChanged}
              />
              <VerticalSeparatorDiv data-size='1.5' />
            </>
          )}
        </>
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
