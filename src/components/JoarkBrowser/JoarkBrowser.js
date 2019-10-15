import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import { connect, bindActionCreators } from 'store'
import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'
import { File, Modal, Nav, TableSorter, WaitingPanel } from 'eessi-pensjon-ui'
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

export const JoarkBrowser = ({
  actions, aktoerId, file, files, list, loadingJoarkList,
  loadingJoarkFile, loadingJoarkPreviewFile, onFilesChange, previewFile, t
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
    const onPreviewFile = (previewFile) => {
      setModal({
        modalContent: (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => setModal(undefined)}
          >
            <File file={previewFile} width={400} height={600} />
          </div>
        )
      })
    }
    if (previewFile && (!_previewFile || _previewFile.journalpostId !== previewFile.journalpostId ||
     _previewFile.variant !== previewFile.variant)) {
      setPreviewFile(previewFile)
      onPreviewFile(previewFile)
    }
  }, [actions, previewFile, _previewFile, t])

  const onItemClicked = (clickedItem, clickedVariant) => {
    const foundFile = _.find(files, (file) => {
      return file.journalpostId === clickedItem.raw.journalpostId &&
        file.variant === clickedVariant &&
        file.content !== undefined
    })

    if (!foundFile) {
      actions.previewJoarkFile(clickedItem.raw, clickedVariant)
    } else {
      setPreviewFile(foundFile)
    }
  }

  const onSelectedItemChange = (item, checked, variant, context) => {
    let newFiles = _.cloneDeep(context.files)
    const found = _.find(newFiles, {
      dokumentInfoId: item.raw.dokumentInfoId,
      journalpostId: item.raw.journalpostId,
      variant: variant
    })
    let changed = false

    if (!checked && found) {
      newFiles = _.reject(newFiles, {
        journalpostId: item.raw.journalpostId,
        dokumentInfoId: item.raw.dokumentInfoId,
        variant: variant
      })
      changed = true
    }

    if (checked && !found) {
      newFiles.push({
        ...item.raw,
        variant: variant
      })
      changed = true
    }

    if (changed && onFilesChange) {
      onFilesChange(newFiles)
    }
  }

  const convertSomeNonAlphanumericCharactersToUnderscore = (text) => {
    return text.replace(/[ .\-\\(\\)]/g, '_')
  }

  const renderTableCell = (item, value, context) => {
    return value.map(variant => {
      return (
        <div
          key={variant.label}
          className='c-joarkbrowser__subcell'
        >
          <Nav.Checkbox
            label=''
            id={'c-tablesorter__checkbox-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
            convertSomeNonAlphanumericCharactersToUnderscore(variant.label)}
            className='c-tablesorter__checkbox'
            onChange={(e) => {
              onSelectedItemChange(item, e.target.checked, variant.variant, context)
            }}
            checked={variant.selected}
          />
          <a
            href='#item'
            onClick={(e) => {
              e.preventDefault()
              onItemClicked(item, variant.variant)
            }}
          >
            <Nav.Normaltekst>{variant.label}</Nav.Normaltekst>
          </a>
        </div>
      )
    })
  }

  const items = list ? list.map((file) => {
    return {
      raw: file,
      journalpostId: file.journalpostId,
      dokumentInfoId: file.dokumentInfoId,
      name: file.tittel,
      tema: file.tema,
      date: file.datoOpprettet,
      varianter: file.varianter.map(variant => {
        const label = variant.variantformat + (variant.filnavn ? ' (' + variant.filnavn + ')' : '')
        return {
          variant: variant,
          label: label,
          selected: _.find(files, {
            dokumentInfoId: file.dokumentInfoId,
            journalpostId: file.journalpostId,
            variant: variant
          }) !== undefined,
          focused: _previewFile ? _previewFile.journalpostId === file.journalpostId && _previewFile.variant === variant : false
        }
      })
    }
  }) : []

  if (!mounted) {
    return null
  }

  if (loadingJoarkList) {
    return (
      <WaitingPanel size='XS' message={t('ui:loading')} />
    )
  }
  console.log(files)
  return (
    <div className='c-joarkBrowser'>
      <Modal modal={modal} />
      <TableSorter
        items={items}
        context={{ files: files }}
        loading={loadingJoarkFile || loadingJoarkPreviewFile}
        columns={[
          { id: 'name', label: t('ui:title'), type: 'string', filterText: '', defaultSortOrder: '' },
          { id: 'tema', label: t('ui:tema'), type: 'tag', filterText: '', defaultSortOrder: '' },
          { id: 'date', label: t('ui:date'), type: 'date', filterText: '', defaultSortOrder: '' },
          {
            id: 'varianter',
            label: t('ui:variant'),
            type: 'object',
            filterText: '',
            defaultSortOrder: '',
            needle: (it) => it.label.toLowerCase(),
            toTableCell: renderTableCell

          }
        ]}
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
  previewFile: PT.object
}

export default connect(mapStateToProps, mapDispatchToProps)(JoarkBrowser)
