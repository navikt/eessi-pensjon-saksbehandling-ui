import { getJoarkItemPreview, listJoarkItems, setJoarkItemPreview } from 'src/actions/joark'
import Modal from 'src/components/Modal/Modal'
import { SedNewType, SedType } from 'src/declarations/buc'
import { ModalContent } from 'src/declarations/components'
import {
  JoarkBrowserContext,
  JoarkBrowserItem,
  JoarkBrowserItems,
  JoarkBrowserItemWithContent,
  JoarkDoc,
  JoarkFileVariant,
  JoarkPoster,
  JoarkType,
  RelevantDato
} from 'src/declarations/joark'
import { JoarkBrowserItemFileType } from 'src/declarations/joark.pt'
import { State } from 'src/declarations/reducers'
//import File from '@navikt/forhandsvisningsfil'
import _ from 'lodash'
import { Button, Loader, Label, Select } from '@navikt/ds-react'
import PT from 'prop-types'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Table, { RenderOptions } from '@navikt/tabell'
import md5 from 'md5'
import { TrashIcon, EyeWithPupilFillIcon } from '@navikt/aksel-icons'
import PDFViewer from "src/components/PDFViewer/PDFViewer";

const ButtonsDiv = styled.div`
  display: flex;
  align-items: flex-start;
  padding-top: 0.25rem;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
`

const SelectDiv = styled.div`
  margin-left: 0.5rem;
  margin-bottom: 0.4rem;
  width: 9rem;
  div.navds-select__container {
    width: 4.5rem;
  }
`

export interface JoarkBrowserSelector {
  aktoerId: string | null | undefined
  list: Array<JoarkPoster> | undefined
  loadingJoarkList: boolean
  loadingJoarkPreviewFile: boolean
  previewFile: JoarkBrowserItemWithContent | undefined
}

export type JoarkBrowserMode = 'select' | 'view'
export type JoarkBrowserType = SedType | SedNewType | JoarkType

const mapState = /* istanbul ignore next */ (state: State): JoarkBrowserSelector => ({
  aktoerId: state.app.params.aktoerId,
  list: state.joark.list,
  loadingJoarkList: state.loading.loadingJoarkList,
  loadingJoarkPreviewFile: state.loading.loadingJoarkPreviewFile,
  previewFile: state.joark.previewFile
})

export interface JoarkBrowserProps {
  existingItems: JoarkBrowserItems
  onRowSelectChange?: (f: JoarkBrowserItems) => void
  onPreviewFile?: (f: JoarkBrowserItemWithContent) => void
  onRowViewDelete?: (f: JoarkBrowserItems) => void
  itemsPerPage?: number
  setItemsPerPage?: (f: number) => void
  mode: JoarkBrowserMode
  tableId: string
}

