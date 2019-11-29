import { JoarkFile } from 'applications/BUC/declarations/joark'
import classNames from 'classnames'
import { IS_TEST } from 'constants/environment'
import { ProgressBar } from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { T } from 'types'

export interface SEDAttachmentSenderProps {
  allAttachments: Array<JoarkFile>;
  attachmentsError ?: boolean;
  className?: string;
  initialStatus ?: string;
  onFinished ?: Function;
  payload: any;
  savedAttachments: Array<JoarkFile>;
  sendAttachmentToSed : Function;
  t: T;
}

const SEDAttachmentSender = ({
  allAttachments, attachmentsError, className, initialStatus = 'inprogress',
  payload = {}, onFinished, savedAttachments, sendAttachmentToSed, t
}: SEDAttachmentSenderProps) => {
  const [sendingAttachment, setSendingAttachment] = useState<boolean>(false)
  const [_storeAttachments, setStoreAttachments] = useState<Array<JoarkFile>>(savedAttachments || [])
  const [status, setStatus] = useState<string>(initialStatus)
  const handleFinished: Function = useCallback(() => {
    if (_.isFunction(onFinished)) {
      onFinished()
    }
  }, [onFinished])

  useEffect(() => {
    // all attachments are sent - conclude
    if (allAttachments && _storeAttachments && allAttachments.length === _storeAttachments.length) {
      /* istanbul ignore next */
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: allAttachments (' + allAttachments.length +
          ') same as _storeAttachments (' + _storeAttachments.length + ')')
      }
      setStatus('done')
      handleFinished()
    }
  }, [_storeAttachments, allAttachments, handleFinished])

  useEffect(() => {
    if (!sendingAttachment && !_.isNil(allAttachments)) {
      /* istanbul ignore next */
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Picking a new unsent attachment')
      }
      const unsentAttachments: Array<JoarkFile> = allAttachments.filter(a => {
        return !_.find(_storeAttachments, b => {
          return a.dokumentInfoId === b.dokumentInfoId &&
            a.journalpostId === b.journalpostId &&
            a.variant.variantformat === b.variant.variantformat
        })
      })

      // all sent, mark sending attachments as done
      if (_.isEmpty(unsentAttachments)) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('SEDAttachmentSender: No more unsent attachment')
        }
        handleFinished()
        return
      }

      const unsentAttachment: JoarkFile | undefined = _.first(unsentAttachments)
      if (unsentAttachment) {
        const params = {
          ...payload,
          journalpostId: unsentAttachment.journalpostId,
          dokumentInfoId: unsentAttachment.dokumentInfoId,
          variantformat: unsentAttachment.variant.variantformat
        }
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Sending unsent attachment ' + (_storeAttachments.length + 1) + ' of ' + allAttachments.length + ': ' +
            unsentAttachment.journalpostId + '/' + unsentAttachment.dokumentInfoId + '/' + unsentAttachment.variant.variantformat)
        }
        sendAttachmentToSed(params, unsentAttachment)
        setSendingAttachment(true)
      }
    }
  }, [sendAttachmentToSed, _storeAttachments, allAttachments, handleFinished, payload, sendingAttachment])

  useEffect(() => {
    // handle if we have a newly sent attachment
    if (sendingAttachment && _storeAttachments && savedAttachments && _storeAttachments.length !== savedAttachments.length) {
      /* istanbul ignore next */
      if (!IS_TEST) {
        console.log('SEDAttachmentSender: Attachment ' + (savedAttachments.length) + ' of ' + allAttachments.length + ' sent')
      }
      setStoreAttachments(savedAttachments)
      setSendingAttachment(false)
    }
  }, [allAttachments, savedAttachments, sendingAttachment, _storeAttachments])

  useEffect(() => {
    if (attachmentsError) {
      setStatus('error')
    }
  }, [attachmentsError, setStatus])

  if (_.isNil(_storeAttachments) || _.isNil(allAttachments)) {
    return null
  }

  const current: number = (_storeAttachments.length === allAttachments.length ? _storeAttachments.length : _storeAttachments.length + 1)
  const total: number = allAttachments.length
  const percentage: number = (Math.floor((current * 100) / total))

  return (
    <div className={classNames('a-buc-c-sedAttachmentSender', className)}>
      <ProgressBar now={percentage} status={status}>
        {status === 'inprogress' ? t('buc:loading-sendingXofY', {
          current: current,
          total: total
        }) : null}
        {status === 'done' ? t('buc:form-attachmentsSent') : null}
        {status === 'error' ? t('buc:error-sendingAttachments') : null}
      </ProgressBar>
    </div>
  )
}

SEDAttachmentSender.propType = {
  allAttachments: PT.array,
  attachmentsError: PT.bool,
  className: PT.string,
  initialStatus: PT.string,
  onFinished: PT.func,
  payload: PT.object,
  savedAttachments: PT.array,
  sendAttachmentToSed: PT.func.isRequired,
  t: PT.func.isRequired
}

export default SEDAttachmentSender
