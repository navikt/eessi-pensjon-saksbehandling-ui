import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import { withTranslation } from 'react-i18next'
import { NavFrontendSpinner } from 'components/ui/Nav'
import TableSorter from 'components/ui/TableSorter/TableSorter'
import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'

import './JoarkBrowser.css'
import { getDisplayName } from '../../../utils/displayName'

const mapStateToProps = (state) => {
  return {
    list: state.joark.list,
    file: state.joark.file,
    previewFile: state.joark.previewFile,
    loadingJoarkList: state.loading.loadingJoarkList,
    loadingJoarkFile: state.loading.loadingJoarkFile,
    loadingJoarkPreviewFile: state.loading.loadingJoarkPreviewFile,
    aktoerId: state.app.params.aktoerId
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...uiActions, ...joarkActions }, dispatch) }
}

const JoarkBrowser = (props) => {
  const { t, actions, list, file, previewFile, loadingJoarkList, loadingJoarkFile, loadingJoarkPreviewFile, aktoerId } = props
  const { files, onFilesChange } = props
  const [ _file, setFile ] = useState(file)
  const [ _files, setFiles ] = useState(files)
  const [ _previewFile, setPreviewFile ] = useState(previewFile)
  const [ mounted, setMounted ] = useState(false)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
      setMounted(true)
    }
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  useEffect(() => {
    if (file && (!_file || _file.content.base64 !== file.content.base64)) {
      setFile(file)
      let newFiles = _.cloneDeep(_files)
      newFiles.push(file)
      setFiles(newFiles)
      if (onFilesChange) {
        onFilesChange(newFiles)
      }
    }
  }, [file, _file, _files, onFilesChange])

  useEffect(() => {
    if (previewFile && (!_previewFile || _previewFile.content.base64 !== previewFile.content.base64)) {
      setPreviewFile(previewFile)
    }
  }, [previewFile, _previewFile])

  const onItemClicked = (clickedItem, clickedVarianter) => {
    const foundFile = _.find(files, {
      journalpostId: clickedItem.raw.journalpostId,
      varianter: clickedVarianter
    })

    if (!foundFile) {
      actions.previewJoarkFile(clickedItem.raw, clickedVarianter)
    } else {
      setPreviewFile(foundFile)
    }
  }

  const onSelectedItemChange = (item, checked, varianter) => {
    let newFiles = _.cloneDeep(_files)
    if (!checked) {
      if (_.find(newFiles, {
        dokumentInfoId: item.raw.dokumentInfoId,
        varianter: varianter
      })) {
        newFiles = _.reject(newFiles, {
          journalpostId: item.raw.journalpostId,
          varianter: varianter
        })
        setFiles(newFiles)
        if (onFilesChange) {
          onFilesChange(newFiles)
        }
      }
    } else {
      actions.getJoarkFile(item.raw, varianter)
    }
  }

  const items = list ? list.map((file) => {
    return {
      raw: file,
      id: file.journalpostId,
      name: file.tittel,
      tema: file.tema,
      date: file.datoRegistrert,
      variant: file.variant,
      focused: _previewFile ? _previewFile.journalpostId === file.journalpostId : false,
      selected: _.find(files, { dokumentInfoId: file.dokumentInfoId }) !== undefined
    }
  }) : []

  if (loadingJoarkList) {
    return <div>
      <NavFrontendSpinner type='XS' />
      <span className='pl-2'>{t('ui:loading')}</span>
    </div>
  }

  return <div className='c-ui-joarkBrowser'>
    <TableSorter
      t={t}
      items={items}
      actions={actions}
      loadingJoarkFile={loadingJoarkFile}
      loadingJoarkPreviewFile={loadingJoarkPreviewFile}
      previewFile={_previewFile}
      sort={{ column: 'name', order: 'desc' }}
      columns={{
        name: { name: t('ui:title'), filterText: '', defaultSortOrder: 'desc' },
        tema: { name: t('ui:tema'), filterText: '', defaultSortOrder: 'desc' },
        date: { name: t('ui:date'), filterText: '', defaultSortOrder: 'desc' },
        varianter: { name: t('ui:varianter'), filterText: '', defaultSortOrder: 'desc' }
      }}
      onItemClicked={onItemClicked}
      onSelectedItemChange={onSelectedItemChange}
    />
  </div>
}

JoarkBrowser.propTypes = {
  t: PT.func.isRequired,
  onFilesChange: PT.func.isRequired,
  list: PT.array,
  files: PT.array,
  file: PT.object,
  loadingJoarkList: PT.bool,
  loadingJoarkFile: PT.bool,
  actions: PT.object.isRequired,
  aktoerId: PT.string
}

const ConnectedJoarkbrowser = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(JoarkBrowser))

ConnectedJoarkbrowser.displayName = `Connect(${getDisplayName(withTranslation()(JoarkBrowser))})`

export default ConnectedJoarkbrowser
