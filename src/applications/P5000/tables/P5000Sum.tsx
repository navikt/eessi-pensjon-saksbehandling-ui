import {Alert, BodyLong, Button, HelpText, Loader, Tag, SortState, VStack, HStack, Spacer} from '@navikt/ds-react'
import { typePeriode } from 'src/applications/P5000/P5000.labels'
import Select from 'src/components/Select/Select'
import {HorizontalLineSeparator} from 'src/components/StyledComponents'
import { Labels, LocalStorageEntry, Option } from 'src/declarations/app'
import { SakTypeMap, SakTypeValue, Sed } from 'src/declarations/buc.d'
import { P5000sFromRinaMap, P5000SED, P5000SumRow, P5000SumRows } from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import Table, { RenderEditableOptions, Column as TableColumn, RenderOptions } from '@navikt/tabell'
import { convertFromP5000SumRowsIntoP5000SED, convertP5000SEDToP5000SumRows } from 'src/applications/P5000/utils/conversion'
import HiddenDiv from "src/components/HiddenDiv/HiddenDiv";

export interface P5000SumProps {
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000WorkingCopy: LocalStorageEntry<P5000SED> | undefined
  updateWorkingCopy: (newSed: P5000SED, sedId: string) => void
  mainSed: Sed | undefined
}

const mapState = (state: State): any => ({
  sakType: state.app.params.sakType as SakTypeValue
})

