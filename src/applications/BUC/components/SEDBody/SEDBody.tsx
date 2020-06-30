import { resetSedAttachments, sendAttachmentToSed } from 'actions/buc'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { AttachedFiles, Buc, BUCAttachments, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { Undertittel } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

export interface SEDBodyProps {
  aktoerId: string;
  buc: Buc;
  canHaveAttachments: boolean;
  canShowProperties: boolean;
  initialAttachmentsSent?: boolean;
  initialSeeAttachmentPanel?: boolean;
  initialSendingAttachments?: boolean;
  onAttachmentsSubmit?: (af: AttachedFiles) => void;
  onAttachmentsPanelOpen?: (o: boolean) => void;
  sed: Sed;
}

export interface SEDBodySelector {
  attachments: AttachedFiles;
  attachmentsError?: boolean;
}

const mapState = (state: State): SEDBodySelector => ({
  attachments: state.buc.attachments,
  attachmentsError: state.buc.attachmentsError
})

const SEDBodyDiv = styled.div``

const Title = styled(Undertittel)`
   margin-top: 1rem;
   margin-bottom: 1rem;
`
const MarginDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
`
const SEDAttachmentSenderDiv = styled.div`
   margin-top: 1rem;
   margin-bottom: 1rem;
   width: 100%;
`

const SEDBody: React.FC<SEDBodyProps> = ({
  aktoerId, buc, canHaveAttachments, initialAttachmentsSent = false, initialSeeAttachmentPanel = false,
  initialSendingAttachments = false, onAttachmentsSubmit, onAttachmentsPanelOpen, sed
}: SEDBodyProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [_attachments, setAttachments] = useState<AttachedFiles>({ sed: sed.attachments || [] as BUCAttachments, joark: [] as JoarkFiles })
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(initialSeeAttachmentPanel)
  const { attachments, attachmentsError }: SEDBodySelector = useSelector<State, SEDBodySelector>(mapState)

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      setSendingAttachments(false)
      setSeeAttachmentPanel(false)
      dispatch(resetSedAttachments())
    }
  }, [attachmentsSent, dispatch, sendingAttachments])

  const _sendAttachmentToSed = (params: SEDAttachmentPayloadWithFile, unsentAttachment: JoarkFile): void => {
    dispatch(sendAttachmentToSed(params, unsentAttachment))
  }

  const onAttachmentsPanelOpened = () => {
    const newSeeAttachmentPanel: boolean = !seeAttachmentPanel
    setSeeAttachmentPanel(newSeeAttachmentPanel)
    setAttachmentsSent(false)
    if (_.isFunction(onAttachmentsPanelOpen)) {
      onAttachmentsPanelOpen(newSeeAttachmentPanel)
    }
  }

  const onAttachmentsSubmitted = (files: AttachedFiles) => {
    const newFiles: AttachedFiles = {
      ..._attachments,
      joark: files.joark
    }
    setAttachments(newFiles)
    setSendingAttachments(true)

    standardLogger('buc.edit.attachments.data', {
      numberOfJoarkAttachments: newFiles.joark.length
    })

    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(newFiles)
    }
  }

  return (
    <SEDBodyDiv>
      {canHaveAttachments && (
        <>
          <Title>
            {t('ui:attachments')}
          </Title>
          <MarginDiv>
            {!sendingAttachments && <SEDAttachmentsTable attachments={_attachments} />}
          </MarginDiv>
          {seeAttachmentPanel && (
            <Title>
              {t('ui:addAttachments')}
            </Title>
          )}
          <SEDAttachments
            files={_attachments}
            open={seeAttachmentPanel}
            onOpen={onAttachmentsPanelOpened}
            onSubmit={onAttachmentsSubmitted}
            disableButtons={sendingAttachments}
          />
          {(sendingAttachments || attachmentsSent) && (
            <SEDAttachmentSenderDiv>
              <SEDAttachmentSender
                attachmentsError={attachmentsError}
                sendAttachmentToSed={_sendAttachmentToSed}
                payload={{
                  aktoerId: aktoerId,
                  rinaId: buc.caseId,
                  rinaDokumentId: sed.id
                } as SEDAttachmentPayload}
                allAttachments={_attachments.joark as JoarkFiles}
                savedAttachments={attachments.joark as JoarkFiles}
                onFinished={() => setAttachmentsSent(true)}
              />
            </SEDAttachmentSenderDiv>
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
