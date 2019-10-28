import React, { useEffect, useState, useCallback } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { IS_TEST } from 'constants/environment'
import { ProgressBar } from 'eessi-pensjon-ui'

const SEDAttachmentSender = (props) => {
  const { sendAttachmentToSed, aktoerId, allAttachments, buc, className, sed, onFinished, savedAttachments, t } = props
  const [sendingAttachment, setSendingAttachment] = useState(false)
  const [_storeAttachments, setStoreAttachments] = useState(savedAttachments)

  const handleFinished = useCallback(() => {
    if (_(onFinished).isFunction()) {
      onFinished()
    }
  }, [onFinished])

  useEffect(() => {
    // all attachments are sent - conclude
    if (allAttachments.joark.length === _storeAttachments.length) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: allAttachments.joark (' + allAttachments.joark.length + ') same as _storeAttachments (' + _storeAttachments.length + ')')
      }
      handleFinished()
    }
  }, [_storeAttachments, allAttachments, handleFinished])

  useEffect(() => {
    if (!sendingAttachment) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Picking a new unsent attachment')
      }
      const unsentAttachments = allAttachments.joark.filter(a => {
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
        aktoerId: aktoerId,
        rinaId: buc.caseId,
        rinaDokumentId: sed.id,
        journalpostId: unsentAttachment.journalpostId,
        dokumentInfoId: unsentAttachment.dokumentInfoId,
        variantformat: unsentAttachment.variant.variantformat
      }
      if (!IS_TEST) {
        console.log('Sending unsent attachment ' + (_storeAttachments.length + 1) + ' of ' + allAttachments.joark.length + ': ' +
          unsentAttachment.journalpostId + '/' + unsentAttachment.dokumentInfoId + '/' + unsentAttachment.variant.variantformat)
      }
      sendAttachmentToSed(params, unsentAttachment)
      setSendingAttachment(true)
      return
    }

    // handle if we have a newly sent attachment
    if (sendingAttachment && _storeAttachments.length !== savedAttachments.length) {
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Attachment ' + (savedAttachments.length) + ' of ' + allAttachments.joark.length + ' sent')
      }
      setStoreAttachments(savedAttachments)
      setSendingAttachment(false)
    }
  }, [sendAttachmentToSed, aktoerId, savedAttachments, buc, sed, sendingAttachment, _storeAttachments])

  const current = (_storeAttachments.length === allAttachments.joark.length ? _storeAttachments.length : _storeAttachments.length + 1)
  const total = allAttachments.joark.length
  const percentage = (Math.floor((current * 100) / total))

  return (
    <div className={classNames('a-buc-sedAttachmentSender ml-3 w-50', className)}>
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
  className: PT.string,
  sendAttachmentToSed: PT.func.isRequired,
  aktoerId: PT.string,
  attachments: PT.array,
  buc: PT.object,
  sed: PT.object,
  initialAttachments: PT.array,
  onFinished: PT.func,
  t: PT.func.isRequired
}

export default SEDAttachmentSender
