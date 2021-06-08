import { typePeriode } from 'applications/P5000/P5000.labels'
import { typeOptions } from 'applications/P5000/P5000Edit'
import Select from 'components/Select/Select'
import { Labels } from 'declarations/app'
import { P5000FromRinaMap, SakTypeMap, SakTypeValue, Seds } from 'declarations/buc.d'
import { P5000Context, P5000SED, P5000SumRow, P5000SumRows } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag from 'flagg-ikoner'
import CountryData, { Countries, Country, CountryList } from 'land-verktoy'
import CountrySelect from 'landvelger'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import EtikettBase from 'nav-frontend-etiketter'
import { Normaltekst } from 'nav-frontend-typografi'
import NavHighContrast, {
  Column,
  FlexCenterDiv,
  FlexEndSpacedDiv,
  HiddenDiv,
  HighContrastKnapp,
  HorizontalSeparatorDiv,
  PileCenterDiv,
  Row,
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
  highContrast: boolean
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: P5000SED | undefined
  saveP5000ToStorage: ((newSed: P5000SED, sedId: string) => void) | undefined
  seds: Seds
}

const mapState = (state: State): any => ({
  countryList: state.buc.countryList,
  sakType: state.app.params.sakType as SakTypeValue
})

const P5000Sum: React.FC<P5000SumProps> = ({
  context, highContrast, p5000FromRinaMap, p5000FromStorage, saveP5000ToStorage, seds
}: P5000SumProps) => {
  const { t } = useTranslation()
  const { countryList, sakType } = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: '' })
  const [items] = convertP5000SEDToP5000SumRows(seds, context, p5000FromRinaMap, p5000FromStorage)

  const _countryData: CountryList = CountryData.getCountryInstance('nb')

  const renderType = (item: any, value: any) => (
    <Normaltekst>
      {(typePeriode as Labels)[value] + ' [' + value + ']'}
    </Normaltekst>
  )

  const renderTypeEdit = (options: RenderEditableOptions) => (
    <div style={{ minWidth: '200px' }}>
      <Select
        key={'c-table__edit-type-select-key-' + options.value}
        id='c-table__edit-type-select-id'
        className='P5000Edit-type-select'
        highContrast={highContrast}
        feil={options.feil}
        options={typeOptions}
        menuPortalTarget={document.body}
        onChange={(e) => options.setValue({ type: e!.value })}
        defaultValue={_.find(typeOptions, o => o.value === options.value)}
        selectedValue={_.find(typeOptions, o => o.value === options.value)}
      />
    </div>
  )

  const renderLand = (item: any, value: any): JSX.Element => {
    const country: Country | undefined = value ? _countryData.findByValue(value) : undefined
    if (!country) {
      return <div>-</div>
    }
    return (
      <FlexCenterDiv>
        <Flag
          animate
          label={country?.label}
          country={value}
          size='S'
          type='circle'
          wave={false}
        />
        <HorizontalSeparatorDiv size='0.35' />
        <span>
          {country?.label}
        </span>
      </FlexCenterDiv>
    )
  }

  const renderLandEdit = (options: RenderEditableOptions) => {
    const _countryValueList: Countries = options.value ? _countryData.filterByValueOnArray([options.value]) : []
    return (
      <div style={{ minWidth: '150px' }}>
        <CountrySelect
          ariaLabel={t('ui:country')}
          closeMenuOnSelect
          flagType='circle'
          hideSelectedOptions={false}
          highContrast={highContrast}
          includeList={countryList}
          values={_countryValueList}
          menuPortalTarget={document.body}
          label=''
          onOptionSelected={(o: Country) => options.setValue({ land: o!.alpha2 })}
        />
      </div>
    )
  }

  const renderStatus = (item: any, value: any) => {
    if (value === 'rina') {
      return <EtikettBase mini type='info'>RINA</EtikettBase>
    }
    if (value === 'new') {
      return <EtikettBase mini type='suksess'>Ny</EtikettBase>
    }
    if (value === 'edited') {
      return <EtikettBase mini type='fokus'>Endret</EtikettBase>
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
          message: t('buc:validation-chooseType')
        }]
      }
    },
    {
      id: 'land',
      label: t('ui:country'),
      type: 'object',
      renderCell: renderLand,
      edit: {
        render: renderLandEdit
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
  const beforePrintOut = (): void => {}

  const prepareContent = (): void => {
    standardLogger('buc.edit.tools.P5000.summary.print.button')
    _setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
  }

  const onRowsChanged = (items: P5000SumRows) => {
    let templateForP5000: P5000SED | undefined = _.cloneDeep(p5000FromStorage)
    if (_.isNil(templateForP5000)) {
      templateForP5000 = _.cloneDeep(p5000FromRinaMap[seds[0].id])
    }
    if (templateForP5000) {
      const newP5000FromStorage: P5000SED = convertFromP5000SumRowsIntoP5000SED(items, templateForP5000)
      saveP5000ToStorage!(newP5000FromStorage, seds[0].id)
    }
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <PileCenterDiv>
        <Row>
          <Column />
          <Column>
            <FlexEndSpacedDiv style={{ flexDirection: 'row-reverse' }}>
              <ReactToPrint
                documentTitle='P5000Sum'
                onAfterPrint={afterPrintOut}
                onBeforePrint={beforePrintOut}
                onBeforeGetContent={prepareContent}
                trigger={() =>
                  <HighContrastKnapp
                    disabled={_printDialogOpen}
                    spinner={_printDialogOpen}
                  >
                    {t('ui:print')}
                  </HighContrastKnapp>}
                content={() => {
                  return componentRef.current
                }}
              />
            </FlexEndSpacedDiv>
          </Column>
        </Row>
        <VerticalSeparatorDiv />
        {sakType === SakTypeMap.GJENLEV && (
          <>
            <Row>
              <Column>
                <Alertstripe type='advarsel'>
                  {t('buc:warning-P5000SumGjenlevende')}
                </Alertstripe>
              </Column>
              <Column />
            </Row>
            <VerticalSeparatorDiv />
          </>
        )}
        {(sakType === SakTypeMap.ALDER || sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.UFOREP) && (
          <>
            <Row>
              <Column>
                <Alertstripe type='advarsel'>
                  {t('buc:warning-P5000SumGjenlevende2')}
                </Alertstripe>
              </Column>
              <Column />
            </Row>
            <VerticalSeparatorDiv />
          </>
        )}
        <hr style={{ width: '100%' }} />
        <VerticalSeparatorDiv />
        <Table<P5000SumRow>
          highContrast={highContrast}
          items={items}
          searchable={false}
          selectable={false}
          editable={context === 'edit'}
          sortable={false}
          onColumnSort={(sort: any) => {
            standardLogger('buc.edit.tools.P5000.summary.sort', { sort: sort })
            _setTableSort(sort)
          }}
          onRowsChanged={onRowsChanged}
          itemsPerPage={_itemsPerPage}
          labels={{}}
          compact
          categories={categories}
          columns={columns}
        />
        <VerticalSeparatorDiv />
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
              compact
              categories={categories}
              columns={columns}
            />
          </div>
        </HiddenDiv>
      </PileCenterDiv>
      <VerticalSeparatorDiv size='3' />
    </NavHighContrast>
  )
}

P5000Sum.propTypes = {
  highContrast: PT.bool.isRequired,
  p5000FromRinaMap: PT.any.isRequired
}

export default P5000Sum
