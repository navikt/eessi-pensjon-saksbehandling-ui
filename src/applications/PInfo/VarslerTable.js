import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'

import { NavFrontendSpinner, Undertittel } from 'components/Nav'
import Icons from 'components/Icons'
import RefreshButton from 'components/RefreshButton/RefreshButton'

const VarslerTable = (props) => {
  const { actions, aktoerId, file, fileList, sakId, t } = props

  const [isReady, setIsReady] = useState(false)
  const [_fileList, setFileList] = useState(undefined)
  const [_files, setFiles] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) {
      if (aktoerId && sakId && fileList === undefined) {
        actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
      }
      setMounted(true)
    }
  }, [actions, aktoerId, sakId, fileList, mounted])

  useEffect(() => {
    if (fileList !== undefined && _fileList === undefined) {
      fileList.map(file => {
        actions.getStorageFileWithNoNotification({
          userId: aktoerId,
          namespace: 'varsler',
          file: sakId + '___' + file
        })
        return file
      })

      setIsReady(_.isEmpty(fileList))
      setFileList(fileList)
    }

    if (file !== undefined && !isReady) {
      const files = _.cloneDeep(_files)
      const key = file.timestamp + '.json'
      if (!Object.prototype.hasOwnProperty.call(files, key)) {
        files[key] = file
        const allFilesDone = Object.keys(files).length === fileList.length
        setFiles(files)
        setIsReady(allFilesDone)
      }
    }
  }, [actions, aktoerId, fileList, _fileList, _files, file, isReady, sakId])

  const refresh = () => {
    if (aktoerId && sakId) {
      setFileList(undefined)
      setFiles({})
      setIsReady(false)
      actions.listStorageFiles(aktoerId, 'varsler___' + sakId)
    }
  }

  return (
    <>
      <div className='a-pinfo-table-notification-title'>
        <Undertittel>{t('pinfo:sb-sent-notifications-title')}</Undertittel>
        <RefreshButton t={t} rotating={!isReady} onRefreshClick={refresh} />
      </div>
      {!isReady ? (
        <div className='text-center' style={{ paddingTop: '3rem' }}>
          <NavFrontendSpinner />
          <p className='typo-normal'>{t('ui:loading')}</p>
        </div>
      ) : null}
      {isReady ? (
        <table className='w-100 mt-4'>
          <thead>
            <tr style={{ borderBottom: '1px solid lightgrey' }}>
              <th />
              <th>{t('document')}</th>
              <th>{t('sender')}</th>
              <th>{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {_files ? Object.keys(_files)
              .sort((a, b) => _files[b].timestamp.localeCompare(_files[a].timestamp))
              .map((file, index) => {
                const content = _files[file]
                return (
                  <tr className='slideAnimate' style={{ animationDelay: index * 0.03 + 's' }} key={file}>
                    <td><Icons kind='nav-message-sent' /></td>
                    <td>{content.tittel || file}</td>
                    <td>{content.fulltnavn || t('unknown')}</td>
                    <td>{content.timestamp ? new Date(content.timestamp).toDateString() : t('unknown')}</td>
                  </tr>
                )
              }) : null}
          </tbody>
        </table>
      ) : null}
    </>
  )
}

VarslerTable.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  file: PT.object,
  fileList: PT.array,
  sakId: PT.string,
  t: PT.func.isRequired
}

export default VarslerTable
