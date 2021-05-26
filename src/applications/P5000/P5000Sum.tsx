import { typeOptions } from 'applications/P5000/P5000Edit'
import Select from 'components/Select/Select'
import { P5000FromRinaMap, SakTypeMap, SakTypeValue, Seds } from 'declarations/buc.d'
import { P5000Context, P5000SED, P5000SumRow } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import Alertstripe from 'nav-frontend-alertstriper'
import NavHighContrast, {
  Column,
  FlexEndSpacedDiv,
  HiddenDiv,
  HighContrastKnapp,
  PileCenterDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import PT from 'prop-types'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import Table, { RenderEditableOptions, Sort } from 'tabell'
import { convertP5000SEDTotalsToP5000SumRows } from './conversion'

export interface P5000SumProps {
  context: P5000Context
  highContrast: boolean
  p5000FromRinaMap: P5000FromRinaMap
  p5000FromStorage: P5000SED | undefined
  seds: Seds
}

const mapState = (state: State): any => ({
  sakType: state.app.params.sakType as SakTypeValue
})

const P5000Sum: React.FC<P5000SumProps> = ({
  context, highContrast, p5000FromRinaMap, p5000FromStorage,
  seds
}: P5000SumProps) => {
  const { t } = useTranslation()
  const { sakType } = useSelector<State, any>(mapState)
  const componentRef = useRef(null)

  const [_itemsPerPage] = useState<number>(30)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<Sort>({ column: '', order: '' })
  const [items, sourceStatus] = convertP5000SEDTotalsToP5000SumRows(seds, context, p5000FromRinaMap, p5000FromStorage)

  const renderTypeEdit = (options: RenderEditableOptions) => {
    return (
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
    )
  }

  let columns = [
    {
      id: 'type',
      label: t('ui:type'),
      type: 'string',
      edit: {
        render: renderTypeEdit,
        validation: [{
          mandatory: false,
          test: '^.+$',
          message: t('buc:validation-chooseType')
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
    colSpan: 1,
    label: ''
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
          itemsPerPage={_itemsPerPage}
          labels={{}}
          compact
          categories={categories}
          columns={columns}
        />
        <VerticalSeparatorDiv />
        {t('buc:p5000-source-status-' + sourceStatus)}
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
