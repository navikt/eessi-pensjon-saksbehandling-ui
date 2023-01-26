import { BodyLong, Button, Loader, Panel } from '@navikt/ds-react'
import { getS3list, resetS3FilesJob, setS3FilesJob } from 'actions/s3inventory'
import { GetS3FilesJob } from 'declarations/components'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { Column, Row, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import S3InventoryProgressBar from './S3InventoryProgressBar'

export interface S3InventorySelector {
  s3list: Array<any> | null | undefined
  s3stats: any
  getS3FilesJob: GetS3FilesJob | undefined
}

const mapState = (state: State): S3InventorySelector => ({
  s3list: state.s3inventory.s3list,
  s3stats: state.s3inventory.s3stats,
  getS3FilesJob: state.s3inventory.getS3FilesJob
})

const S3Inventory = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [requestList, setRequestList] = useState<boolean>(false)
  const [requestFiles, setRequestFiles] = useState<boolean>(false)
  const { s3list, s3stats, getS3FilesJob }: S3InventorySelector = useSelector<State, S3InventorySelector>(mapState)

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
        {requestList
          ? t('ui:s3inventory-getting-list')
          : requestFiles
            ? t('ui:s3inventory-getting-file', { fil: getS3FilesJob?.loading })
            : t('ui:s3inventory-get-list')}
      </Button>
      {requestFiles && (
        <>
          <VerticalSeparatorDiv />
          <S3InventoryProgressBar
            getS3FilesJob={getS3FilesJob}
            onCancel={onCancel}
            onFinished={onFinished}
          />
        </>
      )}
      <VerticalSeparatorDiv />
      {!_.isNil(s3list) && (
        <>
          <BodyLong>Total files: {getS3FilesJob?.total.length}</BodyLong>
          <BodyLong>Total loaded: {getS3FilesJob?.loaded.length}</BodyLong>
          <BodyLong>Total not loaded: {getS3FilesJob?.notloaded.length}</BodyLong>
        </>
      )}
      {s3stats.type && (
        <>
          <VerticalSeparatorDiv size='0.5' />
          <BodyLong>Types:</BodyLong>
          {Object.keys(s3stats.type)
            .sort((a, b) =>
              s3stats.type[b] - s3stats.type[a]
            ).map(k => (
              <Row key={'type-' + k}>
                <Column>
                  {k}: {s3stats.type[k]}
                </Column>
              </Row>
            ))}
        </>
      )}
      {s3stats.tags && (
        <>
          <VerticalSeparatorDiv size='0.5' />
          <BodyLong>Tags:</BodyLong>
          {Object.keys(s3stats.tags)
            .sort((a, b) =>
              s3stats.tags[b] - s3stats.tags[a]
            ).map(k => (
              <Row key={'tags-' + k}>
                <Column>
                  {k}: {s3stats.tags[k]}
                </Column>
              </Row>
            ))}
        </>
      )}
    </Panel>
  )
}

export default S3Inventory
