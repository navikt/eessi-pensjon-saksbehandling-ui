import { resetSedAttachments, sendAttachmentToSed } from 'actions/buc'
import SEDAttachmentSender, {
  SEDAttachmentPayload,
  SEDAttachmentPayloadWithFile
} from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { AttachedFiles, Buc, Sed } from 'declarations/buc'
import { BucPropType, SedPropType } from 'declarations/buc.pt'
import { JoarkFile, JoarkFiles } from 'declarations/joark'
import { T } from 'declarations/types'
import { TPropType } from 'declarations/types.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

export interface SEDBodyProps {
  aktoerId: string;
  buc: Buc;
  initialAttachmentsSent?: boolean;
  initialSeeAttachmentPanel?: boolean;
  initialSendingAttachments?: boolean;
  onAttachmentsSubmit?: (af: AttachedFiles) => void;
  onAttachmentsPanelOpen?: (o: boolean) => void;
  sed: Sed;
  t: T;
}

export interface SEDBody {
  attachments: AttachedFiles;
  attachmentsError?: boolean;
}

const mapState = (state: State): SEDBody => ({
  attachments: state.buc.attachments,
  attachmentsError: state.buc.attachmentsError
})

const SEDBody: React.FC<SEDBodyProps> = ({
  aktoerId, buc, initialAttachmentsSent = false, initialSeeAttachmentPanel = false,
  initialSendingAttachments = false, onAttachmentsSubmit, onAttachmentsPanelOpen, sed, t
}: SEDBodyProps): JSX.Element => {
  const [_attachments, setAttachments] = useState<AttachedFiles>({ sed: sed.attachments || [], joark: [] })
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(initialSeeAttachmentPanel)
  const { attachments, attachmentsError }: SEDBody = useSelector<State, SEDBody>(mapState)
  const dispatch = useDispatch()

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
    if (_.isFunction(onAttachmentsSubmit)) {
      onAttachmentsSubmit(newFiles)
    }
  }

  return (
    <div className='a-buc-c-sedbody'>
      <Ui.Nav.Undertittel className='mt-4 mb-4'>{t('ui:attachments')}</Ui.Nav.Undertittel>
      <div className='mt-4 mb-4'>
        {!sendingAttachments ? <SEDAttachmentsTable attachments={_attachments} t={t} /> : null}
      </div>
      {seeAttachmentPanel ? <Ui.Nav.Undertittel className='mb-3 mt-3'>{t('ui:addAttachments')}</Ui.Nav.Undertittel> : null}
      <SEDAttachments
        t={t}
        files={_attachments}
        open={seeAttachmentPanel}
        onOpen={onAttachmentsPanelOpened}
        onSubmit={onAttachmentsSubmitted}
        disableButtons={sendingAttachments}
      />
      {sendingAttachments || attachmentsSent ? (
        <SEDAttachmentSender
          className='mt-3 mb-3 w-100'
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
          t={t}
        />
      ) : null}
    </div>
  )
}

SEDBody.propTypes = {
  aktoerId: PT.string.isRequired,
  buc: BucPropType.isRequired,
  initialAttachmentsSent: PT.bool,
  initialSeeAttachmentPanel: PT.bool,
  initialSendingAttachments: PT.bool,
  onAttachmentsSubmit: PT.func,
  onAttachmentsPanelOpen: PT.func,
  sed: SedPropType.isRequired,
  t: TPropType.isRequired
}

export default SEDBody
