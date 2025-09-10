import {ChevronLeftIcon} from '@navikt/aksel-icons';
import {
  BodyLong,
  Box,
  Button,
  Heading,
  HStack,
  Loader,
  Select,
  SortState,
  VStack
} from '@navikt/ds-react'
import {BUCMode} from 'src/declarations/app'
import {Buc, Sed} from 'src/declarations/buc'
import React, {useEffect, useRef, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {getSedP4000} from "src/actions/buc";
import {
  P4000SED,
  P4000ListRow,
  P4000TableContext,
  P4000ListRows,
  P4000PeriodObject
} from "src/declarations/p4000";
import {State} from "src/declarations/reducers";
import Table, {Column, RenderOptions} from "@navikt/tabell";
import _ from "lodash";
import CountryData, {AllowedLocaleString} from "@navikt/land-verktoy";
import moment from "moment";
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
} from "src/constants/types";
import ReactToPrint from "react-to-print";
import WaitingPanel from "../../components/WaitingPanel/WaitingPanel";
import styled from "styled-components";
import {HiddenDiv} from "src/components/StyledComponents";
import styles from "src/assets/css/common.module.css";

export interface P4000Props {
  buc: Buc
  P4000?: Sed,
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P4000Selector {
  p4000: P4000SED | undefined
  locale: AllowedLocaleString
  gettingP4000: boolean
}

const mapState = (state: State): P4000Selector => ({
  p4000: state.buc.p4000,
  locale: state.ui.locale,
  gettingP4000: state.loading.gettingP4000
})

export const BottomAlignedHStack = styled(HStack)`
  align-items: end;
`

const P4000: React.FC<P4000Props> = ({
  buc,
  P4000,
  setMode
}: P4000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const componentRef = useRef(null)
  const countryInstance = CountryData.getCountryInstance('nb')
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)
  const [_tableSort, _setTableSort] = useState<SortState>(() => ({ orderBy: '', direction: 'none' }))
  const [itemsPerPage, setItemsPerPage] = useState<number>(30)
  const {p4000, locale, gettingP4000}: P4000Selector = useSelector<State, P4000Selector>(mapState)

  const sender = P4000?.participants.filter((p) => p.role === 'Sender')
  const organisation = sender && sender.length > 0 ? {
    name: sender[0].organisation.name,
    country: CountryData.getCountryInstance(locale).findByValue(sender[0].organisation.countryCode.toUpperCase()).label
  } : undefined

  const generateKeyForListRow = (periode: any, type: string, idx: number): string => {
    const key = idx + '_sedId' + p4000?.sedId +
      '_type' + type +
      '_land' + (type === P4000_ARBEID && periode.adresseFirma && periode.adresseFirma.land ? periode.adresseFirma.land : periode.land) +
      '_fom' + (!_.isEmpty(periode.periode?.lukketPeriode?.fom) ? periode.periode?.lukketPeriode?.fom : '-') +
      '_tom' + (!_.isEmpty(periode.periode?.lukketPeriode?.tom) ? periode.periode?.lukketPeriode?.tom : '-')
    return md5(key)
  }

  const getPeriodeDates = (periode: P4000PeriodObject) => {
    let fom: Date | String | undefined | null = t('p4000:ikke-angitt')
    let tom: Date | String | undefined | null = t('p4000:ikke-angitt')

    if(periode && periode.lukketPeriode) {
      fom = periode.lukketPeriode.fom ? new Date(periode.lukketPeriode.fom) : null
      tom = periode.lukketPeriode.tom ? new Date(periode.lukketPeriode.tom) : null
    } else if (periode && periode.openPeriode){
      fom = periode.openPeriode.fom ? new Date(periode.openPeriode.fom) : null
    }

    return {
      fom: fom,
      tom: tom
    }
  }

