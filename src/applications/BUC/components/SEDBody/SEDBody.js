import React, { useEffect, useState } from 'react'
import SEDAttachments from '../SEDAttachments/SEDAttachments'
import { Nav } from 'eessi-pensjon-ui'
import { IS_TEST } from 'constants/environment'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'

const SEDBody = ({ actions, aktoerId, attachments, attachmentsError, buc, sed, t }) => {
  const [_attachments, setAttachments] = useState({ sed: sed.attachments || [], joark: [] })
  const [sendingAttachments, setSendingAttachments] = useState(false)
  const [attachmentsSent, setAttachmentsSent] = useState(false)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState(false)

  useEffect(() => {
    // cleanup after attachments sent
    if (sendingAttachments && attachmentsSent) {
      if (!IS_TEST) {
        console.log('SEDBody: Attachments sent, cleaning up')
      }
      setSendingAttachments(false)
      setSeeAttachmentPanel(false)
      actions.resetSedAttachments()
    }
  }, [actions, attachmentsSent, sendingAttachments])

  const onHandleSubmit = (files) => {
    setAttachments({
      ..._attachments,
      joark: files.joark
    })
    setSendingAttachments(true)
  }

  return (
    <div className='a-buc-c-sedbody'>
      <Nav.Undertittel className='mt-4 mb-4'>{t('ui:attachments')}</Nav.Undertittel>
      <SEDAttachments
        t={t}
        files={_attachments}
        open={seeAttachmentPanel}
        onOpen={() => { setSeeAttachmentPanel(!seeAttachmentPanel) }}
        onSubmit={onHandleSubmit}
        disableButtons={sendingAttachments}
      />
      {sendingAttachments ? (
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

export default SEDBody
