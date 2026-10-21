import React, {JSX, useEffect, useRef, useState} from "react";
import {Alert, BodyShort, Box, Button, Checkbox, CheckboxGroup, HGrid, HStack, Heading, VStack} from "@navikt/ds-react";
import {MagnifyingGlassIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {createSelector} from "@reduxjs/toolkit";
import _ from "lodash";
import {useAppDispatch, useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import {MainFormProps} from "src/applications/MainForm";
import {YtelsePerMaaned, YtelserPerMaanedOption, YtelserPerMaanedResponse} from "src/declarations/p12000";
import {getYtelserPerMaaned, resetYtelserPerMaaned} from "src/actions/ytelserPerMaaned";
import {YTELSES_KOMPONENT_TYPER} from "src/constants/ytelsesKomponentTyper";
import useUnmount from "src/hooks/useUnmount";
import DateField from "src/components/Forms/DateField";
import {formatDate} from "src/utils/utils";
import styles from "src/assets/css/common.module.css";

export const YTTERLIGERE_INFORMASJON_TARGET = 'pensjon.ytterligereInformasjon'
export const YTTERLIGERE_INFORMASJON_MAX_LENGTH = 2500
export const YTELSER_PER_MAANED_SEPARATOR = '***********************'
export const YTELSER_PER_MAANED_OPTIONS_TARGET = 'options.ytelserPerMaaned'

interface YtelserPerMaanedSelector {
  sakId: string | null | undefined
  ytelserPerMaaned: YtelserPerMaanedResponse | null | undefined
  gettingYtelserPerMaaned: boolean
}

const mapState = createSelector(
  (state: State) => state.app.params.sakId,
  (state: State) => state.ytelserPerMaaned.ytelserPerMaaned,
  (state: State) => state.ytelserPerMaaned.gettingYtelserPerMaaned,
  (sakId, ytelserPerMaaned, gettingYtelserPerMaaned): YtelserPerMaanedSelector => ({
    sakId, ytelserPerMaaned, gettingYtelserPerMaaned
  })
)

interface Periode {
  fom: string
  tom: string
  error?: string
  // shown data: from a search result or restored from options
  ytelser?: Array<YtelsePerMaaned>
  selected: Array<string>
}

const TOM_PERIODE: Periode = {fom: '', tom: '', selected: []}

const allIndexes = (list: Array<unknown>): Array<string> => list.map((_item, idx) => '' + idx)

// Regular spaces as thousand separator, Intl uses non-breaking spaces
const formatBelop = (belop: number): string => new Intl.NumberFormat('nb-NO').format(belop).replace(/\s/g, ' ')

// Keeps saksbehandler's own text: anything after the separator is fritekst,
// a text without separator is treated as fritekst entirely (same idea as P8000)
export const extractFritekst = (ytterligereInformasjon: string | undefined): string => {
  if (!ytterligereInformasjon) return ''
  const idx = ytterligereInformasjon.indexOf(YTELSER_PER_MAANED_SEPARATOR)
  if (idx < 0) return ytterligereInformasjon.trim()
  return ytterligereInformasjon.substring(idx + YTELSER_PER_MAANED_SEPARATOR.length).trim()
}

export const extractGenerated = (ytterligereInformasjon: string | undefined): string => {
  if (!ytterligereInformasjon) return ''
  const idx = ytterligereInformasjon.indexOf(YTELSER_PER_MAANED_SEPARATOR)
  return idx < 0 ? '' : ytterligereInformasjon.substring(0, idx).trim()
}

export const composeYtterligereInformasjon = (generated: string, fritekst: string): string =>
  _.isEmpty(generated)
    ? fritekst
    : generated + '\n' + YTELSER_PER_MAANED_SEPARATOR + (fritekst ? '\n' + fritekst : '')

const YtelserPerMaaned: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const {sakId, ytelserPerMaaned, gettingYtelserPerMaaned} = useAppSelector(mapState)
  const namespace = `${parentNamespace}-ytelserpermaaned`

  const [_periode, setPeriode] = useState<Periode>(TOM_PERIODE)
  const handledResult = useRef<YtelserPerMaanedResponse | null | undefined>(undefined)
  // set by changes that should be written to Ytterligere informasjon once _periode is updated
  const syncRequested = useRef<boolean>(false)

  const ytelseHeader = (ytelse: YtelsePerMaaned): string => ytelse.tom
    ? t('p12000:ytelserpermaaned-tekst-periode', {fom: formatDate(ytelse.fom), tom: formatDate(ytelse.tom)})
    : t('p12000:ytelserpermaaned-tekst-periode-apen', {fom: formatDate(ytelse.fom)})

  const ytelseLinjer = (ytelse: YtelsePerMaaned): Array<string> => {
    return [
      ...ytelse.ytelseskomponenter.map((komponent) => '- ' + t('p12000:ytelserpermaaned-tekst-komponent', {
        type: YTELSES_KOMPONENT_TYPER[komponent.ytelsesKomponentType] ?? komponent.ytelsesKomponentType,
        belop: formatBelop(komponent.belopTilUtbetaling),
        interpolation: {escapeValue: false}
      })),
      t('p12000:ytelserpermaaned-tekst-sum', {belop: formatBelop(ytelse.belop), interpolation: {escapeValue: false}})
    ]
  }

  const updatePeriode = (values: Partial<Periode>, sync: boolean = false) => {
    setPeriode((periode) => ({...periode, ...values}))
    if (sync) syncRequested.current = true
  }

  useUnmount(() => {
    dispatch(resetYtelserPerMaaned())
  })

  // Restore period and selection from options
  useEffect(() => {
    const lagret: YtelserPerMaanedOption | undefined = _.get(PSED, YTELSER_PER_MAANED_OPTIONS_TARGET)
    if (lagret) {
      setPeriode({
        fom: lagret.fom,
        tom: lagret.tom ?? '',
        ytelser: lagret.ytelser,
        selected: lagret.selected.map((i) => '' + i)
      })
    }
  }, [])

  // Copy a new search result into the period, with everything selected
  useEffect(() => {
    if (!ytelserPerMaaned || handledResult.current === ytelserPerMaaned) return
    handledResult.current = ytelserPerMaaned
    updatePeriode({ytelser: ytelserPerMaaned, selected: allIndexes(ytelserPerMaaned)}, true)
  }, [ytelserPerMaaned])

  const currentYtterligereInformasjon: string | undefined = _.get(PSED, YTTERLIGERE_INFORMASJON_TARGET)
  const tooLong = (currentYtterligereInformasjon?.length ?? 0) > YTTERLIGERE_INFORMASJON_MAX_LENGTH

  // Write period to options and generated blocks (+ existing fritekst) to Ytterligere informasjon
  useEffect(() => {
    if (!syncRequested.current) return
    syncRequested.current = false

    const lagret: YtelserPerMaanedOption | undefined = _periode.ytelser
      ? {
          fom: _periode.fom,
          ...(_periode.tom ? {tom: _periode.tom} : {}),
          ytelser: _periode.ytelser,
          selected: _periode.selected.map(Number).sort((a, b) => a - b)
        }
      : undefined
    dispatch(updatePSED(YTELSER_PER_MAANED_OPTIONS_TARGET, lagret))

    const generatedText = (_periode.ytelser ?? [])
      .filter((_ytelse, idx) => _periode.selected.includes('' + idx))
      .map((ytelse) => [ytelseHeader(ytelse), ...ytelseLinjer(ytelse)].join('\n'))
      .join('\n\n')
    const newYtterligereInformasjon = composeYtterligereInformasjon(generatedText, extractFritekst(currentYtterligereInformasjon))
    if (newYtterligereInformasjon !== (currentYtterligereInformasjon ?? '')) {
      dispatch(updatePSED(YTTERLIGERE_INFORMASJON_TARGET, newYtterligereInformasjon))
    }
  }, [_periode])

  const onSearch = () => {
    if (_.isEmpty(_periode.fom)) {
      updatePeriode({error: t('p12000:ytelserpermaaned-mangler-fom')})
      return
    }
    if (!_.isEmpty(_periode.tom) && _periode.tom < _periode.fom) {
      updatePeriode({error: t('p12000:ytelserpermaaned-tom-for-fom')})
      return
    }
    updatePeriode({error: undefined, ytelser: undefined, selected: []}, true)
    dispatch(getYtelserPerMaaned(sakId!, _periode.fom, _.isEmpty(_periode.tom) ? undefined : _periode.tom))
  }

  const ytelser = _periode.ytelser

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="medium">{label}</Heading>
        <Heading size="small">{t('p12000:form-ytelserpermaaned-periode')}</Heading>
        <Box className={styles.boxWithBorderAndPadding}>
          <VStack gap="space-16">
            <HGrid columns={2} gap="space-16" align="start">
              <DateField
                error={undefined}
                namespace={namespace}
                id='fom'
                label={t('p12000:form-ytelserpermaaned-fom')}
                onChanged={(v: string) => updatePeriode({fom: v})}
                dateValue={_periode.fom}
              />
              <DateField
                error={undefined}
                namespace={namespace}
                id='tom'
                label={t('p12000:form-ytelserpermaaned-tom')}
                onChanged={(v: string) => updatePeriode({tom: v})}
                dateValue={_periode.tom}
              />
            </HGrid>
            <HStack>
              <Button
                variant="secondary"
                icon={<MagnifyingGlassIcon aria-hidden/>}
                loading={gettingYtelserPerMaaned}
                onClick={onSearch}
              >
                {t('p12000:form-ytelserpermaaned-sok')}
              </Button>
            </HStack>
            {_periode.error && <Alert variant="error" size="small">{_periode.error}</Alert>}
            {ytelserPerMaaned === null && <Alert variant="error" size="small">{t('p12000:ytelserpermaaned-feil')}</Alert>}
            {ytelser && _.isEmpty(ytelser) &&
              <BodyShort>{t('p12000:ytelserpermaaned-ingen-treff')}</BodyShort>
            }
            {ytelser && !_.isEmpty(ytelser) &&
              <CheckboxGroup
                legend={t('p12000:form-ytelserpermaaned-velg')}
                value={_periode.selected}
                onChange={(v: Array<string>) => updatePeriode({selected: v}, true)}
              >
                {ytelser.map((ytelse: YtelsePerMaaned, idx: number) => (
                  <Checkbox key={idx} value={'' + idx}>
                    <VStack as="span">
                      <span>{ytelseHeader(ytelse)}</span>
                      {ytelseLinjer(ytelse).map((linje, i) => <span key={i}>{linje}</span>)}
                    </VStack>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            }
          </VStack>
        </Box>
        {tooLong &&
          <Alert variant="warning" size="small">
            {t('p12000:ytelserpermaaned-for-lang', {length: currentYtterligereInformasjon?.length, max: YTTERLIGERE_INFORMASJON_MAX_LENGTH})}
          </Alert>
        }
      </VStack>
    </Box>
  )
}

export default YtelserPerMaaned
