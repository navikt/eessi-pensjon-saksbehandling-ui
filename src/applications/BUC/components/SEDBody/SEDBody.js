import React, { useEffect, useState } from 'react'
import SEDAttachments from '../SEDAttachments/SEDAttachments'
import { Nav } from 'eessi-pensjon-ui'
import { IS_TEST } from 'constants/environment'
import _ from 'lodash'
import SEDAttachmentSender from 'applications/BUC/components/SEDAttachmentSender/SEDAttachmentSender'

const SEDBody = ({ actions, attachments, aktoerId, buc, t, sed }) => {
  const [_attachments, setAttachments] = useState({ sed: sed.attachments || [], joark: [] })
  const [sendingAttachments, setSendingAttachments] = useState(false)
  const [attachmentsSent, setAttachmentsSent] = useState(false)
  const [seeAttachmentPanel, setSeeAttachmentPanel] = useState(false)

  const setFiles = (files) => {
    setAttachments({
      ..._attachments,
      joark: files.joark
    })
  }

  const allowedToUpload = () => {
    return !sendingAttachments && !_.isEmpty(_attachments.joark)
  }

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
  }, [actions, attachmentsSent])

  const onUploadAttachments = () => {
    setSendingAttachments(true)
  }

  return (
    <div className='a-buc-c-sedbody'>

      <div className='mt-4 mb-4'>
        <Nav.Undertittel className='mb-2'>{t('ui:attachments')}</Nav.Undertittel>
        {_attachments ? Object.keys(_attachments).map((key, index1) => {
          return _attachments[key].map((att, index2) => {
            return (
              <div key={index1 + '-' + index2}>
                {key}: {att.tittel || att.name}
                {att.variant ? '- ' + att.variant.variantformat + '(' + att.variant.filnavn + ')' : ''}
              </div>
            )
          })
        }) : null}
      </div>
      <SEDAttachments
        t={t}
        files={_attachments}
        setFiles={setFiles}
        open={seeAttachmentPanel}
        onOpen={() => { setSeeAttachmentPanel(!seeAttachmentPanel) }}
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
          onFinished={() => {
            setAttachmentsSent(true)
          }}
          t={t}
        />
      ) : null}
      <div className='mt-4'>
        <Nav.Hovedknapp
          id='a-buc-sedbody__upload-button-id'
          className='a-buc-sedbody__upload-button'
          disabled={!allowedToUpload()}
          spinner={sendingAttachments}
          onClick={() => onUploadAttachments()}
        >
          {sendingAttachments ? t('buc:loading-sendingSEDattachments') : t('buc:form-uploadAttachments')}
        </Nav.Hovedknapp>
      </div>
    </div>
  )
}

export default SEDBody
