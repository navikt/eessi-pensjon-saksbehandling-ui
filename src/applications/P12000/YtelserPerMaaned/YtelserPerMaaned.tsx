import React, {JSX, useEffect, useRef, useState} from "react";
import {Alert, BodyShort, Box, Button, Checkbox, CheckboxGroup, HGrid, HStack, Heading, Label, VStack} from "@navikt/ds-react";
import {MagnifyingGlassIcon, PlusCircleIcon, TrashIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {createSelector} from "@reduxjs/toolkit";
import _ from "lodash";
import {useAppDispatch, useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import {MainFormProps} from "src/applications/MainForm";
import {
  GjenopprettetYtelsePerMaaned,
  YtelsePerMaaned,
  YtelserPerMaanedPeriodeOption,
  YtelserPerMaanedResponse
} from "src/declarations/p12000";
import {getYtelserPerMaaned, removeYtelserPerMaaned, resetYtelserPerMaaned} from "src/actions/ytelserPerMaaned";
import {YTELSES_KOMPONENT_TYPER} from "src/constants/ytelsesKomponentTyper";
import useUnmount from "src/hooks/useUnmount";
import DateField from "src/components/Forms/DateField";
import {formatDate} from "src/utils/utils";
import styles from "src/assets/css/common.module.css";

export const YTTERLIGERE_INFORMASJON_TARGET = 'pensjon.ytterligereInformasjon'
export const YTTERLIGERE_INFORMASJON_MAX_LENGTH = 2500
export const YTELSER_PER_MAANED_SEPARATOR = '***********************'
export const YTELSER_PER_MAANED_OPTIONS_TARGET = 'options.ytelserPerMaaned'

type Ytelse = YtelsePerMaaned | GjenopprettetYtelsePerMaaned

interface YtelserPerMaanedSelector {
  sakId: string | null | undefined
  ytelserPerMaaned: Record<string, YtelserPerMaanedResponse | null | undefined>
  gettingYtelserPerMaaned: Record<string, boolean>
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
  id: string
  fom: string
  tom: string
  error?: string
  // shown data: from a search result, from options or (fallback) restored from Ytterligere informasjon
  ytelser?: Array<Ytelse>
  selected: Array<string>
}

const newPeriode = (values: Partial<Periode> = {}): Periode => ({
  id: _.uniqueId('ytelserpermaaned-periode-'),
  fom: '',
  tom: '',
  selected: [],
  ...values
})

const isGjenopprettet = (ytelse: Ytelse): ytelse is GjenopprettetYtelsePerMaaned => 'linjer' in ytelse

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

const toIsoDate = (date: string): string => {
  const [dd, mm, yyyy] = date.split('.')
  return `${yyyy}-${mm}-${dd}`
}

const headerRegExp = (template: string): RegExp => {
  const escaped = _.escapeRegExp(template)
    .replace('__FOM__', '(\\d{2}\\.\\d{2}\\.\\d{4})')
    .replace('__TOM__', '(\\d{2}\\.\\d{2}\\.\\d{4})')
  return new RegExp('^' + escaped + '$')
}

// Reverses the generated text: one block per ytelse header, followed by its lines (komponenter and sum)
export const parseGeneratedText = (
  ytterligereInformasjon: string | undefined,
  periodeTemplate: string,
  apenPeriodeTemplate: string
): Array<GjenopprettetYtelsePerMaaned> => {
  const generated = extractGenerated(ytterligereInformasjon)
  if (!generated) return []

  const closedRegExp = headerRegExp(periodeTemplate)
  const openRegExp = headerRegExp(apenPeriodeTemplate)
  const blocks: Array<GjenopprettetYtelsePerMaaned> = []

  generated.split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
    const closed = line.match(closedRegExp)
    if (closed) {
      blocks.push({fom: toIsoDate(closed[1]), tom: toIsoDate(closed[2]), linjer: []})
      return
    }
    const open = line.match(openRegExp)
    if (open) {
      blocks.push({fom: toIsoDate(open[1]), linjer: []})
      return
    }
    if (blocks.length > 0) {
      blocks[blocks.length - 1].linjer.push(line)
    }
  })
  return blocks
}

