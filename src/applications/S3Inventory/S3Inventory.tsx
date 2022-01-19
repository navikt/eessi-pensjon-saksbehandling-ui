import { Button, Loader, Panel } from '@navikt/ds-react'
import { getS3list, resetS3FilesJob, setS3FilesJob } from 'actions/s3inventory'
import { GetS3FilesJob } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Column, Row, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import S3InventoryProgressBar from './S3InventoryProgressBar'

export interface S3InventorySelector {
  s3list: Array<any> | null | undefined
  s3files: {[k in string]: any}
  getS3FilesJob: GetS3FilesJob | undefined
}

const mapState = (state: State): S3InventorySelector => ({
  s3list: state.s3inventory.s3list,
  s3files: state.s3inventory.s3files,
  getS3FilesJob: state.s3inventory.getS3FilesJob
})

const S3Inventory = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [requestList, setRequestList] = useState<boolean>(false)
  const [requestFiles, setRequestFiles] = useState<boolean>(false)
  const { s3list, s3files, getS3FilesJob }: S3InventorySelector = useSelector<State, S3InventorySelector>(mapState)

  const requestS3List = () => {
    setRequestList(true)
    dispatch(getS3list())
  }

  useEffect(() => {
    if (!requestFiles && requestList && !_.isEmpty(s3list)) {
      dispatch(setS3FilesJob(s3list!))
      setRequestList(false)
      setRequestFiles(true)
    }
  }, [s3list])

  const onFinished = () => {
    setRequestFiles(false)
  }

  const onCancel = () => {
    dispatch(resetS3FilesJob())
  }

  return (
    <Panel>
      <Button
        variant='primary'
        disabled={requestList || requestFiles}
        onClick={requestS3List}
      >
        {(requestList || requestFiles) && <Loader />}
        {requestList ? t('ui:s3inventory-getting-list') :
          requestFiles ? t('ui:s3inventory-getting-file', {fil: getS3FilesJob?.loading}) :
            t('ui:s3inventory-get-list')}
      </Button>
      {requestFiles && (
        <>
          <VerticalSeparatorDiv/>
          <S3InventoryProgressBar
            getS3FilesJob={getS3FilesJob}
            onCancel={onCancel}
            onFinished={onFinished}
          />
        </>
      )}
      <VerticalSeparatorDiv/>
      <Row>
        <Column>
          {Object.values(s3files).length}
        </Column>
      </Row>
    </Panel>
  )
}

export default S3Inventory
