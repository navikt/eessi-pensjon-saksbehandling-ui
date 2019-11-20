import React, { useEffect, useState } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import SEDAttachments from '../SEDAttachments/SEDAttachments'
import { Nav } from 'eessi-pensjon-ui'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'
import SEDAttachmentsTable from 'applications/BUC/components/SEDAttachmentsTable/SEDAttachmentsTable'

const SEDBody = ({
  actions, aktoerId, attachments, attachmentsError, buc, initialAttachmentsSent = false, initialSeeAttachmentPanel = false,
  initialSendingAttachments = false, onAttachmentsSubmit, onAttachmentsPanelOpen, sed, t
}) => {
  const [_attachments, setAttachments] = useState({ sed: sed.attachments || [], joark: [] })
  const [sendingAttachments, setSendingAttachments] = useState(initialSendingAttachments)
  const [attachmentsSent, setAttachmentsSent] = useState(initialAttachmentsSent)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState(initialSeeAttachmentPanel)

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      setSendingAttachments(false)
      setSeeAttachmentPanel(false)
      actions.resetSedAttachments()
    }
  }, [actions, attachmentsSent, sendingAttachments])

  const onAttachmentsPanelOpened = () => {
    const newSeeAttachmentPanel = !seeAttachmentPanel
    setSeeAttachmentPanel(newSeeAttachmentPanel)
    setAttachmentsSent(false)
    if (_.isFunction(onAttachmentsPanelOpen)) {
      onAttachmentsPanelOpen(newSeeAttachmentPanel)
    }
  }

  const onAttachmentsSubmitted = (files) => {
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
      <Nav.Undertittel className='mt-4 mb-4'>{t('ui:attachments')}</Nav.Undertittel>
      <div className='mt-4 mb-4'>
        {!sendingAttachments ? <SEDAttachmentsTable attachments={_attachments} t={t} /> : null}
      </div>
      {seeAttachmentPanel ? <Nav.Undertittel className='mb-3 mt-3'>{t('ui:addAttachments')}</Nav.Undertittel> : null}
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
