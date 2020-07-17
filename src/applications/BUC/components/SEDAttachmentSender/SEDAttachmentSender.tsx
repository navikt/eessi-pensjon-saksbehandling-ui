import { IS_TEST } from 'constants/environment'
import { SavingAttachmentsJob } from 'declarations/buc'
import { JoarkFile } from 'declarations/joark'
import { State } from 'declarations/reducers'
import ProgressBar, { ProgressBarStatus } from 'fremdriftslinje'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

export interface SEDAttachmentPayload {
  aktoerId: string
  rinaId: string
  rinaDokumentId: string
}

export interface SEDAttachmentPayloadWithFile extends SEDAttachmentPayload {
  journalpostId: string
  dokumentInfoId: string
  variantformat: string
}

export interface SEDAttachmentSenderProps {
  attachmentsError ?: boolean
  className?: string
  initialStatus ?: ProgressBarStatus
  onSaved: (savingAttachmentsJob: SavingAttachmentsJob) => void
  onFinished : () => void
  payload: SEDAttachmentPayload
  sendAttachmentToSed : (params: SEDAttachmentPayloadWithFile, unsent: JoarkFile) => void
}

export interface SEDAttachmentSelector {
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

const mapState = (state: State): SEDAttachmentSelector => ({
  savingAttachmentsJob: state.buc.savingAttachmentsJob
})

const SEDAttachmentSenderDiv = styled.div``

const SEDAttachmentSender: React.FC<SEDAttachmentSenderProps> = ({
  attachmentsError, className, initialStatus = 'inprogress',
  payload, onSaved, onFinished, sendAttachmentToSed
}: SEDAttachmentSenderProps): JSX.Element => {
  const [status, setStatus] = useState<ProgressBarStatus>(initialStatus)
  const { savingAttachmentsJob }: SEDAttachmentSelector = useSelector<State, SEDAttachmentSelector>(mapState)
  const { t } = useTranslation()

  useEffect(() => {

    if (savingAttachmentsJob) {
      // all attachments are sent - conclude
      if (savingAttachmentsJob.remaining.length === 0) {
        if (!savingAttachmentsJob.saving) {
          /* istanbul ignore next */
          if (!IS_TEST) {
            console.log('Concluding.' +
              ' Total (' + savingAttachmentsJob.total.length +
              ') saved (' + savingAttachmentsJob.saved.length + ') ' +
              ' saving (' + !!savingAttachmentsJob.saving +
              ') remaining (' + savingAttachmentsJob.remaining.length + ')')
          }
          onSaved(savingAttachmentsJob)
          setStatus('done')
          onFinished()
        }
      // still are attachments to send,
      } else {
        // one attachment was saved. continue
        if (!savingAttachmentsJob.saving) {
          /* istanbul ignore next */
          if (!IS_TEST) {
            console.log('Saved.' +
              ' Total (' + savingAttachmentsJob.total.length +
              ') saved (' + savingAttachmentsJob.saved.length + ') ' +
              ' saving (' + !!savingAttachmentsJob.saving +
              ') remaining (' + savingAttachmentsJob.remaining.length + ')')
          }
          const unsentAttachment: JoarkFile = _.first(savingAttachmentsJob.remaining)!
          const params: SEDAttachmentPayloadWithFile = {
            ...payload,
            journalpostId: unsentAttachment.journalpostId,
            dokumentInfoId: unsentAttachment.dokumentInfoId,
            variantformat: unsentAttachment.variant.variantformat
          }
          sendAttachmentToSed(params, unsentAttachment)
        } else {
          /* istanbul ignore next */
          if (!IS_TEST) {
            console.log('Saving.' +
              ' Total (' + savingAttachmentsJob.total.length +
              ') saved (' + savingAttachmentsJob.saved.length + ') ' +
              ' saving (' + !!savingAttachmentsJob.saving +
              ') remaining (' + savingAttachmentsJob.remaining.length + ')')
          }
          onSaved(savingAttachmentsJob)
        }
      }
    }
  }, [onSaved, onFinished, payload, sendAttachmentToSed, savingAttachmentsJob])

  useEffect(() => {
    if (attachmentsError) {
      setStatus('error')
    }
  }, [attachmentsError, setStatus])

  if (!savingAttachmentsJob) {
    return <div />
  }

  const current: number = (savingAttachmentsJob.saved.length + (savingAttachmentsJob.saving ? 1 : 0))
  const total: number = savingAttachmentsJob.total.length
  const percentage: number = (Math.floor((current * 100) / total))

  return (
    <SEDAttachmentSenderDiv className={className}>
      <ProgressBar now={percentage} status={status}>
        <>
          {status === 'inprogress' ? t('buc:loading-sendingXofY', {
            current: current,
            total: total
          }) : null}
          {status === 'done' ? t('buc:form-attachmentsSent') : null}
          {status === 'error' ? t('buc:error-sendingAttachments') : null}
        </>
      </ProgressBar>
    </SEDAttachmentSenderDiv>
  )
}

SEDAttachmentSender.propTypes = {
  attachmentsError: PT.bool,
  className: PT.string,
  initialStatus: PT.oneOf(['todo', 'inprogress', 'done', 'error']),
  onFinished: PT.func.isRequired,
  onSaved: PT.func.isRequired,
  payload: PT.any,
  sendAttachmentToSed: PT.func.isRequired
}

export default SEDAttachmentSender
