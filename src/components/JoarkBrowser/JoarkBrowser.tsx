import * as icons from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getPreviewJoarkFile, listJoarkFiles, setPreviewJoarkFile } from 'actions/joark'
import Modal from 'components/Modal/Modal'
import { HighContrastKnapp, HorizontalSeparatorDiv } from 'components/StyledComponents'
import { BUCAttachments } from 'declarations/buc'
import { ModalContent } from 'declarations/components'
import {
  JoarkDoc,
  JoarkFile,
  JoarkFileVariant,
  JoarkFileWithContent,
  JoarkPoster
} from 'declarations/joark'
import { JoarkFilePropType, JoarkFileWithContentPropType } from 'declarations/joark.pt'
import { State } from 'declarations/reducers'
import File from 'forhandsvisningsfil'
import _ from 'lodash'
import { EtikettLiten, Normaltekst } from 'nav-frontend-typografi'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import TableSorter, { Item } from 'tabell'

export interface JoarkBrowserSelector {
  aktoerId: string
  highContrast: boolean
  list: Array<JoarkPoster> | undefined
  loadingJoarkList: boolean
  loadingJoarkPreviewFile: boolean
  previewFile: JoarkFileWithContent | undefined
}

const mapState = /* istanbul ignore next */ (state: State): JoarkBrowserSelector => ({
  aktoerId: state.app.params.aktoerId,
  highContrast: state.ui.highContrast,
  list: state.joark.list,
  loadingJoarkList: state.loading.loadingJoarkList,
  loadingJoarkPreviewFile: state.loading.loadingJoarkPreviewFile,
  previewFile: state.joark.previewFile
})

export interface JoarkBrowserProps {
  disabledFiles: BUCAttachments
  files: Array<JoarkFile | JoarkFileWithContent>
  onFilesChange: (f: Array<JoarkFile | JoarkFileWithContent>) => void
  onPreviewFile?: (f: JoarkFileWithContent) => void
  id: string
}
export interface JoarkTableItem extends Item {

}

const VariantDiv = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  justify-content: space-between;
  align-items: center;
`

const Buttons = styled.div`
  display: flex;
  flex-wrap: nowrap;
