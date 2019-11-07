import React, { useState, useEffect, useCallback } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'
import { File, Icons, Modal, Nav, TableSorter, WaitingPanel } from 'eessi-pensjon-ui'
import './JoarkBrowser.css'

const mapStateToProps = /* istanbul ignore next */ (state) => {
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

const mapDispatchToProps = /* istanbul ignore next */ (dispatch) => {
  return { actions: bindActionCreators({ ...uiActions, ...joarkActions }, dispatch) }
}

export const JoarkBrowser = ({
  actions, aktoerId, file, files, list, loadingJoarkList,
  loadingJoarkFile, loadingJoarkPreviewFile, mode = 'view', onFilesChange, onPreviewFile, previewFile, t
}) => {
  const [_file, setFile] = useState(file)
  const [_previewFile, setPreviewFile] = useState(previewFile)
  const [mounted, setMounted] = useState(false)
  const [modal, setModal] = useState(undefined)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
    }
    setMounted(true)
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  const equalFiles = (a, b) => {
    if (!a && !b) { return true }
    if ((!a && b) || (a && !b)) { return false }
    return a.journalpostId === b.journalpostId &&
      a.dokumentInfoId === b.dokumentInfoId &&
      _.isEqual(a.variant, b.variant)
  }

  const handleModalClose = useCallback(() => {
    actions.setPreviewJoarkFile(undefined)
  }, [actions])

  useEffect(() => {
    if (file && (!_file ||
      (_file.dokumentInfoId !== file.dokumentInfoId || _file.content.base64 !== file.content.base64))) {
      setFile(file)
      const newFiles = _.cloneDeep(files)
      newFiles.push(file)
      if (onFilesChange) {
        onFilesChange(newFiles)
      }
    }
  }, [file, _file, files, onFilesChange])

  useEffect(() => {
    const _onPreviewFile = (previewFile) => {
      if (!previewFile) {
        return setModal(undefined)
      }
      setModal({
        closeButton: true,
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
            onClick={handleModalClose}
          >
            <File
              file={previewFile}
              width='100%'
              height='100%'
              onContentClick={handleModalClose}
            />
          </div>
        )
      })
      if (_.isFunction(onPreviewFile)) {
        onPreviewFile(previewFile)
      }
    }
    if (!equalFiles(previewFile, _previewFile)) {
      setPreviewFile(previewFile)
      _onPreviewFile(previewFile)
    }
  }, [actions, handleModalClose, onPreviewFile, previewFile, _previewFile, t])

  if (!mounted) {
    return null
  }

  if (loadingJoarkList) {
    return (
      <WaitingPanel size='XS' message={t('ui:loading')} />
    )
  }

  const onPreviewItem = (clickedItem) => {
    const foundFile = _.find(files, (file) => (equalFiles(file, clickedItem) && file.content !== undefined))
    if (!foundFile) {
      actions.getPreviewJoarkFile(clickedItem)
    } else {
      actions.setPreviewJoarkFile(foundFile)
    }
  }

  const onDeleteItem = (files, item) => {
    const newFiles = _.reject(files, (file) => equalFiles(file, item))
    onFilesChange(newFiles)
  }

  const onSelectedItemChange = (items) => {
    onFilesChange(items.filter(item => item.selected))
  }

  const convertSomeNonAlphanumericCharactersToUnderscore = (text) => {
    return text.replace(/[ .\-\\(\\)]/g, '_')
  }

  const renderTableCell = (item, value, context) => {
    const previewing = context.loadingJoarkPreviewFile
    return (
      <div
        key={item.label}
        className='c-joarkbrowser__subcell'
      >
        <Nav.Normaltekst>{item.label}</Nav.Normaltekst>
        <div>
          <Nav.Knapp
            data-tip={t('ui:preview')}
            form='kompakt'
            disabled={previewing}
            spinner={previewing}
            id={'c-tablesorter__preview-button-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
          convertSomeNonAlphanumericCharactersToUnderscore(item.label)}
            className='c-tablesorter__preview-button mr-2 ml-2'
            onClick={() => onPreviewItem(item)}
          >
            {previewing ? '' : <Icons kind='view' />}
          </Nav.Knapp>
          {context.mode === 'confirm' ? (
            <Nav.Knapp
              data-tip={t('ui:delete')}
              form='kompakt'
              id={'c-tablesorter__delete-button-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
            convertSomeNonAlphanumericCharactersToUnderscore(item.label)}
              className='c-tablesorter__delete-button mr-2 ml-2'
              onClick={() => onDeleteItem(context.files, item)}
            >
              <Icons kind='trashcan' color='#0067C5'/>
            </Nav.Knapp>
          ) : null}
        </div>
      </div>
    )
  }

  let items
  if (mode === 'view') {
    items = list ? list.map((file) => {
      let variant
      if (file.varianter !== undefined) {
        variant = _.find(file.varianter, v => v.variantformat === 'SLADDET')
        if (!variant) {
          variant = _.find(file.varianter, v => v.variantformat === 'ARKIV')
        }
        if (!variant && !_.isEmpty(file.varianter)) {
          variant = file.varianter[0]
        }
      } else {
        variant = file.variant
      }
      return {
        key: mode + '-' + file.journalpostId + '-' + file.dokumentInfoId + '-' + variant.variantformat,
        name: file.tittel,
        tema: file.tema,
        date: file.datoOpprettet,
        label: variant.variantformat + (variant.filnavn ? ' (' + variant.filnavn + ')' : ''),
        variant: variant,
        dokumentInfoId: file.dokumentInfoId,
        journalpostId: file.journalpostId,
        selected: _.find(files, {
          dokumentInfoId: file.dokumentInfoId,
          journalpostId: file.journalpostId,
          variant: variant
        }) !== undefined
      }
    }) : []
  } else {
    items = files || []
  }

  const context = {
    files: files,
    mode: mode,
    loadingJoarkPreviewFile: loadingJoarkPreviewFile,
    previewFile: _previewFile
  }

  return (
    <div className='c-joarkBrowser'>
      <Modal modal={modal} onModalClose={handleModalClose} />
      <TableSorter
        className={mode}
        items={items}
        context={context}
        searchable
        selectable={mode === 'view'}
        sortable
        loading={loadingJoarkFile || loadingJoarkPreviewFile}
        columns={[
          { id: 'name', label: t('ui:title'), type: 'string' },
          { id: 'tema', label: t('ui:tema'), type: 'tag' },
          { id: 'date', label: t('ui:date'), type: 'date' },
          {
            id: 'varianter',
            label: t('ui:variant'),
            type: 'object',
            needle: (it) => it.label.toLowerCase(),
            toTableCell: renderTableCell
          }
        ]}
        onRowSelectChange={onSelectedItemChange}
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
  onPreviewFile: PT.func,
  previewFile: PT.object,
  t: PT.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(JoarkBrowser)