  const createP4000ListRows = (type: string, perioder: any) => {
    if(!perioder) return []
    return perioder.map((periode: any, idx: number) => {
      const {fom, tom} = getPeriodeDates(periode.periode)
      let land = periode.land
      let sted, yrke, arbeidstakerSelvstendig, arbeidsgiver
      if(type === P4000_ARBEID){
        land = periode.adresseFirma && periode.adresseFirma.land ? periode.adresseFirma.land : null
        sted = periode.adresseFirma && periode.adresseFirma.by ? _.capitalize(periode.adresseFirma.by) : t('p4000:ikke-angitt')
        yrke = periode.jobbUnderAnsattEllerSelvstendig ? periode.jobbUnderAnsattEllerSelvstendig : t('p4000:ikke-angitt')
        arbeidstakerSelvstendig = periode.typePeriode ? periode.typePeriode === "01" ? "Arbeidstaker" : "Selvstendig" : t('p4000:ikke-angitt')
        arbeidsgiver = periode.navnFirma ? periode.navnFirma : t('p4000:ikke-angitt')
      }
      return {
        key: generateKeyForListRow(periode, type, idx),
        land,
        type: t('p4000:' + type + '-label'),
        startdato: fom,
        sluttdato: tom,
        usikreDatoer: periode.usikkerDatoIndikator ? periode.usikkerDatoIndikator === "0" ? "Nei" : "Ja" : t('p4000:ikke-angitt'),
        tilleggsInfo: periode.annenInformasjon ? "Ja" : "Nei",
        arbeidsgiver,
        sted,
        yrke,
        arbeidstakerSelvstendig
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
        iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
      >
        <span>
          {t('ui:back')}
        </span>
      </Button>
    </div>
  )

  useEffect(() => {
    // select which P4000 SEDs we want to see
    if(P4000){
      dispatch(getSedP4000(buc.caseId!, P4000))
    }

  }, [P4000])

  const renderLand = ({ value }: RenderOptions<P4000ListRow, P4000TableContext, string>) => {
    if (_.isEmpty(value)) {
      return <div>{t('p4000:ikke-angitt')}</div>
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

  const itemsPerPageChanged = (e: any): void => {
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
  }


  return (
    <VStack gap="4">
      {renderBackLink()}
      <Box background="bg-default" padding="4">
        <Heading size='small'>
          {t('p4000:title', {ORGANISATION_NAME: organisation?.name, ORGANISATION_COUNTRY: organisation?.country})}
        </Heading>
        <BottomAlignedHStack gap="4" style={{ flexDirection: 'row-reverse'}}>
            <ReactToPrint
              documentTitle='P4000'
              onAfterPrint={afterPrintOut}
              onBeforePrint={beforePrintOut}
              trigger={() =>
                <Button
                  variant='secondary'
                  disabled={_printDialogOpen}
                >
                  {_printDialogOpen && <Loader />}
                  {t('ui:print')}
                </Button>}
              content={() => componentRef.current }
            />
          <Select
            id='itemsPerPage'
            label={t('ui:itemsPerPage')}
            onChange={itemsPerPageChanged}
            value={itemsPerPage === 9999 ? 'all' : '' + itemsPerPage}
          >
            <option value='10'>10</option>
            <option value='15'>15</option>
            <option value='20'>20</option>
            <option value='30'>30</option>
            <option value='50'>50</option>
            <option value='all'>{t('ui:all')}</option>
          </Select>
        </BottomAlignedHStack>
        {gettingP4000 &&
          <div className={styles.waitingPanel}>
            <WaitingPanel />
          </div>
        }
        {!gettingP4000 &&
          <Table<P4000ListRow, P4000TableContext>
            animatable={false}
            id='P4000Overview'
            searchable
            selectable={false}
            sortable
            onColumnSort={(sort: any) => {
              _setTableSort(sort)
            }}
            itemsPerPage={itemsPerPage}
            items={items}
            columns={columns}
          />
        }
      </Box>
      <HiddenDiv>
        <div ref={componentRef} id='printJS-form'>
          <Table<P4000ListRow, P4000TableContext>
            // important so it re-renders when sorting changes
            key={JSON.stringify(_tableSort)}
            className='print-version'
            items={items}
            id='P4000-print'
            animatable={false}
            searchable={false}
            selectable={false}
            sortable
            sort={_tableSort}
            itemsPerPage={9999}
            columns={columns}
          />
        </div>
      </HiddenDiv>
    </VStack>
  )
}

export default P4000
