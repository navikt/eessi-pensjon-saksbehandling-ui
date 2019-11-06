import React, { useEffect, useState, useCallback } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { IS_TEST } from 'constants/environment'
import { Alert, ProgressBar } from 'eessi-pensjon-ui'

const SEDAttachmentSender = ({ allAttachments, attachmentsError, className, payload = {}, onFinished, savedAttachments, sendAttachmentToSed, t }) => {
  const [sendingAttachment, setSendingAttachment] = useState(false)
  const [_storeAttachments, setStoreAttachments] = useState(savedAttachments || [])

  const handleFinished = useCallback(() => {
    if (_(onFinished).isFunction()) {
      onFinished()
    }
  }, [onFinished])

  useEffect(() => {
    // all attachments are sent - conclude
    if (allAttachments.length === _storeAttachments.length) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: allAttachments (' + allAttachments.length +
          ') same as _storeAttachments (' + _storeAttachments.length + ')')
      }
      handleFinished()
    }
  }, [_storeAttachments, allAttachments, handleFinished])

  useEffect(() => {
    if (!sendingAttachment) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Picking a new unsent attachment')
      }
      const unsentAttachments = allAttachments.filter(a => {
        return !_.find(_storeAttachments, b => {
          return a.dokumentInfoId === b.dokumentInfoId &&
            a.journalpostId === b.journalpostId &&
            a.variant.variantformat === b.variant.variantformat
        })
      })

      // all sent, mark sending attachments as done
      if (_.isEmpty(unsentAttachments)) {
        if (!IS_TEST) {
          console.log('SEDAttachmentSender: No more unsent attachment')
        }
        handleFinished()
        return
      }

      const unsentAttachment = _.first(unsentAttachments)
      const params = {
        ...payload,
        journalpostId: unsentAttachment.journalpostId,
        dokumentInfoId: unsentAttachment.dokumentInfoId,
        variantformat: unsentAttachment.variant.variantformat
      }
      if (!IS_TEST) {
        console.log('Sending unsent attachment ' + (_storeAttachments.length + 1) + ' of ' + allAttachments.length + ': ' +
          unsentAttachment.journalpostId + '/' + unsentAttachment.dokumentInfoId + '/' + unsentAttachment.variant.variantformat)
      }
      sendAttachmentToSed(params, unsentAttachment)
      setSendingAttachment(true)
    }
  }, [sendAttachmentToSed, _storeAttachments, allAttachments, handleFinished, payload, sendingAttachment])

  useEffect(() => {
    // handle if we have a newly sent attachment
    if (sendingAttachment && _storeAttachments.length !== savedAttachments.length) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Attachment ' + (savedAttachments.length) + ' of ' + allAttachments.length + ' sent')
      }
      setStoreAttachments(savedAttachments)
      setSendingAttachment(false)
    }
  }, [allAttachments, savedAttachments, sendingAttachment, _storeAttachments])

  const current = (_storeAttachments.length === allAttachments.length ? _storeAttachments.length : _storeAttachments.length + 1)
  const total = allAttachments.length
  const percentage = (Math.floor((current * 100) / total))

  if (attachmentsError) {
    return (
      <Alert
        type='client'
        message={t('buc:error-sendingAttachments')}
        status='ERROR'
      />
    )
  }
  return (
    <div className={classNames('a-buc-c-sedAttachmentSender', className)}>
      <ProgressBar now={percentage}>
        {t('buc:loading-sendingXofY', {
          current: current,
          total: total
        })}
      </ProgressBar>
    </div>
  )
}

SEDAttachmentSender.propType = {
  allAttachments: PT.array,
  attachmentsError: PT.boolean,
  className: PT.string,
  onFinished: PT.func,
  payload: PT.object,
  savedAttachments: PT.array,
  sendAttachmentToSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default SEDAttachmentSender
