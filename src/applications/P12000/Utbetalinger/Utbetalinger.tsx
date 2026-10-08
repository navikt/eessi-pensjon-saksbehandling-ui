import React, {JSX, useEffect, useRef, useState} from "react";
import {Alert, BodyShort, Box, Button, Checkbox, CheckboxGroup, HGrid, HStack, Heading, Label, VStack} from "@navikt/ds-react";
import {MagnifyingGlassIcon, PlusCircleIcon, TrashIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {createSelector} from "@reduxjs/toolkit";
import _ from "lodash";
import {useAppDispatch, useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import {MainFormProps} from "src/applications/MainForm";
import {UtbetalingerItem, UtbetalingerPeriodeOption, UtbetalingerResponse} from "src/declarations/p12000";
import {getUtbetalinger, removeUtbetalinger, resetUtbetalinger} from "src/actions/utbetalinger";
import useUnmount from "src/hooks/useUnmount";
import DateField from "src/components/Forms/DateField";
import {formatDate} from "src/utils/utils";
import styles from "src/assets/css/common.module.css";

export const YTTERLIGERE_INFORMASJON_TARGET = 'pensjon.ytterligereInformasjon'
export const YTTERLIGERE_INFORMASJON_MAX_LENGTH = 2500
export const UTBETALINGER_SEPARATOR = '***********************'
export const UTBETALINGER_OPTIONS_TARGET = 'options.utbetalinger'

interface UtbetalingerSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  utbetalinger: Record<string, UtbetalingerResponse | null | undefined>
  gettingUtbetalinger: Record<string, boolean>
}

const mapState = createSelector(
  (state: State) => state.app.params.aktoerId,
  (state: State) => state.app.params.sakId,
  (state: State) => state.utbetalinger.utbetalinger,
  (state: State) => state.utbetalinger.gettingUtbetalinger,
  (aktoerId, sakId, utbetalinger, gettingUtbetalinger): UtbetalingerSelector => ({
    aktoerId, sakId, utbetalinger, gettingUtbetalinger
  })
)

interface Periode {
  id: string
  fom: string
  tom: string
  error?: string
  // shown data: from a search result, from options or (fallback) restored from Ytterligere informasjon
  resultat?: {
    fom: string
    tom?: string
    items: Array<UtbetalingerItem | string>
  }
  selected: Array<string>
}

const newPeriode = (values: Partial<Periode> = {}): Periode => ({
  id: _.uniqueId('utbetalinger-periode-'),
  fom: '',
  tom: '',
  selected: [],
  ...values
})

// Keeps saksbehandler's own text: anything after the separator is fritekst,
// a text without separator is treated as fritekst entirely (same idea as P8000)
export const extractFritekst = (ytterligereInformasjon: string | undefined): string => {
  if (!ytterligereInformasjon) return ''
  const idx = ytterligereInformasjon.indexOf(UTBETALINGER_SEPARATOR)
  if (idx < 0) return ytterligereInformasjon.trim()
  return ytterligereInformasjon.substring(idx + UTBETALINGER_SEPARATOR.length).trim()
}

export const extractGenerated = (ytterligereInformasjon: string | undefined): string => {
  if (!ytterligereInformasjon) return ''
  const idx = ytterligereInformasjon.indexOf(UTBETALINGER_SEPARATOR)
  return idx < 0 ? '' : ytterligereInformasjon.substring(0, idx).trim()
}

export const composeYtterligereInformasjon = (generated: string, fritekst: string): string =>
  _.isEmpty(generated)
    ? fritekst
    : generated + '\n' + UTBETALINGER_SEPARATOR + (fritekst ? '\n' + fritekst : '')

export interface ParsedUtbetalingerBlock {
  fom: string
  tom?: string
  items: Array<string>
}

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

// Reverses the generated text: one block per period header, followed by its numbered item lines
export const parseGeneratedText = (
  ytterligereInformasjon: string | undefined,
  periodeTemplate: string,
  apenPeriodeTemplate: string
): Array<ParsedUtbetalingerBlock> => {
  if (!ytterligereInformasjon) return []
  const idx = ytterligereInformasjon.indexOf(UTBETALINGER_SEPARATOR)
  if (idx < 0) return []

  const closedRegExp = headerRegExp(periodeTemplate)
  const openRegExp = headerRegExp(apenPeriodeTemplate)
  const blocks: Array<ParsedUtbetalingerBlock> = []

  ytterligereInformasjon.substring(0, idx).split('\n').map((l) => l.trim()).filter(Boolean).forEach((line) => {
    const closed = line.match(closedRegExp)
    if (closed) {
      blocks.push({fom: toIsoDate(closed[1]), tom: toIsoDate(closed[2]), items: []})
      return
    }
    const open = line.match(openRegExp)
    if (open) {
      blocks.push({fom: toIsoDate(open[1]), items: []})
      return
    }
    const item = line.match(/^\d+\)\s*(.*)$/)?.[1]
    if (item && blocks.length > 0) {
      blocks[blocks.length - 1].items.push(item)
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

const Utbetalinger: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const {aktoerId, sakId, utbetalinger, gettingUtbetalinger} = useAppSelector(mapState)
  const namespace = `${parentNamespace}-utbetalinger`

  const [_perioder, setPerioder] = useState<Array<Periode>>(() => [newPeriode()])
  const handledResults = useRef<Record<string, UtbetalingerResponse>>({})
  // set by changes that should be written to Ytterligere informasjon once _perioder is updated
  const syncRequested = useRef<boolean>(false)

  const formatItem = (item: UtbetalingerItem): string => t('p12000:utbetalinger-tekst-item', {
    type: t('p12000:utbetalinger-type-' + item.type, {defaultValue: item.type}),
    belop: new Intl.NumberFormat('nb-NO').format(item.belop),
    valuta: item.valuta,
    utbetalingshyppighet: t('p12000:utbetalinger-utbetalingshyppighet-' + item.utbetalingshyppighet, {defaultValue: item.utbetalingshyppighet}),
    interpolation: {escapeValue: false}
  })

  const itemLabel = (item: UtbetalingerItem | string): string => _.isString(item) ? item : formatItem(item)

  const updatePeriode = (id: string, values: Partial<Periode>, sync: boolean = false) => {
    setPerioder((perioder) => perioder.map((p) => p.id === id ? {...p, ...values} : p))
    if (sync) syncRequested.current = true
  }

  useUnmount(() => {
    dispatch(resetUtbetalinger())
  })

  // Restore periods and selections from options, fallback to the generated text in Ytterligere informasjon
  useEffect(() => {
    const lagretPerioder: Array<UtbetalingerPeriodeOption> | undefined = _.get(PSED, UTBETALINGER_OPTIONS_TARGET + '.perioder')
    if (!_.isEmpty(lagretPerioder)) {
      setPerioder(lagretPerioder!.map((p) => newPeriode({
        fom: p.fom,
        tom: p.tom ?? '',
        resultat: {fom: p.fom, tom: p.tom, items: p.items},
        selected: p.selected.map((i) => '' + i)
      })))
      return
    }

    const blocks = parseGeneratedText(
      _.get(PSED, YTTERLIGERE_INFORMASJON_TARGET),
      t('p12000:utbetalinger-tekst-periode', {fom: '__FOM__', tom: '__TOM__'}),
      t('p12000:utbetalinger-tekst-periode-apen', {fom: '__FOM__'})
    )
    if (_.isEmpty(blocks)) return
    setPerioder(blocks.map((b) => newPeriode({
      fom: b.fom,
      tom: b.tom ?? '',
      resultat: b,
      selected: b.items.map((_item, idx) => '' + idx)
    })))
  }, [])

  // Copy a new search result into the period, with everything selected
  useEffect(() => {
    let changed = false
    const next = _perioder.map((p) => {
      const result = utbetalinger[p.id]
      if (!result || handledResults.current[p.id] === result) return p
      handledResults.current[p.id] = result
      changed = true
      return {
        ...p,
        resultat: {fom: result.periode?.fom ?? p.fom, tom: result.periode?.tom, items: result.info},
        selected: result.info.map((_item, idx) => '' + idx)
      }
    })
    if (changed) {
      syncRequested.current = true
      setPerioder(next)
    }
  }, [utbetalinger, _perioder])

  const generateBlock = (periode: Periode): string | undefined => {
    const resultat = periode.resultat
    if (!resultat || _.isEmpty(periode.selected)) return undefined
    const items = resultat.items.filter((_item, idx) => periode.selected.includes('' + idx))
    const header = resultat.tom
      ? t('p12000:utbetalinger-tekst-periode', {fom: formatDate(resultat.fom), tom: formatDate(resultat.tom)})
      : t('p12000:utbetalinger-tekst-periode-apen', {fom: formatDate(resultat.fom)})
    return [header, ...items.map((item, idx) => (idx + 1) + ') ' + itemLabel(item))].join('\n')
  }

  const currentYtterligereInformasjon: string | undefined = _.get(PSED, YTTERLIGERE_INFORMASJON_TARGET)
  const tooLong = (currentYtterligereInformasjon?.length ?? 0) > YTTERLIGERE_INFORMASJON_MAX_LENGTH

  // Write periods to options and generated blocks (+ existing fritekst) to Ytterligere informasjon
  useEffect(() => {
    if (!syncRequested.current) return
    syncRequested.current = false

    const lagretPerioder: Array<UtbetalingerPeriodeOption> = _perioder
      .filter((p) => !!p.resultat)
      .map((p) => ({
        fom: p.resultat!.fom,
        ...(p.resultat!.tom ? {tom: p.resultat!.tom} : {}),
        items: p.resultat!.items,
        selected: p.selected.map(Number).sort((a, b) => a - b)
      }))
    dispatch(updatePSED(UTBETALINGER_OPTIONS_TARGET, _.isEmpty(lagretPerioder) ? undefined : {perioder: lagretPerioder}))

    const generatedText = _.compact(_perioder.map(generateBlock)).join('\n\n')
    const newYtterligereInformasjon = composeYtterligereInformasjon(generatedText, extractFritekst(currentYtterligereInformasjon))
    if (newYtterligereInformasjon !== (currentYtterligereInformasjon ?? '')) {
      dispatch(updatePSED(YTTERLIGERE_INFORMASJON_TARGET, newYtterligereInformasjon))
    }
  }, [_perioder])

  const onSearch = (periode: Periode) => {
    if (_.isEmpty(periode.fom)) {
      updatePeriode(periode.id, {error: t('p12000:utbetalinger-mangler-fom')})
      return
    }
    if (!_.isEmpty(periode.tom) && periode.tom < periode.fom) {
      updatePeriode(periode.id, {error: t('p12000:utbetalinger-tom-for-fom')})
      return
    }
    updatePeriode(periode.id, {error: undefined, resultat: undefined, selected: []}, true)
    dispatch(getUtbetalinger(periode.id, aktoerId!, sakId!, periode.fom, _.isEmpty(periode.tom) ? undefined : periode.tom))
  }

  const onAddPeriode = () => {
    setPerioder((perioder) => [...perioder, newPeriode()])
  }

  const onRemovePeriode = (id: string) => {
    syncRequested.current = true
    setPerioder((perioder) => perioder.filter((p) => p.id !== id))
    delete handledResults.current[id]
    dispatch(removeUtbetalinger(id))
  }

  const renderPeriode = (periode: Periode, index: number) => {
    const _namespace = namespace + '[' + index + ']'
    const result = utbetalinger[periode.id]
    const items = periode.resultat?.items
    return (
      <Box key={periode.id} className={styles.boxWithBorderAndPadding}>
        <VStack gap="space-16">
          <HGrid columns="1fr 1fr auto" gap="space-16" align="start">
            <DateField
              error={undefined}
              namespace={_namespace}
              id='fom'
              label={t('p12000:form-utbetalinger-fom')}
              onChanged={(v: string) => updatePeriode(periode.id, {fom: v})}
              dateValue={periode.fom}
            />
            <DateField
              error={undefined}
              namespace={_namespace}
              id='tom'
              label={t('p12000:form-utbetalinger-tom')}
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
                    {t('p12000:form-utbetalinger-fjernperiode')}
                  </Button>
                </InputRow>
              : <div/>
            }
          </HGrid>
          <HStack>
            <Button
              variant="secondary"
              icon={<MagnifyingGlassIcon aria-hidden/>}
              loading={!!gettingUtbetalinger[periode.id]}
              onClick={() => onSearch(periode)}
            >
              {t('p12000:form-utbetalinger-sok')}
            </Button>
          </HStack>
          {periode.error && <Alert variant="error" size="small">{periode.error}</Alert>}
          {result === null && <Alert variant="error" size="small">{t('p12000:utbetalinger-feil')}</Alert>}
          {items && _.isEmpty(items) &&
            <BodyShort>{t('p12000:utbetalinger-ingen-treff')}</BodyShort>
          }
          {items && !_.isEmpty(items) &&
            <CheckboxGroup
              legend={t('p12000:form-utbetalinger-velg')}
              value={periode.selected}
              onChange={(v: Array<string>) => updatePeriode(periode.id, {selected: v}, true)}
            >
              {items.map((item: UtbetalingerItem | string, idx: number) => (
                <Checkbox key={idx} value={'' + idx}>
                  {itemLabel(item)}
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
        <Heading size="small">{t('p12000:form-utbetalinger-perioder')}</Heading>
        {_perioder.map(renderPeriode)}
        <HStack>
          <Button
            variant="tertiary"
            icon={<PlusCircleIcon aria-hidden/>}
            onClick={onAddPeriode}
          >
            {t('p12000:form-utbetalinger-leggtilperiode')}
          </Button>
        </HStack>
        {tooLong &&
          <Alert variant="warning" size="small">
            {t('p12000:utbetalinger-for-lang', {length: currentYtterligereInformasjon?.length, max: YTTERLIGERE_INFORMASJON_MAX_LENGTH})}
          </Alert>
        }
      </VStack>
    </Box>
  )
}

export default Utbetalinger
