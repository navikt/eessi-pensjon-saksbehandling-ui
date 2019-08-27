import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'
import { getDisplayName } from 'utils/displayName'
import { NavFrontendSpinner } from 'components/Nav'
import File from 'components/File/File'
import TableSorter from 'components/TableSorter/TableSorter'

import './JoarkBrowser.css'

const mapStateToProps = (state) => {
  return {
    aktoerId: state.app.params.aktoerId,
    file: state.joark.file,
    list: state.joark.list,
    loadingJoarkList: state.loading.loadingJoarkList,
    loadingJoarkFile: state.loading.loadingJoarkFile,
    loadingJoarkPreviewFile: state.loading.loadingJoarkPreviewFile,
    previewFile: state.joark.previewFile
  }
}

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...uiActions, ...joarkActions }, dispatch) }
}

export const JoarkBrowser = (props) => {
  const { actions, aktoerId, file, files, list, loadingJoarkList } = props
  const { loadingJoarkFile, loadingJoarkPreviewFile, onFilesChange, previewFile, t } = props
  const [_file, setFile] = useState(file)
  const [_files, setFiles] = useState(files)
  const [_previewFile, setPreviewFile] = useState(previewFile)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
    }
    setMounted(true)
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  useEffect(() => {
    if (file && (!_file ||
      (_file.dokumentInfoId !== file.dokumentInfoId || _file.content.base64 !== file.content.base64))) {
      setFile(file)
      const newFiles = _.cloneDeep(_files)
      newFiles.push(file)
      setFiles(newFiles)
      if (onFilesChange) {
        onFilesChange(newFiles)
      }
    }
  }, [file, _file, _files, onFilesChange])

  useEffect(() => {
    const onPreviewFile = (previewFile) => {
      actions.openModal({
        modalContent: (
          <div style={{ cursor: 'pointer' }} onClick={() => actions.closeModal()}>
            <File t={t} file={previewFile} width={400} height={600} />
          </div>
        )
      })
    }
    if (previewFile && (!_previewFile || _previewFile.journalpostId !== previewFile.journalpostId ||
     _previewFile.variantformat !== previewFile.variantformat)) {
      setPreviewFile(previewFile)
      onPreviewFile(previewFile)
    }
  }, [actions, previewFile, _previewFile, t])

  const onItemClicked = (clickedItem, clickedVariantFormat) => {
    const foundFile = _.find(files, (file) => {
      return file.journalpostId === clickedItem.raw.journalpostId &&
        file.variantformat === clickedVariantFormat &&
        file.content !== undefined
    })

    if (!foundFile) {
      actions.previewJoarkFile(clickedItem.raw, clickedVariantFormat)
    } else {
      setPreviewFile(foundFile)
    }
  }

  const onSelectedItemChange = (item, checked, variantformat) => {
    let newFiles = _.cloneDeep(_files)
    const found = _.find(newFiles, {
      dokumentInfoId: item.raw.dokumentInfoId,
      variantformat: variantformat
    })
    let changed = false

    if (!checked && found) {
      newFiles = _.reject(newFiles, {
        journalpostId: item.raw.journalpostId,
        variantformat: variantformat
      })
      changed = true
    }

    if (checked && !found) {
      newFiles.push({
        ...item.raw,
        variantformat: variantformat
      })
      changed = true
    }

    if (changed) {
      setFiles(newFiles)
      if (onFilesChange) {
        onFilesChange(newFiles)
      }
    }
  }

  const items = list ? list.map((file) => {
    return {
      raw: file,
      id: file.journalpostId,
      name: file.tittel,
      tema: file.tema,
      date: file.datoOpprettet,
      varianter: file.varianter.map(item => {
        return {
          variantformat: item.variantformat,
          filnavn: item.filnavn,
          label: item.variantformat + ' (' + item.filnavn + ')',
          selected: _.find(files, {
            dokumentInfoId: file.dokumentInfoId,
            variantformat: item.variantformat
          }) !== undefined,
          focused: _previewFile ? _previewFile.journalpostId === file.journalpostId && _previewFile.variantformat === item.variantformat : false
        }
      })
    }
  }) : []

  if (!mounted) {
    return null
  }

  if (loadingJoarkList) {
    return (
      <div>
        <NavFrontendSpinner type='XS' />
        <span className='pl-2'>{t('ui:loading')}</span>
      </div>
    )
  }

  return (
    <div className='c-joarkBrowser'>
      <TableSorter
        t={t}
        items={items}
        actions={actions}
        loadingJoarkFile={loadingJoarkFile}
        loadingJoarkPreviewFile={loadingJoarkPreviewFile}
        sort={{ column: 'name', order: 'desc' }}
        columns={{
          name: { name: t('ui:title'), filterText: '', defaultSortOrder: '' },
          tema: { name: t('ui:tema'), filterText: '', defaultSortOrder: '' },
          date: { name: t('ui:date'), filterText: '', defaultSortOrder: '' },
          varianter: { name: t('ui:variant'), filterText: '', defaultSortOrder: '' }
        }}
        onItemClicked={onItemClicked}
        onSelectedItemChange={onSelectedItemChange}
      />
    </div>
  )
}

JoarkBrowser.propTypes = {
  actions: PT.object.isRequired,
  aktoerId: PT.string,
  file: PT.object,
  files: PT.array,
  list: PT.array,
  loadingJoarkList: PT.bool,
  loadingJoarkFile: PT.bool,
  loadingJoarkPreviewFile: PT.bool,
  onFilesChange: PT.func.isRequired,
  previewFile: PT.object,
  t: PT.func.isRequired
}

const ConnectedJoarkbrowser = connect(mapStateToProps, mapDispatchToProps)(JoarkBrowser)
ConnectedJoarkbrowser.displayName = `Connect(${getDisplayName(JoarkBrowser)})`
export default ConnectedJoarkbrowser
