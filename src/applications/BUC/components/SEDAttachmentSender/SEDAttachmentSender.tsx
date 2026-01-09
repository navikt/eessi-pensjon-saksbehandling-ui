import { IS_TEST } from 'src/constants/environment'
import { SavingAttachmentsJob, SEDAttachmentPayload, SEDAttachmentPayloadWithFile } from 'src/declarations/buc'
import { JoarkBrowserItem } from 'src/declarations/joark'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import React, {JSX, useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {Box, Button, VStack} from '@navikt/ds-react'
import ProgressBar, {ProgressBarStatus} from "src/components/ProgressBar/ProgressBar";

export interface SEDAttachmentSenderProps {
  attachmentsError ?: boolean
  className?: string
  initialStatus ?: ProgressBarStatus
  onCancel ?: () => void
  onFinished : () => void
  onSaved: (savingAttachmentsJob: SavingAttachmentsJob) => void
  payload: SEDAttachmentPayload
  sendAttachmentToSed : (params: SEDAttachmentPayloadWithFile, unsent: JoarkBrowserItem) => void
}

export interface SEDAttachmentSelector {
  savingAttachmentsJob: SavingAttachmentsJob | undefined
}

const mapState = (state: State): SEDAttachmentSelector => ({
  savingAttachmentsJob: state.buc.savingAttachmentsJob
})

const SEDAttachmentSender: React.FC<SEDAttachmentSenderProps> = ({
  attachmentsError, className, initialStatus = 'inprogress',
  onCancel, onFinished, onSaved, payload, sendAttachmentToSed
}: SEDAttachmentSenderProps): JSX.Element => {
  const [_status, setStatus] = useState<ProgressBarStatus>(initialStatus)
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
          return
        }
        return
      // still are attachments to send,
      }

      // one attachment was just saved. Pick another one to save
      if (!savingAttachmentsJob.saving) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Picking one to save.' +
            ' Total (' + savingAttachmentsJob.total.length +
            ') saved (' + savingAttachmentsJob.saved.length + ') ' +
            ' saving (' + !!savingAttachmentsJob.saving +
            ') remaining (' + savingAttachmentsJob.remaining.length + ')')
        }
        onSaved(savingAttachmentsJob)
        const unsentAttachment: JoarkBrowserItem = _.first(savingAttachmentsJob.remaining)!
        const params: SEDAttachmentPayloadWithFile = {
          ...payload,
          journalpostId: unsentAttachment.journalpostId,
          dokumentInfoId: unsentAttachment.dokumentInfoId,
          variantformat: unsentAttachment.variant?.variantformat
        }
        sendAttachmentToSed(params, unsentAttachment)
      } else {
        // one attachment will be saved now. Display as such.
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Saving.' +
            ' Total (' + savingAttachmentsJob.total.length +
            ') saved (' + savingAttachmentsJob.saved.length + ') ' +
            ' saving (' + !!savingAttachmentsJob.saving +
            ') remaining (' + savingAttachmentsJob.remaining.length + ')')
        }
      }
    }
  }, [onSaved, onFinished, payload, sendAttachmentToSed, savingAttachmentsJob])

  useEffect(() => {
    if (attachmentsError && _status !== 'error') {
      setStatus('error')
    }
  }, [attachmentsError, setStatus, _status])

  if (!savingAttachmentsJob) {
    return <div />
  }

  const current: number = (savingAttachmentsJob.saved.length + (savingAttachmentsJob.saving ? 1 : 0))
  const total: number = savingAttachmentsJob.total.length
  const percentage: number = (Math.floor((current * 100) / total))

  return (
    <VStack
      data-testid='a_buc_c_sedAttachmentSender--div-id'
      className={className}
    >
      <ProgressBar
        data-testid='a_buc_c_sedAttachmentSender--progress-bar-id'
        now={percentage}
        status={_status}
      >
        <>
          {_status === 'inprogress' && t('message:loading-sendingXofY', {
            current,
            total
          })}
          {_status === 'done' && t('buc:form-attachmentsSent')}
          {_status === 'error' && t('message:error-sendingAttachments')}
        </>
      </ProgressBar>
      {_status === 'inprogress' && _.isFunction(onCancel) && (
        <Box paddingInline="4 0">
          <Button
            size='small'
            variant='secondary'
            data-testid='a_buc_c_sedAttachmentSender--cancel-button-id'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
          >
            {t('ui:cancel')}
          </Button>
        </Box>
      )}
    </VStack>
  )
}

export default SEDAttachmentSender
