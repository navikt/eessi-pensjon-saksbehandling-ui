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
import Table, {Column, RenderOptions, Sort} from "@navikt/tabell";
import _ from "lodash";
import CountryData from "@navikt/land-verktoy";
import moment from "moment";
import {standardLogger} from "../../metrics/loggers";
import md5 from "md5";
import {
  P4000_ANDRE,
  P4000_ARBEID,
  P4000_BOTID, P4000_DAGPENGER,
  P4000_FOEDSELSPENGER,
  P4000_FRIVILLIG,
  P4000_MILITAERTJENESTE,
  P4000_OMSORG,
  P4000_OPPLAERING,
  P4000_SYKEPENGER
} from "../../constants/types";

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
  const [, _setTableSort] = useState<Sort>(() => ({ column: '', order: 'none' }))
  const {p4000}: P4000Selector = useSelector<State, P4000Selector>(mapState)

  const generateKeyForListRow = (periode: any, type: string, idx: number): string => {
    const key = idx + '_sedId' + p4000?.sedId +
      '_type' + type +
      '_land' + (type === "arbeid" ? periode.adresseFirma.land : periode.land) +
      '_fom' + (!_.isEmpty(periode.periode?.lukketPeriode?.fom) ? periode.periode?.lukketPeriode?.fom : '-') +
      '_tom' + (!_.isEmpty(periode.periode?.lukketPeriode?.tom) ? periode.periode?.lukketPeriode?.tom : '-')
    return md5(key)
  }


  const createP4000ListRows = (type: string, perioder: any) => {
    if(!perioder) return []
    return perioder.map((periode: any, idx: number) => {
      return {
        key: generateKeyForListRow(periode, type, idx),
        land: type === P4000_ARBEID ? periode.adresseFirma.land : periode.land,
        type: t('p4000:' + type + '-label'),
        startdato: periode.periode.lukketPeriode.fom ? new Date(periode.periode.lukketPeriode.fom) : null,
        sluttdato: periode.periode.lukketPeriode.tom ? new Date(periode.periode.lukketPeriode.tom) : null,
        usikreDatoer: periode.usikkerDatoIndikator ? periode.usikkerDatoIndikator === "0" ? "Nei" : "Ja" : null,
        tilleggsInfo: periode.annenInformasjon ? "Ja" : "Nei",
        arbeidsgiver: type === P4000_ARBEID ? periode.navnFirma : null,
        sted: type === P4000_ARBEID ? _.capitalize(periode.adresseFirma.by) : null,
        yrke: type === P4000_ARBEID ? periode.jobbUnderAnsattEllerSelvstendig : null,
        arbeidstakerSelvstendig: type === P4000_ARBEID ? periode.typePeriode === "01" ? "Arbeidstaker" : "Selvstendig" : null
      }
    })
  }

  const P4000TrygdetidPerioderToP4000ListRows = () => {
    let trygdetidListRows: P4000ListRows = []
    const trygdetid = p4000?.trygdetid
    const arbeidRows = trygdetid ? createP4000ListRows(P4000_ARBEID, trygdetid.ansattSelvstendigPerioder) : []
    const botidRows = trygdetid ? createP4000ListRows(P4000_BOTID, trygdetid.boPerioder) : []
    const omsorgRows = trygdetid ? createP4000ListRows(P4000_OMSORG, trygdetid.barnepassPerioder) : []
    const frivilligMedlemskapRows = trygdetid ? createP4000ListRows(P4000_FRIVILLIG, trygdetid.frivilligPerioder) : []
    const militaertjenesteRows = trygdetid ? createP4000ListRows(P4000_MILITAERTJENESTE, trygdetid.forsvartjenestePerioder) : []
    const foedselspengerRows = trygdetid ? createP4000ListRows(P4000_FOEDSELSPENGER, trygdetid.foedselspermisjonPerioder) : []
    const opplaeringRows = trygdetid ? createP4000ListRows(P4000_OPPLAERING, trygdetid.opplaeringPerioder) : []
    const dagpengerRows = trygdetid ? createP4000ListRows(P4000_DAGPENGER, trygdetid.arbeidsledigPerioder) : []
    const sykepengerRows = trygdetid ? createP4000ListRows(P4000_SYKEPENGER, trygdetid.sykePerioder) : []
    const andreRows = trygdetid ? createP4000ListRows(P4000_ANDRE, trygdetid.andrePerioder) : []

    return (trygdetidListRows as P4000ListRows).concat(
      arbeidRows as P4000ListRows,
      botidRows as P4000ListRows,
      omsorgRows as P4000ListRows,
      frivilligMedlemskapRows as P4000ListRows,
      militaertjenesteRows as P4000ListRows,
      foedselspengerRows as P4000ListRows,
      opplaeringRows as P4000ListRows,
      dagpengerRows as P4000ListRows,
      sykepengerRows as P4000ListRows,
      andreRows as P4000ListRows
    )
  }

  const items: P4000ListRows | undefined = P4000TrygdetidPerioderToP4000ListRows()

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



  const renderDato = ({ value }: RenderOptions<P4000ListRow, P4000TableContext, string>) => {
    return <BodyLong>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</BodyLong>
  }

  let columns: Array<Column<P4000ListRow, P4000TableContext>> = [
    {id: 'land', label: t('ui:country'), type: 'string', render: renderLand},
    {id: 'type', label: t('ui:type'), type: 'string'},
    {id: 'startdato', label: t('ui:startDate'), type: 'date', render: renderDato},
    {id: 'sluttdato', label: t('ui:endDate'), type: 'date', render: renderDato},
    {id: 'usikreDatoer', label: t('ui:usikreDatoer'), type: 'string'},
    {id: 'tilleggsInfo', label: t('ui:tilleggsInfo'), type: 'string'},
    {id: 'arbeidsgiver', label: t('ui:arbeidsgiver'), type: 'string'},
    {id: 'sted', label: t('ui:sted'), type: 'string'},
    {id: 'yrke', label: t('ui:yrke'), type: 'string'},
    {id: 'arbeidstakerSelvstendig', label: t('ui:arbeidstakerSelvstendig'), type: 'string'},
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
