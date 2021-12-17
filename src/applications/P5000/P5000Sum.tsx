import { Alert, BodyLong, Button, HelpText, Loader, Tag } from '@navikt/ds-react'
import { typePeriode } from 'applications/P5000/P5000.labels'
import Select from 'components/Select/Select'
import { OneLineSpan } from 'components/StyledComponents'
import { Labels, LocalStorageValue, Option } from 'declarations/app'
import { P5000FromRinaMap, SakTypeMap, SakTypeValue, Seds } from 'declarations/buc.d'
import { P5000Context, P5000SED, P5000SumRow, P5000SumRows } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'

import {
  AlignEndRow,
  Column,
  FlexDiv,
  FlexEndSpacedDiv,
  HiddenDiv,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import Table, { RenderEditableOptions, Sort } from 'tabell'
import { convertFromP5000SumRowsIntoP5000SED, convertP5000SEDToP5000SumRows } from './conversion'

export interface P5000SumProps {
  context: P5000Context
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: LocalStorageValue<P5000SED> | undefined
  saveP5000ToStorage: ((newSed: P5000SED, sedId: string) => void) | undefined
  seds: Seds
}

const mapState = (state: State): any => ({
  sakType: state.app.params.sakType as SakTypeValue
})

const P5000Sum: React.FC<P5000SumProps> = ({
  context, p5000FromRinaMap, p5000FromStorage, saveP5000ToStorage, seds
}: P5000SumProps) => {
  const { t } = useTranslation()
  const { sakType } = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [renderPrintTable, _setRenderPrintTable] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: 'none' })

  const [typeOptions] = useState<Array<Option>>(() => Object.keys(typePeriode)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(typePeriode, e), value: '' + e })))

  const items = convertP5000SEDToP5000SumRows(seds, context, p5000FromRinaMap, p5000FromStorage)

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    _setRenderPrintTable(true)
    standardLogger('buc.edit.tools.P5000.sum.print.button')
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    _setRenderPrintTable(false)
  }

  const renderType = (item: any, value: any) => (
    <BodyLong>
      {(typePeriode as Labels)[value] + ' [' + value + ']'}
    </BodyLong>
  )

  const renderTypeEdit = (options: RenderEditableOptions) => (
    <div style={{ minWidth: '200px' }}>
      <Select
        key={'c-table__edit-type-select-key-' + options.value}
        id='c-table__edit-type-select-id'
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

  const renderStatus = (item: any, value: any) => {
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

  let columns = [
    {
      id: 'status',
      label: t('ui:status'),
      type: 'string',
      renderCell: renderStatus,
      edit: {
        defaultValue: 'new',
        render: () => <div />
      }
    },
    {
      id: 'type',
      label: t('ui:type'),
      type: 'string',
      renderCell: renderType,
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
    label: t('buc:p5000-5-1-title')
  }, {
    colSpan: 3,
    label: t('buc:p5000-5-2-title')
  }]

  if (context === 'edit') {
    columns = columns.concat({ id: 'buttons', type: 'buttons', label: '' })
  }

  const onRowsChanged = (items: P5000SumRows) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000FromStorage?.content)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000FromRinaMap[seds[0].id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000SumRowsIntoP5000SED(items, templateForP5000)
      saveP5000ToStorage!(newP5000FromStorage, seds[0].id)
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
    <>
      <PileCenterDiv>
        <AlignEndRow style={{ width: '100%' }}>
          <Column />
          <Column>
            <FlexEndSpacedDiv style={{ flexDirection: 'row-reverse' }}>
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
            </FlexEndSpacedDiv>
          </Column>
        </AlignEndRow>
        <VerticalSeparatorDiv />
        {sakType === SakTypeMap.GJENLEV && (
          <>
            <AlignEndRow style={{ width: '100%' }}>
              <Column>
                <Alert variant='warning'>
                  {t('message:warning-P5000SumGjenlevende')}
                </Alert>
              </Column>
              <Column />
            </AlignEndRow>
            <VerticalSeparatorDiv />
          </>
        )}
        {!!sakType && (
          <>
            <AlignEndRow style={{ width: '100%' }}>
              <Column flex='2'>
                <Alert variant='warning'>
                  <>
                    <FlexDiv>
                      <OneLineSpan>
                        {t('message:warning-P5000Sum-instructions-title')}
                      </OneLineSpan>
                      <HorizontalSeparatorDiv size='0.5' />
                      <HelpText>
                        <div style={{ maxWidth: '600px' }}>
                          {t('message:warning-P5000Sum-instructions-title-help')}
                        </div>
                      </HelpText>
                    </FlexDiv>
                    <div>
                      <strong>
                        {t('message:warning-P5000Sum-instructions-title-obs')}
                      </strong>
                    </div>
                    {hasMoreWarnings && (
                      <div>
                        <VerticalSeparatorDiv />
                        <hr />
                        <VerticalSeparatorDiv size='0.7' />
                        {t('message:warning-P5000Sum-instructions-header')}
                        <VerticalSeparatorDiv />
                      </div>
                    )}
                    <ul>
                      {has5152diffs && (
                        <li>
                          {t('message:warning-P5000Sum-instructions-5152')}
                          <VerticalSeparatorDiv size='0.5' />
                        </li>
                      )}
                      {has40aar && (
                        <li>
                          {t('message:warning-P5000Sum-instructions-40')}
                          <VerticalSeparatorDiv size='0.5' />
                        </li>
                      )}
                      {has45 && (
                        <li>
                          {t('message:warning-P5000Sum-instructions-45')}
                          <VerticalSeparatorDiv size='0.5' />
                        </li>
                      )}
                    </ul>
                  </>
                </Alert>
              </Column>
              <Column />
            </AlignEndRow>
            <VerticalSeparatorDiv />
          </>
        )}
        <hr style={{ width: '100%' }} />
        <VerticalSeparatorDiv />
        <Table<P5000SumRow>
          animatable={false}
          items={items}
          searchable={false}
          selectable={false}
          editable={context === 'edit'}
          allowNewRows={false}
          sortable={false}
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.summary.sort', { sort: sort })
            _setTableSort(sort)
          }}
          onRowsChanged={onRowsChanged}
          itemsPerPage={_itemsPerPage}
          labels={{}}
          categories={categories}
          columns={columns}
        />
        <VerticalSeparatorDiv />
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
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </>
  )
}

P5000Sum.propTypes = {
  p5000FromRinaMap: PT.any.isRequired
}

export default P5000Sum