// Lines content up with the input of a labelled form field (label + 3rem input), regardless of text wrapping
const InputRow: React.FC<{children: React.ReactNode}> = ({children}) => (
  <VStack gap="space-8">
    <Label aria-hidden style={{visibility: 'hidden'}}>&nbsp;</Label>
    <HStack align="center" style={{minHeight: '3rem', whiteSpace: 'nowrap'}}>
      {children}
    </HStack>
  </VStack>
)

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

  const [_perioder, setPerioder] = useState<Array<Periode>>(() => [newPeriode()])
  const handledResults = useRef<Record<string, YtelserPerMaanedResponse>>({})
  // set by changes that should be written to Ytterligere informasjon once _perioder is updated
  const syncRequested = useRef<boolean>(false)

  const ytelseHeader = (ytelse: Ytelse): string => ytelse.tom
    ? t('p12000:ytelserpermaaned-tekst-periode', {fom: formatDate(ytelse.fom), tom: formatDate(ytelse.tom)})
    : t('p12000:ytelserpermaaned-tekst-periode-apen', {fom: formatDate(ytelse.fom)})

  const ytelseLinjer = (ytelse: Ytelse): Array<string> => {
    if (isGjenopprettet(ytelse)) return ytelse.linjer
    return [
      ...ytelse.ytelseskomponenter.map((komponent, idx) => (idx + 1) + ') ' + t('p12000:ytelserpermaaned-tekst-komponent', {
        type: YTELSES_KOMPONENT_TYPER[komponent.ytelsesKomponentType] ?? komponent.ytelsesKomponentType,
        belop: formatBelop(komponent.belopTilUtbetaling),
        interpolation: {escapeValue: false}
      })),
      t('p12000:ytelserpermaaned-tekst-sum', {belop: formatBelop(ytelse.belop), interpolation: {escapeValue: false}})
    ]
  }

  const updatePeriode = (id: string, values: Partial<Periode>, sync: boolean = false) => {
    setPerioder((perioder) => perioder.map((p) => p.id === id ? {...p, ...values} : p))
    if (sync) syncRequested.current = true
  }

  useUnmount(() => {
    dispatch(resetYtelserPerMaaned())
  })

  // Restore periods and selections from options, fallback to the generated text in Ytterligere informasjon
  useEffect(() => {
    const lagretPerioder: Array<YtelserPerMaanedPeriodeOption> | undefined = _.get(PSED, YTELSER_PER_MAANED_OPTIONS_TARGET + '.perioder')
    if (!_.isEmpty(lagretPerioder)) {
      setPerioder(lagretPerioder!.map((p) => newPeriode({
        fom: p.fom,
        tom: p.tom ?? '',
        ytelser: p.ytelser,
        selected: p.selected.map((i) => '' + i)
      })))
      return
    }

    const blocks = parseGeneratedText(
      _.get(PSED, YTTERLIGERE_INFORMASJON_TARGET),
      t('p12000:ytelserpermaaned-tekst-periode', {fom: '__FOM__', tom: '__TOM__'}),
      t('p12000:ytelserpermaaned-tekst-periode-apen', {fom: '__FOM__'})
    )
    if (_.isEmpty(blocks)) return
    // the searched periods are unknown here, so all restored ytelser are put in one period covering them
    setPerioder([newPeriode({
      fom: _.min(blocks.map((b) => b.fom))!,
      tom: blocks.some((b) => !b.tom) ? '' : _.max(blocks.map((b) => b.tom))!,
      ytelser: blocks,
      selected: allIndexes(blocks)
    })])
  }, [])

  // Copy a new search result into the period, with everything selected
  useEffect(() => {
    let changed = false
    const next = _perioder.map((p) => {
      const result = ytelserPerMaaned[p.id]
      if (!result || handledResults.current[p.id] === result) return p
      handledResults.current[p.id] = result
      changed = true
      return {...p, ytelser: result, selected: allIndexes(result)}
    })
    if (changed) {
      syncRequested.current = true
      setPerioder(next)
    }
  }, [ytelserPerMaaned, _perioder])

  const generateBlocks = (periode: Periode): Array<string> =>
    (periode.ytelser ?? [])
      .filter((_ytelse, idx) => periode.selected.includes('' + idx))
      .map((ytelse) => [ytelseHeader(ytelse), ...ytelseLinjer(ytelse)].join('\n'))

  const currentYtterligereInformasjon: string | undefined = _.get(PSED, YTTERLIGERE_INFORMASJON_TARGET)
  const tooLong = (currentYtterligereInformasjon?.length ?? 0) > YTTERLIGERE_INFORMASJON_MAX_LENGTH

  // Write periods to options and generated blocks (+ existing fritekst) to Ytterligere informasjon
  useEffect(() => {
    if (!syncRequested.current) return
    syncRequested.current = false

    const lagretPerioder: Array<YtelserPerMaanedPeriodeOption> = _perioder
      .filter((p) => !!p.ytelser)
      .map((p) => ({
        fom: p.fom,
        ...(p.tom ? {tom: p.tom} : {}),
        ytelser: p.ytelser!,
        selected: p.selected.map(Number).sort((a, b) => a - b)
      }))
    dispatch(updatePSED(YTELSER_PER_MAANED_OPTIONS_TARGET, _.isEmpty(lagretPerioder) ? undefined : {perioder: lagretPerioder}))

    const generatedText = _perioder.flatMap(generateBlocks).join('\n\n')
    const newYtterligereInformasjon = composeYtterligereInformasjon(generatedText, extractFritekst(currentYtterligereInformasjon))
    if (newYtterligereInformasjon !== (currentYtterligereInformasjon ?? '')) {
      dispatch(updatePSED(YTTERLIGERE_INFORMASJON_TARGET, newYtterligereInformasjon))
    }
  }, [_perioder])

  const onSearch = (periode: Periode) => {
    if (_.isEmpty(periode.fom)) {
      updatePeriode(periode.id, {error: t('p12000:ytelserpermaaned-mangler-fom')})
      return
    }
    if (!_.isEmpty(periode.tom) && periode.tom < periode.fom) {
      updatePeriode(periode.id, {error: t('p12000:ytelserpermaaned-tom-for-fom')})
      return
    }
    updatePeriode(periode.id, {error: undefined, ytelser: undefined, selected: []}, true)
    dispatch(getYtelserPerMaaned(periode.id, sakId!, periode.fom, _.isEmpty(periode.tom) ? undefined : periode.tom))
  }

  const onAddPeriode = () => {
    setPerioder((perioder) => [...perioder, newPeriode()])
  }

  const onRemovePeriode = (id: string) => {
    syncRequested.current = true
    setPerioder((perioder) => perioder.filter((p) => p.id !== id))
    delete handledResults.current[id]
    dispatch(removeYtelserPerMaaned(id))
  }

  const renderPeriode = (periode: Periode, index: number) => {
    const _namespace = namespace + '[' + index + ']'
    const ytelser = periode.ytelser
    return (
      <Box key={periode.id} className={styles.boxWithBorderAndPadding}>
        <VStack gap="space-16">
          <HGrid columns="1fr 1fr auto" gap="space-16" align="start">
            <DateField
              error={undefined}
              namespace={_namespace}
              id='fom'
              label={t('p12000:form-ytelserpermaaned-fom')}
              onChanged={(v: string) => updatePeriode(periode.id, {fom: v})}
              dateValue={periode.fom}
            />
            <DateField
              error={undefined}
              namespace={_namespace}
              id='tom'
              label={t('p12000:form-ytelserpermaaned-tom')}
              onChanged={(v: string) => updatePeriode(periode.id, {tom: v})}
              dateValue={periode.tom}
            />
            {_perioder.length > 1
              ? <InputRow>
                  <Button
                    variant="tertiary"
                    icon={<TrashIcon aria-hidden/>}
                    onClick={() => onRemovePeriode(periode.id)}
                  >
                    {t('p12000:form-ytelserpermaaned-fjernperiode')}
                  </Button>
                </InputRow>
              : <div/>
            }
          </HGrid>
          <HStack>
            <Button
              variant="secondary"
              icon={<MagnifyingGlassIcon aria-hidden/>}
              loading={!!gettingYtelserPerMaaned[periode.id]}
              onClick={() => onSearch(periode)}
            >
              {t('p12000:form-ytelserpermaaned-sok')}
            </Button>
          </HStack>
          {periode.error && <Alert variant="error" size="small">{periode.error}</Alert>}
          {ytelserPerMaaned[periode.id] === null && <Alert variant="error" size="small">{t('p12000:ytelserpermaaned-feil')}</Alert>}
          {ytelser && _.isEmpty(ytelser) &&
            <BodyShort>{t('p12000:ytelserpermaaned-ingen-treff')}</BodyShort>
          }
          {ytelser && !_.isEmpty(ytelser) &&
            <CheckboxGroup
              legend={t('p12000:form-ytelserpermaaned-velg')}
              value={periode.selected}
              onChange={(v: Array<string>) => updatePeriode(periode.id, {selected: v}, true)}
            >
              {ytelser.map((ytelse: Ytelse, idx: number) => (
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
    )
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="medium">{label}</Heading>
        <Heading size="small">{t('p12000:form-ytelserpermaaned-perioder')}</Heading>
        {_perioder.map(renderPeriode)}
        <HStack>
          <Button
            variant="tertiary"
            icon={<PlusCircleIcon aria-hidden/>}
            onClick={onAddPeriode}
          >
            {t('p12000:form-ytelserpermaaned-leggtilperiode')}
          </Button>
        </HStack>
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
