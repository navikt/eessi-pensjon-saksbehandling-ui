import { FlexDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import { IS_TEST } from 'constants/environment'
import { GetS3FilesJob } from 'declarations/components'
import ProgressBar, { ProgressBarStatus } from '@navikt/fremdriftslinje'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@navikt/ds-react'
import { useDispatch } from 'react-redux'
import { getS3file } from 'actions/s3inventory'

export interface S3InventoryProgressBarProps {
  onCancel : () => void
  onFinished : () => void
  getS3FilesJob: GetS3FilesJob | undefined
}

const S3InventoryProgressBar: React.FC<S3InventoryProgressBarProps> = ({
  onCancel, onFinished, getS3FilesJob
}: S3InventoryProgressBarProps): JSX.Element => {
  const [_status, setStatus] = useState<ProgressBarStatus>('inprogress')
  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (getS3FilesJob) {
      // all attachments are sent - conclude
      if (getS3FilesJob.remaining.length === 0) {
        if (!getS3FilesJob.loading) {
          /* istanbul ignore next */
          if (!IS_TEST) {
            console.log('Concluding.' +
              ' Total (' + getS3FilesJob.total.length +
              ') loaded (' + getS3FilesJob.loaded.length +
              ') loading (' + !!getS3FilesJob.loading +
              ') remaining (' + getS3FilesJob.remaining.length + ')')
          }
          setStatus('done')
          onFinished()
          return
        }
        return
        // still are attachments to send,
      }
      // one attachment was just saved. Pick another one to save
      if (!getS3FilesJob.loading) {
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Picking one to save.' +
            ' Total (' + getS3FilesJob.total.length +
            ') loaded (' + getS3FilesJob.loaded.length +
            ') loading (' + !!getS3FilesJob.loading +
            ') remaining (' + getS3FilesJob.remaining.length + ')')
        }

        const nextFile: string = _.first(getS3FilesJob.remaining)!
        dispatch(getS3file(nextFile))
      } else {
        // one attachment will be saved now. Display as such.
        /* istanbul ignore next */
        if (!IS_TEST) {
          console.log('Loading.' +
            ' Total (' + getS3FilesJob.total.length +
            ') loaded (' + getS3FilesJob.loaded.length + ') ' +
            ' loading (' + !!getS3FilesJob.loading +
            ') remaining (' + getS3FilesJob.remaining.length + ')')
        }
      }
    }
  }, [getS3FilesJob])

  if (!getS3FilesJob) {
    return <div />
  }

  const current: number = (getS3FilesJob.loaded.length + (getS3FilesJob.loading ? 1 : 0))
  const total: number = getS3FilesJob.total.length
  const percentage: number = (Math.floor((current * 100) / total))

  return (
    <FlexDiv
      data-test-id='w-s3inventory-progress-bar__div-id'
    >
      <ProgressBar
        data-test-id='w-s3inventory-progress-bar__progress-bar-id'
        now={percentage}
        status={_status}
      >
        <>
          {_status === 'inprogress' && t('message:loading-sendingXofY', {
            current,
            total
          })}
          {_status === 'done' && t('buc:form-sent')}
          {_status === 'error' && t('message:error')}
        </>
      </ProgressBar>
      {_status === 'inprogress' && _.isFunction(onCancel) && (
        <>
          <HorizontalSeparatorDiv data-sise='0.35' />
          <Button
            size='small'
            variant='secondary'
            data-test-id='w-s3inventory-progress-bar__cancel-button-id'
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
              e.stopPropagation()
              onCancel()
            }}
          >
            {t('ui:cancel')}
          </Button>
        </>
      )}
    </FlexDiv>
  )
}
export default S3InventoryProgressBar