`

export const JoarkBrowser: React.FC<JoarkBrowserProps> = ({
  disabledFiles = [], files = [], onFilesChange, onPreviewFile, id
}: JoarkBrowserProps): JSX.Element => {
  const { aktoerId, highContrast, list, loadingJoarkList, loadingJoarkPreviewFile, previewFile }: JoarkBrowserSelector =
    useSelector<State, JoarkBrowserSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_previewFile, setPreviewFile] = useState<JoarkFileWithContent | undefined>(undefined)
  const [clickedPreviewFile, setClickedPreviewFile] = useState<any>(undefined)
  const [mounted, setMounted] = useState<boolean>(false)
  const [modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_items, setItems] = useState<Array<JoarkTableItem> | undefined>(undefined)

  const context = {
    files: files,
    loadingJoarkPreviewFile: loadingJoarkPreviewFile,
    previewFile: _previewFile,
    clickedPreviewFile: clickedPreviewFile
  }

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

  const onPreviewItem = (clickedItem: any): void => {
    setClickedPreviewFile(clickedItem)
    const foundFile = _.find(files, (file) => (equalFiles(file, clickedItem) && (file as JoarkFileWithContent).content !== undefined))
    if (!foundFile) {
      console.log(clickedItem)
      dispatch(getPreviewJoarkFile(clickedItem))
    } else {
      dispatch(setPreviewJoarkFile(foundFile))
    }
  }

  const onSelectedItemChange = (items: Array<any>): void => {
    onFilesChange(items.filter(item => item.selected))
  }

  const convertSomeNonAlphanumericCharactersToUnderscore = (text: string) => {
    return text.replace(/[ .\-\\(\\)]/g, '_')
  }

  const renderButtonsCell = (item: any, value: any, context: any) => {
    if (item.hasSubrows) {
      return <div />
    }
    const previewing = context.loadingJoarkPreviewFile
    const spinner = previewing && _.isEqual(item, context.clickedPreviewFile)
    return (
      <VariantDiv
        key={item.label}
      >
        <Buttons>
          <HorizontalSeparatorDiv />
          <HighContrastKnapp
            data-tip={t('ui:preview')}
            kompakt
            mini
            disabled={previewing}
            spinner={spinner}
            id={'c-tablesorter__preview-button-' + item.journalpostId + '-' + item.dokumentInfoId + '-' +
            convertSomeNonAlphanumericCharactersToUnderscore(item.label)}
            className='c-tablesorter__preview-button'
            onClick={() => onPreviewItem(item)}
          >
            {spinner ? '' : <FontAwesomeIcon icon={icons.faEye} />}
          </HighContrastKnapp>
          <HorizontalSeparatorDiv />
        </Buttons>
      </VariantDiv>
    )
  }

  useEffect(() => {
    const getItems = () => {
      const items: Array<JoarkTableItem> = []

      if (list) {
        list.forEach((post: JoarkPoster) => {
          let multipleDocuments: boolean = false

          if (post.dokumenter.length > 1) {
            multipleDocuments = true
            items.push({
              key: 'joark-file-group-' + post.journalpostId,

              journalpostId: post.journalpostId,

              title: post.tittel,
              tema: post.tema,
              date: new Date(Date.parse(post.datoOpprettet)),
              label: post.tittel,

              disabled: false,
              hasSubrows: true
            } as JoarkTableItem)
          }

          post.dokumenter.forEach((doc: JoarkDoc) => {
            let variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'SLADDET')
            if (!variant) {
              variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'ARKIV')
            }
            if (!variant) {
              if (!_.isEmpty(doc.dokumentvarianter)) {
                variant = doc.dokumentvarianter[0]
              } else {
                return
              }
            }

            const selected = _.find(files, {
              dokumentInfoId: doc.dokumentInfoId,
              variant: variant
            }) !== undefined

            const disabled = _.find(disabledFiles, {
              fileName: variant?.filnavn
            }) !== undefined

            const item: JoarkTableItem = {
              key: post.journalpostId + '-' + doc.dokumentInfoId + '-' + variant?.variantformat + '-' + selected,

              journalpostId: post.journalpostId,
              dokumentInfoId: doc.dokumentInfoId,
              variant: variant!,

              title: doc.tittel || '-',
              tema: post.tema,
              date: new Date(Date.parse(post.datoOpprettet)),
              label: variant?.variantformat + (variant?.filnavn ? ' (' + variant?.filnavn + ')' : ''),

              selected: selected,
              disabled: disabled,
              hasSubrows: false
            }
            if (multipleDocuments) {
              item.parentKey = 'joark-file-group-' + post.journalpostId
            }
            items.push(item)
          })
        })
      }
      return items
    }

    if (!_.isEmpty(list) && _items === undefined) {
      setItems(getItems())
    }
  }, [disabledFiles, files, list, _items])

  useEffect(() => {
    if (!mounted && list === undefined && !loadingJoarkList) {
      dispatch(listJoarkFiles(aktoerId))
    }
    setMounted(true)
  }, [aktoerId, dispatch, list, loadingJoarkList, mounted])

  useEffect(() => {
    if (!equalFiles(previewFile, _previewFile)) {
      setPreviewFile(previewFile)
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
              width={600}
              height={800}
              tema='simple'
              viewOnePage={false}
              onContentClick={handleModalClose}
            />
          </div>
        )
      })
      if (_.isFunction(onPreviewFile)) {
        onPreviewFile(previewFile)
      }
    }
  }, [handleModalClose, onPreviewFile, previewFile, _previewFile])

  if (!mounted) {
    return <div />
  }

  return (
    <div className='c-joarkBrowser'>
      <Modal modal={modal} onModalClose={handleModalClose} />
      <TableSorter
        id={'table-' + id}
        highContrast={highContrast}
        items={_items}
        context={context}
        itemsPerPage={30}
        compact
        searchable
        selectable
        sortable
        loading={loadingJoarkList}
        columns={[
          {
            id: 'title',
            label: t('ui:title'),
            type: 'string'
          }, {
            id: 'tema',
            label: t('ui:tema'),
            type: 'string',
            renderCell: (item: any, value: any) => <EtikettLiten>{value}</EtikettLiten>
          }, {
            id: 'date',
            label: t('ui:date'),
            type: 'date'
          }, {
            id: 'label',
            label: t('ui:variant'),
            type: 'object',
            renderCell: (item: any, value: any) => <Normaltekst>{value}</Normaltekst>
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