export const JoarkBrowser: React.FC<JoarkBrowserProps> = ({
  existingItems = [],
  mode,
  onRowSelectChange = () => {},
  onRowViewDelete = () => {},
  onPreviewFile,
  itemsPerPage,
  setItemsPerPage = () => {},
  tableId
}: JoarkBrowserProps): JSX.Element => {
  const {
    aktoerId, list, loadingJoarkList, loadingJoarkPreviewFile, previewFile
  }: JoarkBrowserSelector = useSelector<State, JoarkBrowserSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_clickedPreviewItem, setClickedPreviewItem] = useState<JoarkBrowserItem | undefined>(undefined)
  const [_items, setItems] = useState<JoarkBrowserItems | undefined>(undefined)
  const [_modal, setModal] = useState<ModalContent | undefined>(undefined)
  const [_modalInViewMode, setModalInViewMode] = useState<boolean>(false)
  const [_previewFile, setPreviewFile] = useState<JoarkBrowserItemWithContent | undefined>(undefined)
  const [_tableKey, setTableKey] = useState<string>('')

  const context: JoarkBrowserContext = {
    existingItems,
    loadingJoarkPreviewFile,
    previewFile: _previewFile,
    clickedPreviewItem: _clickedPreviewItem,
    mode
  }

  const equalFiles = (a: JoarkBrowserItem | undefined, b: JoarkBrowserItem | undefined): boolean => {
    if (!a && !b) { return true }
    if ((!a && b) || (a && !b)) { return false }

    if (
      (!(a as any).journalpostId && (b as any).journalpostId) ||
      ((a as any).journalpostId && !(b as any).journalpostId)) {
      return false
    }
    return a!.journalpostId === b!.journalpostId &&
      a!.dokumentInfoId === b!.dokumentInfoId &&
      _.isEqual(a!.variant, b!.variant)
  }

  const handleModalClose = useCallback(() => {
    setModalInViewMode(false)
    dispatch(setJoarkItemPreview(undefined))
  }, [dispatch])

  const onPreviewItem = (clickedItem: JoarkBrowserItem): void => {
    setClickedPreviewItem(clickedItem)
    if(mode === "view"){
      setModalInViewMode(true)
    }
    dispatch(getJoarkItemPreview(clickedItem))
  }

  const handleDelete = (itemToDelete: JoarkBrowserItem, contextFiles: JoarkBrowserItems | undefined): void => {
    const newExistingItems: JoarkBrowserItems = _.reject(contextFiles, (item: JoarkBrowserItem) => {
      return itemToDelete.journalpostId === item.journalpostId &&
        itemToDelete.dokumentInfoId === item.dokumentInfoId
    })
    if (_.isFunction(onRowViewDelete)) {
      onRowViewDelete(newExistingItems)
    }
  }

  const renderButtonsCell = ({ item, context }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext>): JSX.Element => {
    if (item.hasSubrows) {
      return <div />
    }
    const previewing = context?.loadingJoarkPreviewFile
    const spinner = previewing && _.isEqual(item as JoarkBrowserItem, context?.clickedPreviewItem)
    return (
      <ButtonsDiv>
        {item.journalpostId && item.dokumentInfoId && (
          <Button
            variant='secondary'
            size='small'
            data-tip={t('ui:preview')}
            disabled={previewing}
            id={'c-tablesorter--preview-button-' + item.journalpostId + '-' + item.dokumentInfoId}
            data-testid={'c-tablesorter--preview-button-' + item.journalpostId + '-' + item.dokumentInfoId}
            className='c-tablesorter--preview-button'
            onClick={() => onPreviewItem(item as JoarkBrowserItem)}
          >
            {spinner ? <Loader /> : <EyeWithPupilFillIcon fontSize="1.5rem" />}
          </Button>
        )}

        {mode === 'view' && item.type === 'joark' && (
          <Button
            variant='secondary'
            size='small'
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              handleDelete(item as JoarkBrowserItem, context?.existingItems)
            }}
          >
            <TrashIcon fontSize="1.5rem" />
          </Button>
        )}
      </ButtonsDiv>
    )
  }

  const getVariantFromJoarkDoc = (doc: JoarkDoc): JoarkFileVariant | undefined => {
    let variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'SLADDET')
    if (!variant) {
      variant = _.find(doc.dokumentvarianter, (v: JoarkFileVariant) => v.variantformat === 'ARKIV')
    }
    if (!variant) {
      if (!_.isEmpty(doc.dokumentvarianter)) {
        variant = doc.dokumentvarianter[0]
      }
    }
    return variant
  }

  const getItemsForSelectMode = (list: Array<JoarkPoster> | undefined, existingItems: JoarkBrowserItems): JoarkBrowserItems => {
    if (!list) {
      return []
    }

    const items: JoarkBrowserItems = []
    const disabledItems: JoarkBrowserItems = _.filter(existingItems,
      (item: JoarkBrowserItem) => item.type === 'sed')
    const selectedItems: JoarkBrowserItems = _.filter(existingItems,
      (item: JoarkBrowserItem) => item.type === 'joark')

    list.forEach((post: JoarkPoster) => {
      let multipleDocuments: boolean = false

    const getFirstRelevantDatoOrDatoOpprettet = (arr?: Array<RelevantDato>) =>
    { return arr != null && arr.length > 0 ?
      arr[0].dato : post.datoOpprettet; };

    const journalfoerteDatoer = _.filter(post.relevanteDatoer,
        (relevantDato: RelevantDato) => relevantDato.datotype === 'DATO_JOURNALFOERT')

    const dateString = getFirstRelevantDatoOrDatoOpprettet(journalfoerteDatoer);

      if (post.dokumenter.length > 1) {
        multipleDocuments = true
        items.push({
          key: 'joark-group-' + post.journalpostId,
          type: 'joark',

          journalpostId: post.journalpostId,
          dokumentInfoId: undefined,
          variant: undefined,

          title: post.tittel,
          tema: post.tema,
          date: new Date(Date.parse(dateString)),

          disabled: false,
          hasSubrows: true
        } as JoarkBrowserItem)
      }

      post.dokumenter.forEach((doc: JoarkDoc) => {
        const variant = getVariantFromJoarkDoc(doc)

        const selected = _.find(selectedItems, {
          dokumentInfoId: doc.dokumentInfoId,
          variant
        }) !== undefined

        let disabled = _.find(disabledItems, {
          dokumentInfoId: doc.dokumentInfoId
        }) !== undefined

        if (!variant) {
          disabled = true
        }

        const item: JoarkBrowserItem = {
          key: post.journalpostId + '-' + doc.dokumentInfoId + '-' + variant?.variantformat + '-' + selected,
          type: 'joark',

          journalpostId: post.journalpostId,
          dokumentInfoId: doc.dokumentInfoId,
          variant,

          title: doc.tittel || '-',
          tema: post.tema,
          date: new Date(Date.parse(dateString)),

          selected,
          disabled,
          hasSubrows: false
        }
        if (multipleDocuments) {
          item.parentKey = 'joark-group-' + post.journalpostId
        }
        items.push(item)
      })
    })

    return items
  }

  const getItemsForViewMode = (list: Array<JoarkPoster> | undefined, existingItems: JoarkBrowserItems): JoarkBrowserItems => {
    const items: JoarkBrowserItems = []
    existingItems.forEach((existingItem: JoarkBrowserItem, index: number) => {
      const match = existingItem.title.match(/^(\d+)_ARKIV\.pdf$/)
      if (list && match) {
        const id = match[1]
        let journalpostDoc: JoarkDoc | undefined
        for (const jp of list) {
          for (const doc of jp.dokumenter) {
            if (doc.dokumentInfoId === id) {
              journalpostDoc = doc
              if (doc.tittel) {
                existingItem.title = doc.tittel
                existingItem.dokumentInfoId = doc.dokumentInfoId
                existingItem.journalpostId = jp.journalpostId
                existingItem.variant = getVariantFromJoarkDoc(doc)
                existingItem.tema = jp.tema
              }
              break
            }
          }
          if (journalpostDoc) {
            break
          }
        }
      }
      items.push({
        ...existingItem,
        key: existingItem.dokumentInfoId ? 'id-' + existingItem.dokumentInfoId : 'id-' + index,
        type: existingItem.type,
        title: (existingItem.type === 'sed' ? '✓ ' : ' ') + existingItem.title,
        visible: true,
        disabled: false,
        hasSubrows: false
      } as JoarkBrowserItem)
    })
    return items
  }

  const itemsPerPageChanged = (e: any): void => {
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  // this will update when we get updated existingItems
  useEffect(() => {
    let items: JoarkBrowserItems = []
    if (mode === 'select') {
      items = getItemsForSelectMode(list, existingItems)
    }
    if (mode === 'view') {
      items = getItemsForViewMode(list, existingItems)
    }
    setTableKey(md5(JSON.stringify(list) + JSON.stringify(existingItems)) as string)
    setItems(items)
  }, [existingItems, list, mode, setTableKey])

  useEffect(() => {
    if (list === undefined && !loadingJoarkList && !!aktoerId) {
      dispatch(listJoarkItems(aktoerId))
    }
  }, [])

  useEffect(() => {
    if(mode !== "select" && _modalInViewMode){
      if (!equalFiles(previewFile, _previewFile)) {
        setPreviewFile(previewFile)
        if (!previewFile) {
          return setModal(undefined)
        }
        setModal({
          modalContent: (
            <div
              style={{ cursor: 'pointer' }}
            >
              <PDFViewer
                file={previewFile?.content.base64}
                name={previewFile?.name ?? ''}
                size={previewFile?.size ?? 0}
                width={900}
                height={1200}
              />
            </div>
          )
        })
        if (_.isFunction(onPreviewFile)) {
          onPreviewFile(previewFile)
        }
      }
    }
  }, [mode, _modalInViewMode, handleModalClose, onPreviewFile, previewFile, _previewFile])

  return (
    <div data-testid='c-joarkBrowser'>
      {mode !== "select" &&
        <Modal
          open={!_.isNil(_modal)}
          modal={_modal}
          onModalClose={handleModalClose}
          width={"900"}
        />
      }
      {mode === "select" &&
        <SelectDiv>
          <Select
            id='itemsPerPage'
            label={t('ui:itemsPerPage')}
            onChange={itemsPerPageChanged}
            value={itemsPerPage === 9999 ? 'all' : '' + itemsPerPage}
            size="small"
          >
            <option value='7'>7</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
            <option value='all'>{t('ui:all')}</option>
          </Select>
        </SelectDiv>
      }
      <Table
        <JoarkBrowserItem, JoarkBrowserContext>
        id={'joarkbrowser-' + tableId}
        items={_items}
        key={_tableKey}
        context={context}
        labels={{
          type: t('ui:attachments').toLowerCase()
        }}
        itemsPerPage={itemsPerPage}
        animatable={false}
        searchable={mode === 'select'}
        selectable={mode === 'select'}
        sortable={mode === 'select'}
        summary
        loading={loadingJoarkList}
        columns={[
          {
            id: 'tema',
            label: t('ui:tema'),
            type: 'string',
            render: ({ value }: RenderOptions<JoarkBrowserItem, JoarkBrowserContext, string>) => <Label>{value}</Label>
          }, {
            id: 'title',
            label: t('ui:title'),
            type: 'string'
          }, {
            id: 'date',
            label: t('ui:date'),
            type: 'date',
            dateFormat: 'DD.MM.YYYY'
          }, {
            id: 'buttons',
            label: '',
            type: 'object',
            render: renderButtonsCell
          }
        ]}
        onRowSelectChange={onRowSelectChange}
        size={'small'}
      />
    </div>
  )
}

JoarkBrowser.propTypes = {
  existingItems: PT.arrayOf(JoarkBrowserItemFileType.isRequired).isRequired,
  onRowSelectChange: PT.func,
  onPreviewFile: PT.func,
  onRowViewDelete: PT.func,
  mode: PT.oneOf<JoarkBrowserMode>(['select', 'view']).isRequired,
  tableId: PT.string.isRequired
}

export default JoarkBrowser
