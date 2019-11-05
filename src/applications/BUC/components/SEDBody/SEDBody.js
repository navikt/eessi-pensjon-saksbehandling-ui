import React, { useEffect, useState } from 'react'
import SEDAttachments from '../SEDAttachments/SEDAttachments'
import { Nav } from 'eessi-pensjon-ui'
import { IS_TEST } from 'constants/environment'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'

const SEDBody = ({ actions, attachments, aktoerId, buc, t, sed }) => {
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
      <div className='mt-4 mb-4'>
        <Nav.Undertittel className='mb-2'>{t('ui:attachments')}</Nav.Undertittel>
      </div>
      <SEDAttachments
        t={t}
        files={_attachments}
        open={seeAttachmentPanel}
        onOpen={() => { setSeeAttachmentPanel(!seeAttachmentPanel) }}
        onSubmit={onHandleSubmit}
      />
      {sendingAttachments ? (
        <SEDAttachmentSender
          className='mt-3 mb-3 w-100'
          sendAttachmentToSed={actions.sendAttachmentToSed}
          aktoerId={aktoerId}
          buc={buc}
          sed={sed}
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
