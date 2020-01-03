import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'
import { Buc, Sed } from 'applications/BUC/declarations/buc'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { ActionCreators, T } from 'types'
import SEDAttachments from '../SEDAttachments/SEDAttachments'

export interface SEDBodyProps {
  actions: ActionCreators;
  aktoerId: string;
  attachments: Array<any>;
  attachmentsError: boolean;
  buc: Buc;
  initialAttachmentsSent?: boolean;
  initialSeeAttachmentPanel?: boolean;
  initialSendingAttachments?: boolean;
  onAttachmentsSubmit?: Function;
  onAttachmentsPanelOpen?: Function;
  sed: Sed;
  t: T;
}

const SEDBody = ({
  actions, aktoerId, attachments, attachmentsError, buc, initialAttachmentsSent = false, initialSeeAttachmentPanel = false,
  initialSendingAttachments = false, onAttachmentsSubmit, onAttachmentsPanelOpen, sed, t
}: SEDBodyProps) => {
  const [_attachments, setAttachments] = useState<{[namespace: string]: Array<any>}>({ sed: sed.attachments || [], joark: [] })
  const [sendingAttachments, setSendingAttachments] = useState<boolean>(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState<boolean>(initialAttachmentsSent)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState<boolean>(initialSeeAttachmentPanel)

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      setSendingAttachments(false)
      setSeeAttachmentPanel(false)
      actions.resetSedAttachments()
    }
  }, [actions, attachmentsSent, sendingAttachments])

  const onAttachmentsPanelOpened = () => {
    const newSeeAttachmentPanel: boolean = !seeAttachmentPanel
    setSeeAttachmentPanel(newSeeAttachmentPanel)
    setAttachmentsSent(false)
    if (_.isFunction(onAttachmentsPanelOpen)) {
      onAttachmentsPanelOpen(newSeeAttachmentPanel)
    }
  }

  const onAttachmentsSubmitted = (files: {[namespace: string]: Array<any>}) => {
    const newFiles = {
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
          sendAttachmentToSed={actions.sendAttachmentToSed}
          payload={{
            aktoerId: aktoerId,
            rinaId: buc.caseId,
            rinaDokumentId: sed.id
          }}
          allAttachments={_attachments.joark}
          savedAttachments={attachments}
          onFinished={() => setAttachmentsSent(true)}
          t={t}
        />
      ) : null}
    </div>
  )
}

SEDBody.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  attachments: PT.array,
  attachmentsError: PT.bool,
  buc: PT.object,
  initialAttachmentsSent: PT.bool,
  initialSeeAttachmentPanel: PT.bool,
  initialSendingAttachments: PT.bool,
  onAttachmentsSubmit: PT.func,
  onAttachmentsPanelOpen: PT.func,
  sed: PT.object.isRequired,
  t: PT.func.isRequired
}

export default SEDBody