const P5000Sum: React.FC<P5000SumProps> = ({
  p5000sFromRinaMap, p5000WorkingCopy, updateWorkingCopy, mainSed
}: P5000SumProps) => {
  const { t } = useTranslation()
  const { sakType } = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [renderPrintTable, _setRenderPrintTable] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<SortState>({ orderBy: '', direction: 'none' })

  const [typeOptions] = useState<Array<Option>>(() => Object.keys(typePeriode)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(typePeriode, e), value: '' + e })))

  const items = convertP5000SEDToP5000SumRows(mainSed ? [mainSed] : [], p5000sFromRinaMap, p5000WorkingCopy)

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    _setRenderPrintTable(true)
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    _setRenderPrintTable(false)
  }

  const renderType = ({ value } :RenderOptions<P5000SumRow>) => (
    <BodyLong>
      {(typePeriode as Labels)[value] + ' [' + value + ']'}
    </BodyLong>
  )

  const renderTypeEdit = (options: RenderEditableOptions<P5000SumRow>) => (
    <div style={{ minWidth: '200px' }}>
      <Select
        key={'c-table--edit-type-select-key-' + options.value}
        id='c-table--edit-type-select-id'
        className='P5000Edit-type-select'
        error={options.error}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => options.setValues({ type: (e as Option).value })}
        defaultValue={_.find(typeOptions, o => o.value === options.value)}
        value={_.find(typeOptions, o => o.value === options.value)}
      />
    </div>
  )

  const renderStatus = ({ value } :RenderOptions<P5000SumRow> | RenderEditableOptions<P5000SumRow>) => {
    if (value === 'rina') {
      return <Tag size='small' variant='info'>RINA</Tag>
    }
    if (value === 'new') {
      return <Tag size='small' variant='success'>Ny</Tag>
    }
    if (value === 'edited') {
      return <Tag size='small' variant='warning'>Endret</Tag>
    }
    return <div />
  }

  let columns: Array<TableColumn<P5000SumRow>> = [
    {
      id: 'status',
      label: t('ui:status'),
      type: 'string',
      render: renderStatus,
      edit: {
        defaultValue: 'new',
        render: renderStatus
      }
    },
    {
      id: 'type',
      label: t('ui:type'),
      type: 'string',
      render: renderType,
      edit: {
        render: renderTypeEdit,
        validation: [{
          mandatory: false,
          test: '^.+$',
          message: t('message:validation-chooseType')
        }]
      }
    },
    { id: 'sec51aar', label: t('ui:year'), type: 'string' },
    { id: 'sec51mnd', label: t('ui:month'), type: 'string' },
    { id: 'sec51dag', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
    { id: 'sec52aar', label: t('ui:year'), type: 'string' },
    { id: 'sec52mnd', label: t('ui:month'), type: 'string' },
    { id: 'sec52dag', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' }
  ]

  const categories = [{
    colSpan: 2,
    label: '',
    border: false
  }, {
    colSpan: 3,
    label: t('p5000:5-1-title')
  }, {
    colSpan: 3,
    label: t('p5000:5-2-title')
  }]

  if (!_.isNil(mainSed)) { // we can edit, there is a mainSed
    columns = columns.concat({ id: 'buttons', type: 'buttons', label: '' })
  }

  const onRowsChanged = (items: P5000SumRows) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000WorkingCopy?.content)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000sFromRinaMap[mainSed!.id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000SumRowsIntoP5000SED(items, templateForP5000)
      updateWorkingCopy(newP5000FromStorage, mainSed!.id)
    }
  }

  const has40aar: boolean = _.some(items, it => parseFloat(it.sec51aar) >= 40 || parseFloat(it.sec52aar) >= 40)
  const has45: boolean = _.some(items, it => it.type === '45')
  const has5152diffs: boolean = _.some(items, it => {
    return ['11', '12', '13', '30', '41'].indexOf(it.type) >= 0 && (
      it.sec51aar !== it.sec52aar || it.sec51mnd !== it.sec52mnd || it.sec51dag !== it.sec52dag
    )
  })

  const hasMoreWarnings = has40aar || has45 || has5152diffs

  return (
    <VStack gap="4">
      <HStack gap="4">
        <Spacer/>
        <VStack gap="4">
        {sakType === SakTypeMap.GJENLEV && (
          <Alert variant='warning'>
            {t('p5000:warning-P5000SumGjenlevende')}
          </Alert>
        )}
        {!!sakType && (
          <Alert variant='warning'>
            <VStack gap="4">
              <HStack wrap={false}>
                {t('p5000:warning-P5000Sum-instructions-title')}
                <HelpText>
                    {t('p5000:warning-P5000Sum-instructions-title-help')}
                </HelpText>
              </HStack>
              <BodyLong>
                <strong>
                  {t('p5000:warning-P5000Sum-instructions-title-obs')}
                </strong>
              </BodyLong>
              {hasMoreWarnings && (
                <>
                  <HorizontalLineSeparator />
                  {t('p5000:warning-P5000Sum-instructions-header')}
                  <ul style={{marginTop: 0}}>
                    {has5152diffs && (
                      <li>
                        {t('p5000:warning-P5000Sum-instructions-5152')}
                      </li>
                    )}
                    {has40aar && (
                      <li>
                        {t('p5000:warning-P5000Sum-instructions-40')}
                      </li>
                    )}
                    {has45 && (
                      <li>
                        {t('p5000:warning-P5000Sum-instructions-45')}
                      </li>
                    )}
                  </ul>
                </>
              )}
            </VStack>
          </Alert>
        )}
        </VStack>
        <Spacer/>
      </HStack>
      <HStack gap="4">
        <Spacer/>
        <ReactToPrint
          documentTitle='P5000Sum'
          onAfterPrint={afterPrintOut}
          onBeforePrint={beforePrintOut}
          onBeforeGetContent={prepareContent}
          trigger={() =>
            <Button
              variant='secondary'
              disabled={_printDialogOpen}
            >
              {_printDialogOpen && <Loader />}
              {t('ui:print')}
            </Button>}
          content={() => {
            return componentRef.current
          }}
        />
      </HStack>
      <HorizontalLineSeparator />
      <Table<P5000SumRow>
        animatable={false}
        items={items}
        searchable={false}
        selectable={false}
        editable={!_.isNil(mainSed)}
        allowNewRows={false}
        sortable={false}
        onColumnSort={(sort: any) => {
          _setTableSort(sort)
        }}
        onRowsChanged={onRowsChanged}
        itemsPerPage={_itemsPerPage}
        labels={{}}
        categories={categories}
        columns={columns}
      />
      {renderPrintTable && (
        <HiddenDiv>
          <div ref={componentRef} id='printJS-form'>
            <Table<P5000SumRow>
            // important to it re-renders when sorting changes
              key={JSON.stringify(_tableSort)}
              className='print-version'
              items={items}
              animatable={false}
              searchable={false}
              selectable={false}
              editable={false}
              sortable={false}
              sort={_tableSort}
              itemsPerPage={9999}
              labels={{}}
              categories={categories}
              columns={columns}
            />
          </div>
        </HiddenDiv>
      )}
    </VStack>
  )
}

P5000Sum.propTypes = {
  p5000sFromRinaMap: PT.any.isRequired
}

export default P5000Sum
