import * as joarkActions from 'actions/joark'
import * as uiActions from 'actions/ui'
import { JoarkFile, JoarkFileWithContent } from 'applications/BUC/declarations/joark'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { bindActionCreators, connect } from 'store'
import { ActionCreators, Dispatch, State, T } from 'types'
import './JoarkBrowser.css'

export interface JoarkBrowserProps {
  actions: ActionCreators;
  aktoerId: string;
  file: JoarkFileWithContent | undefined;
  files: Array<JoarkFile | JoarkFileWithContent>;
  list: Array<JoarkFile>;
  loadingJoarkList: boolean;
  loadingJoarkFile: boolean;
  loadingJoarkPreviewFile: boolean;
  mode: string;
  onFilesChange: Function;
  onPreviewFile: Function;
  previewFile: JoarkFileWithContent | undefined;
  t: T
}

const mapStateToProps = /* istanbul ignore next */ (state: State) => {
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

const mapDispatchToProps = /* istanbul ignore next */ (dispatch: Dispatch) => {
  return { actions: bindActionCreators({ ...uiActions, ...joarkActions }, dispatch) }
}

export const JoarkBrowser = ({
  actions, aktoerId, file, files, list, loadingJoarkList, loadingJoarkFile,
  loadingJoarkPreviewFile, mode = 'view', onFilesChange, onPreviewFile, previewFile, t
}: JoarkBrowserProps) => {
  const [_file, setFile] = useState<JoarkFileWithContent | undefined>(file)
  const [_previewFile, setPreviewFile] = useState<JoarkFileWithContent |undefined>(previewFile)
  const [clickedPreviewFile, setClickedPreviewFile] = useState<any>(undefined)
  const [mounted, setMounted] = useState<boolean>(false)
  const [modal, setModal] = useState<any>(undefined)

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      actions.listJoarkFiles(aktoerId)
    }
    setMounted(true)
  }, [mounted, list, loadingJoarkList, actions, aktoerId])

  const equalFiles: Function = (a: JoarkFile, b: JoarkFile): boolean => {
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
    const _onPreviewFile = (previewFile: JoarkFileWithContent) => {
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
            <Ui.File
              file={previewFile}
              width={600}
              height={800}
              tema='simple'
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
      _onPreviewFile(previewFile!)
    }
  }, [actions, handleModalClose, onPreviewFile, previewFile, _previewFile, t])

  if (!mounted) {
    return null
  }

  const onPreviewItem = (clickedItem: any): void => {
    setClickedPreviewFile(clickedItem)
    const foundFile = _.find(files, (file) => (equalFiles(file, clickedItem) && (file as JoarkFileWithContent).content !== undefined))
    if (!foundFile) {
      actions.getPreviewJoarkFile(clickedItem)
    } else {
      actions.setPreviewJoarkFile(foundFile)
    }
  }

  const onDeleteItem = (files: Array<JoarkFile>, item: JoarkFile): void => {
    const newFiles = _.reject(files, (file) => equalFiles(file, item))
    onFilesChange(newFiles)
  }

  const onSelectedItemChange = (items: Array<any>): void => {
    onFilesChange(items.filter(item => item.selected))
  }

  const convertSomeNonAlphanumericCharactersToUnderscore = (text: string) => {
    return text.replace(/[ .\-\\(\\)]/g, '_')
  }

  const renderButtonsCell = (item: any, value: any, context: any) => {
    const previewing = context.loadingJoarkPreviewFile
    const spinner = previewing && _.isEqual(item, context.clickedPreviewFile)
    return (
      <div
        key={item.label}
        className='c-joarkbrowser__variant'
      >
        <div className='buttons'>
          <Ui.Nav.Knapp
            data-tip={t('ui:preview')}
            form='kompakt'
            disabled={previewing}
            spinner={spinner}
            id={'c-tablesorter__preview-button-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
          convertSomeNonAlphanumericCharactersToUnderscore(item.label)}
            className='c-tablesorter__preview-button mr-2 ml-2'
            onClick={() => onPreviewItem(item)}
          >
            {spinner ? '' : <Ui.Icons kind='view' />}
          </Ui.Nav.Knapp>
          {context.mode === 'confirm' ? (
            <Ui.Nav.Knapp
              data-tip={t('ui:delete')}
              form='kompakt'
              id={'c-tablesorter__delete-button-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
            convertSomeNonAlphanumericCharactersToUnderscore(item.label)}
              className='c-tablesorter__delete-button mr-2 ml-2'
              onClick={() => onDeleteItem(context.files, item)}
            >
              <Ui.Icons kind='trashcan' color='#0067C5' />
            </Ui.Nav.Knapp>
          ) : null}
        </div>
      </div>
    )
  }

  let items
  if (mode === 'view') {
    items = list ? list.map((file) => {
      return {
        key: mode + '-' + file.journalpostId + '-' + file.dokumentInfoId + '-' + file.variant.variantformat,
        name: file.tittel,
        tema: file.tema,
        date: file.datoOpprettet,
        label: file.variant.variantformat + (file.variant.filnavn ? ' (' + file.variant.filnavn + ')' : ''),
        variant: file.variant,
        dokumentInfoId: file.dokumentInfoId,
        journalpostId: file.journalpostId,
        selected: _.find(files, {
          dokumentInfoId: file.dokumentInfoId,
          journalpostId: file.journalpostId,
          variant: file.variant
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
    previewFile: _previewFile,
    clickedPreviewFile: clickedPreviewFile
  }

  return (
    <div className='c-joarkBrowser'>
      <Ui.Modal modal={modal} onModalClose={handleModalClose} />
      <Ui.TableSorter
        className={mode}
        items={items}
        context={context}
        searchable={mode === 'view'}
        selectable={mode === 'view'}
        sortable
        loading={loadingJoarkList || loadingJoarkFile}
        columns={[
          {
            id: 'name',
            label: t('ui:title'),
            type: 'string'
          }, {
            id: 'tema',
            label: t('ui:tema'),
            type: 'string',
            renderCell: (item: any, value: any) => <Ui.Nav.EtikettLiten>{value}</Ui.Nav.EtikettLiten>
          }, {
            id: 'date',
            label: t('ui:date'),
            type: 'date'
          }, {
            id: 'label',
            label: t('ui:variant'),
            type: 'object',
            renderCell: (item: any, value: any) => <Ui.Nav.Normaltekst>{value}</Ui.Nav.Normaltekst>
          }, {
            id: 'buttons',
            label: '',
            type: 'object',
            renderCell: renderButtonsCell
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
