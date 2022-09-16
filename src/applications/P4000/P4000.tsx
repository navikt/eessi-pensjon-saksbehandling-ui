import {BackFilled} from '@navikt/ds-icons'
import {BodyLong, Button} from '@navikt/ds-react'
import {BUCMode} from 'declarations/app'
import {Buc, Sed} from 'declarations/buc'
import {HorizontalSeparatorDiv, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {getSedP4000} from "../../actions/buc";
import {dateSorter} from "../BUC/components/BUCUtils/BUCUtils";
import {P4000SED, P4000ListRow, P4000TableContext, P4000ListRows} from "../../declarations/p4000";
import {State} from "../../declarations/reducers";
import Table, {Column, ColumnAlign, RenderOptions, Sort} from "@navikt/tabell";
import _ from "lodash";
import CountryData from "@navikt/land-verktoy";
import Tooltip from "@navikt/tooltip";
import {typePeriode} from "../P5000/P5000.labels";
import moment from "moment";
import {standardLogger} from "../../metrics/loggers";

export interface P4000Props {
  buc: Buc
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P4000Selector {
  p4000: P4000SED | undefined
}

const mapState = (state: State): P4000Selector => ({
  p4000: state.buc.p4000,
})


const P4000: React.FC<P4000Props> = ({
  buc,
  setMode
}: P4000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const countryInstance = CountryData.getCountryInstance('nb')
  const [_tableSort, _setTableSort] = useState<Sort>(() => ({ column: '', order: 'none' }))
  const {p4000}: P4000Selector = useSelector<State, P4000Selector>(mapState)
  console.log(p4000)
  console.log(_tableSort)

  const items: P4000ListRows = [
    {key: "", land: "NO", type: "", startdato: new Date("01-01-2020"), sluttdato: new Date("12-12-2020"), usikreDatoer: "0", tillegsInfo: "JA", arbeidsgiver: "NAV", sted: "Oslo", yrke: "Saksbehandler", ansattSelvstendig: "Ansatt"},
    {key: "", land: "NO", type: "", startdato: new Date("01-01-2020"), sluttdato: new Date("12-12-2020"), usikreDatoer: "1", tillegsInfo: "NEI", arbeidsgiver: "NAV", sted: "Oslo", yrke: "Saksbehandler", ansattSelvstendig: "Ansatt"},
    {key: "", land: "NO", type: "", startdato: new Date("01-01-2020"), sluttdato: new Date("12-12-2020"), usikreDatoer: "0", tillegsInfo: "NEI", arbeidsgiver: "NAV", sted: "Oslo", yrke: "Saksbehandler", ansattSelvstendig: "Selvstendig"},
    {key: "", land: "NO", type: "", startdato: new Date("01-01-2020"), sluttdato: new Date("12-12-2020"), usikreDatoer: "1", tillegsInfo: "JA", arbeidsgiver: "NAV", sted: "Oslo", yrke: "Saksbehandler", ansattSelvstendig: "Selvstendig"}
  ]

  const onBackClick = () => {
    setMode('bucedit', 'back')
  }

  const renderBackLink = () => (
    <div style={{ display: 'inline-block' }}>
      <Button
        variant='secondary'
        onClick={onBackClick}
      >
        <BackFilled />
        <HorizontalSeparatorDiv size='0.25' />
        <span>
          {t('ui:back')}
        </span>
      </Button>
    </div>
  )

  useEffect(() => {
    // select which P4000 SEDs we want to see
    const seds = buc.seds?.filter((sed: Sed) => sed.type === 'P4000' && sed.status === 'received')
    const sortedSeds = seds?.sort(dateSorter)
    if(sortedSeds && sortedSeds.length > 0){
      dispatch(getSedP4000(buc.caseId!, sortedSeds[0]))
    }

  }, [buc])

  const renderLand = ({ value }: RenderOptions<P4000ListRow, P4000TableContext, string>) => {
    if (_.isEmpty(value)) {
      return <div>-</div>
    }
    return <div>{countryInstance.findByValue(value)?.label}</div>
  }

  const renderType = ({ value }: RenderOptions<P4000ListRow, P4000TableContext, string>) => (
    <Tooltip
      label={(
        <div style={{ maxWidth: '300px' }}>
          {value ? _.get(typePeriode, value) : ''}
        </div>
      )}
    >
      <BodyLong>
        {value}
      </BodyLong>
    </Tooltip>
  )

  const renderDato = ({ value }: RenderOptions<P4000ListRow, P4000TableContext, string>) => (
    <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
  )


  let columns: Array<Column<P4000ListRow, P4000TableContext>> = [
    { id: 'land', label: t('ui:country'), type: 'string', render: renderLand},
    { id: 'type', label: t('ui:type'), type: 'string', align: 'center' as ColumnAlign, render: renderType},
    {
      id: 'startdato',
      label: t('ui:startDate'),
      type: 'date',
      render: renderDato
    },
    {
      id: 'sluttdato',
      label: t('ui:endDate'),
      type: 'date',
      render: renderDato
    },
    {
      id: 'usikreDatoer',
      label: t('ui:usikreDatoer'),
      type: 'string'
    },
    {
      id: 'tilleggsInfo',
      label: t('ui:tilleggsInfo'),
      type: 'string'
    },
    {
      id: 'arbeidsgiver',
      label: t('ui:arbeidsgiver'),
      type: 'string'
    },
    {
      id: 'sted',
      label: t('ui:sted'),
      type: 'string'
    },
    {
      id: 'yrke',
      label: t('ui:yrke'),
      type: 'string'
    },
    {
      id: 'ansattSelvstendig',
      label: t('ui:ansattSelvstendig'),
      type: 'string'
    },
  ]

  return (
    <div>
      <VerticalSeparatorDiv size='3' />
      {renderBackLink()}
      <VerticalSeparatorDiv size='2' />
      <Table<P4000ListRow, P4000TableContext>
        animatable={false}
        id='P4000Overview'
        searchable
        selectable={false}
        sortable
        onColumnSort={(sort: any) => {
          standardLogger('buc.edit.tools.P4000.overview.sort', { sort })
          _setTableSort(sort)
        }}
        itemsPerPage={30}
        items={items}
        columns={columns}
      />
    </div>
  )
}

export default P4000
