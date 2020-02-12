import { getPreviewJoarkFile, listJoarkFiles, setPreviewJoarkFile } from 'actions/joark'
import { JoarkFile, JoarkFileWithContent } from 'declarations/joark'
import { JoarkFilePropType, JoarkFileWithContentPropType } from 'declarations/joark.pt'
import Ui from 'eessi-pensjon-ui'
import { ModalContent } from 'eessi-pensjon-ui/dist/declarations/components'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { State } from 'declarations/reducers'
import './JoarkBrowser.css'

export interface JoarkBrowserSelector {
  aktoerId: string;
  file: JoarkFileWithContent | undefined;
  list: Array<JoarkFile> | undefined;
  loadingJoarkList: boolean;
  loadingJoarkFile: boolean;
  loadingJoarkPreviewFile: boolean;
  previewFile: JoarkFileWithContent | undefined;
}

const mapState = /* istanbul ignore next */ (state: State): JoarkBrowserSelector => ({
  aktoerId: state.app.params.aktoerId,
  file: state.joark.file,
  list: state.joark.list,
  loadingJoarkList: state.loading.loadingJoarkList,
  loadingJoarkFile: state.loading.loadingJoarkFile,
  loadingJoarkPreviewFile: state.loading.loadingJoarkPreviewFile,
  previewFile: state.joark.previewFile
})

export interface JoarkBrowserProps {
  files: Array<JoarkFile | JoarkFileWithContent>;
  mode: string;
  onFilesChange: (f: Array<JoarkFile | JoarkFileWithContent>) => void;
  onPreviewFile?: (f: JoarkFileWithContent) => void;
}

export const JoarkBrowser: React.FC<JoarkBrowserProps> = ({
  files, mode = 'view', onFilesChange, onPreviewFile
}: JoarkBrowserProps): JSX.Element => {
  const { aktoerId, file, list, loadingJoarkList, loadingJoarkFile, loadingJoarkPreviewFile, previewFile }: JoarkBrowserSelector = useSelector<State, JoarkBrowserSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_file, setFile] = useState<JoarkFileWithContent | undefined>(file)
  const [_previewFile, setPreviewFile] = useState<JoarkFileWithContent |undefined>(previewFile)
  const [clickedPreviewFile, setClickedPreviewFile] = useState<any>(undefined)
  const [mounted, setMounted] = useState<boolean>(false)
  const [modal, setModal] = useState<ModalContent | undefined>(undefined)
  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      dispatch(listJoarkFiles(aktoerId))
    }
    setMounted(true)
  }, [aktoerId, dispatch, list, loadingJoarkList, mounted])

  const equalFiles: Function = (a: JoarkFile, b: JoarkFile): boolean => {
    if (!a && !b) { return true }
    if ((!a && b) || (a && !b)) { return false }
    return a.journalpostId === b.journalpostId &&
      a.dokumentInfoId === b.dokumentInfoId &&
      _.isEqual(a.variant, b.variant)
  }

  const handleModalClose = useCallback(() => {
    dispatch(setPreviewJoarkFile(undefined))
  }, [dispatch])

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
              viewOnePage={false}
              onContentClick={handleModalClose}
            />
          </div>
        )
      })
      if (onPreviewFile && _.isFunction(onPreviewFile)) {
        onPreviewFile(previewFile)
      }
    }
    if (!equalFiles(previewFile, _previewFile)) {
      setPreviewFile(previewFile)
      _onPreviewFile(previewFile!)
    }
  }, [handleModalClose, onPreviewFile, previewFile, _previewFile, t])

  if (!mounted) {
    return <div />
  }

  const onPreviewItem = (clickedItem: any): void => {
    setClickedPreviewFile(clickedItem)
    const foundFile = _.find(files, (file) => (equalFiles(file, clickedItem) && (file as JoarkFileWithContent).content !== undefined))
    if (!foundFile) {
      dispatch(getPreviewJoarkFile(clickedItem))
    } else {
      dispatch(setPreviewJoarkFile(foundFile))
    }
  }

  const onDeleteItem = (files: Array<JoarkFile>, item: JoarkFile): void => {
    const newFiles: Array<JoarkFile> = _.filter(files, (file: JoarkFile) => !equalFiles(file, item))
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
  files: PT.arrayOf(PT.oneOfType([JoarkFilePropType, JoarkFileWithContentPropType]).isRequired).isRequired,
  onFilesChange: PT.func.isRequired,
  onPreviewFile: PT.func
}

export default JoarkBrowser
