import {
  Alert,
  Box,
  Button,
  HelpText, HGrid, HStack, Label,
  Link,
  Loader,
  Radio,
  RadioGroup,
  Select as NavSelect, Spacer,
  VStack
} from '@navikt/ds-react'
import { resetSentP5000info, sendP5000toRina, setGjpBpWarning } from 'src/actions/p5000'
import {getGjpBp, getUFT, setGjpBp} from 'src/actions/person'
import { listItemtoPeriod } from 'src/applications/P5000/utils/conversionUtils'
import { ytelseType } from 'src/applications/P5000/P5000.labels'
import P5000HelpModal from 'src/applications/P5000/components/P5000HelpModal'
import Modal from 'src/components/Modal/Modal'
import Select from 'src/components/Select/Select'
import {OneLineSpan} from 'src/components/StyledComponents'
import * as constants from 'src/constants/constants'
import { LocalStorageEntry, Option, Validation } from 'src/declarations/app'
import { SakTypeMap, SakTypeValue } from 'src/declarations/buc.d'
import { P5000sFromRinaMap } from 'src/declarations/p5000.d'
import { P5000ListRow, P5000ListRows, P5000Period, P5000SED, P5000UpdatePayload } from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'src/metrics/loggers'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import dateDiff, { FormattedDateDiff } from 'src/utils/dateDiff'
import {GJENNY, VEDTAKSKONTEKST} from "src/constants/constants";
import {sendP5000toRinaGjenny} from "../../../actions/gjenny";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"
dayjs.extend(customParseFormat)

export interface P5000EditControlsSelector {
  gettingUft: boolean
  gjpbp: Date | null | undefined
  gjpbpwarning: any | undefined
  pesysContext: string
  sakType: SakTypeValue
  sentP5000info: any
  sendingP5000info: boolean
  uforetidspunkt: Date | null | undefined
  virkningstidspunkt: Date | null | undefined
  vedtakId: string | null | undefined
}

export interface P5000EditControlsProps {
  caseId: string
  onBackClick: () => void
  onSave: (payload: P5000UpdatePayload) => void
  ytelseOption: string | null
  setYtelseOption: (a: string) => void
  forsikringEllerBosetningsperioder: string | null | undefined
  setForsikringEllerBosetningsperioder: (a: string) => void
  itemsPerPage: number
  setItemsPerPage: (n: number) => void
  setRenderPrintTable: (b: boolean) => void
  resetValidation: (s ?: string) => void
  performValidation: (a: any) => boolean
  p5000sFromRinaMap: P5000sFromRinaMap
  p5000WorkingCopy: LocalStorageEntry<P5000SED> | undefined
  p5000changed: boolean
  validation: Validation
  items: P5000ListRows
  componentRef: any
  sedId: string
  editingRow: boolean
}

const mapState = (state: State): P5000EditControlsSelector => ({
  gettingUft: state.loading.gettingUft,
  gjpbp: state.person.gjpbp,
  gjpbpwarning: state.p5000.gjpbpwarning,
  pesysContext: state.app.pesysContext,
  sakType: state.app.params.sakType as SakTypeValue,
  sentP5000info: state.p5000.sentP5000info,
  sendingP5000info: state.loading.sendingP5000info,
  uforetidspunkt: state.person.uforetidspunkt,
  virkningstidspunkt: state.person.virkningstidspunkt,
  vedtakId: state.app.params.vedtakId
})

const P5000EditControls: React.FC<P5000EditControlsProps> = ({
  caseId,
  onBackClick,
  onSave,
  ytelseOption,
  setYtelseOption,
  forsikringEllerBosetningsperioder,
  setForsikringEllerBosetningsperioder,
  itemsPerPage,
  setItemsPerPage,
  setRenderPrintTable,
  resetValidation,
  performValidation,
  p5000sFromRinaMap,
  p5000WorkingCopy,
  p5000changed,
  items,
  validation,
  componentRef,
  sedId,
  editingRow = false
}: P5000EditControlsProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    sentP5000info, sendingP5000info, gettingUft, uforetidspunkt,
    virkningstidspunkt, gjpbp, gjpbpwarning, pesysContext, vedtakId, sakType
  }: P5000EditControlsSelector = useSelector<State, P5000EditControlsSelector>(mapState)
  const [_showModal, _setShowModal] = useState<boolean>(false)
  const [_showHelpModal, _setShowHelpModal] = useState<boolean>(false)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)

  const [requestingUFT, setRequestingUFT] = useState<boolean>(false)
  const [requestingGjpBp, setRequestingGjpBp] = useState<boolean>(false)

  const [_gjpBpType, setGjpBpType] = useState<string>("30")

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

  const modalClose = () => {
    resetP5000()
    _setShowModal(false)
    // modal leaves this class on body, stops scrolling. Hack to resume scrolling
    document.getElementById('root')?.classList.remove('ReactModal__Body__open')
  }

  const resetP5000 = () => {
    dispatch(resetSentP5000info())
  }

  const beforePrintOut = (): void => {
    _setPrintDialogOpen(true)
  }

  const prepareContent = (): void => {
    setRenderPrintTable(true)
    standardLogger('buc.view.tools.P5000.edit.print.button')
  }

  const afterPrintOut = (): void => {
    _setPrintDialogOpen(false)
    setRenderPrintTable(false)
  }

  const itemsPerPageChanged = (e: any): void => {
    setItemsPerPage(e.target.value === 'all' ? 9999 : parseInt(e.target.value, 10))
  }

  const _setYtelseOption = (o: unknown) => {
    resetValidation('P5000Edit-ytelse-select')
    setYtelseOption((o as Option)?.value)
    onSave({
      ytelseOption: (o as Option)?.value
    })
  }

  const _setForsikringEllerBosetningsperioder = (value: string | number | boolean) => {
    resetValidation('P5000Edit-forsikringEllerBosetningsperioder')
    setForsikringEllerBosetningsperioder('' + value)
    onSave({
      forsikringEllerBosetningsperioder: '' + value
    })
  }

  const hentUFT = () => {
    if (vedtakId) {
      setRequestingUFT(true)
      dispatch(getUFT(vedtakId))
    }
  }

  const hentGjpBp = () => {
    if (vedtakId && caseId) {
      setGjpBpWarning(undefined)
      setRequestingGjpBp(true)
      dispatch(getGjpBp(vedtakId, caseId))
    } else if (pesysContext === GJENNY){
      setGjpBpWarning(undefined)
      setRequestingGjpBp(true)
      dispatch(setGjpBp())
    }
  }

  const cleanPeriod = (period: P5000Period) => {
    delete period.options
  }

  const handleOverforTilRina = () => {
    let p5000template: P5000SED | undefined = p5000WorkingCopy?.content
    if (_.isUndefined(p5000template)) {
      p5000template = p5000sFromRinaMap[sedId]
    }
    const valid: boolean = performValidation({
      p5000sed: p5000template
    })

    if (valid) {
      const payload: P5000SED = _.cloneDeep(p5000template) as P5000SED
      payload.pensjon.medlemskapTotal?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        cleanPeriod(period)
        payload.pensjon.medlemskapTotal[i] = period
      })
      payload.pensjon.trygdetid?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        cleanPeriod(period)
        payload.pensjon.trygdetid[i] = period
      })
      payload.pensjon.medlemskapboarbeid.medlemskap?.forEach((p, i) => {
        const period = _.cloneDeep(p)
        cleanPeriod(period)
        payload.pensjon.medlemskapboarbeid.medlemskap[i] = period
      })
      if (window.confirm(t('buc:form-areYouSureSendToRina'))) {
        pesysContext !== GJENNY ? dispatch(sendP5000toRina(caseId, sedId, payload)) : dispatch(sendP5000toRinaGjenny(caseId, sedId, payload))
      }
    }
  }

  useEffect(() => {
    // if we got all 1 or 2 avdøds
    if (_.isDate(gjpbp) && requestingGjpBp) {
      setRequestingGjpBp(false)
      let newItems: P5000ListRows = _.cloneDeep(items)

      const sluttdato = dayjs(gjpbp).toDate()
      const startdato = dayjs(gjpbp).set('date', 1).toDate() // 'day' sets day of week. 'date' sets day of the month.

      const diff: FormattedDateDiff = dateDiff(startdato, sluttdato)

      if (diff.days <= 1 && diff.months === 0 && diff.years === 0) {
        dispatch(setGjpBpWarning({
          type: 'warning',
          message: t('message:warning-nododsfallPeriod')
        }))
        return
      }

      // we are adding a period from the 1st day of the month of that person's death, to the day before death
      // as in dødsfallet = 08.08.1978 => periode 01.08.1978 - 07.08.1978
      const fixedSluttdato = dayjs(gjpbp).subtract(1, 'd').toDate()

      // check if we do not have such period
      const foundPeriod = _.find(newItems, item => {
        return dayjs(item.startdato).isSame(startdato, 'day') &&
          dayjs(item.sluttdato).isSame(fixedSluttdato, 'day') &&
          item.type === '30'
      })

      if (!foundPeriod) {
        // I will use a random period as a template, to fill out stuff like land
        const newItemTemplate = _.sample(newItems) as P5000ListRow
        const newItem: P5000ListRow = {
          land: newItemTemplate?.land ?? null,
          beregning: newItemTemplate?.beregning ?? null,
          ordning: newItemTemplate?.ordning ?? null,
          ytelse: newItemTemplate?.ytelse ?? null,
          acronym: newItemTemplate?.acronym ?? null,
          type: _gjpBpType,
          startdato,
          sluttdato: fixedSluttdato,
          status: 'new',
          aar: '' + diff.years,
          mnd: '' + diff.months,
          dag: '' + diff.days,
          selected: true,
          flag: true,
          flagIkon: 'OMS/BP',
          key: '' // will be generated later
        } as P5000ListRow

        // converting new item to period, so I can get the generated key
        const p5000Period: P5000Period = listItemtoPeriod(newItem)
        newItem.key = p5000Period.options?.key!
        newItems = newItems.concat(newItem)
        onSave({
          items: newItems
        })
      }
    }
  }, [gjpbp, requestingGjpBp])

  useEffect(() => {
    if (_.isDate(uforetidspunkt) && _.isDate(virkningstidspunkt) && requestingUFT) {
      setRequestingUFT(false)
      let newItems: P5000ListRows = _.cloneDeep(items)
      newItems = newItems.map(item => {
        const newItem = _.cloneDeep(item)
        newItem.selected = dayjs(item.startdato).isSame(uforetidspunkt, 'day') || dayjs(item.startdato).isAfter(uforetidspunkt, 'day');

        newItem.flag = dayjs(item.startdato).isSame(uforetidspunkt, 'day')|| dayjs(item.startdato).isAfter(uforetidspunkt, 'day');

        return newItem
      })

      // check if we do not have such period
      const foundUforetidpunktPeriod = _.find(newItems, item => {
        return dayjs(item.startdato).isSame(uforetidspunkt, 'day') &&
          dayjs(item.sluttdato).isSame(dayjs(virkningstidspunkt).subtract(1, 'day'), 'day') && // compare sluttdato with today, but just year/month/day
          item.type === '41'
      })
      // check if we do not have such period
      const foundVirkningstidspunktPeriod = _.find(newItems, item => {
        return dayjs(item.startdato).isSame(virkningstidspunkt) &&
          dayjs(item.sluttdato).isSame(new Date(), 'day') && // compare sluttdato with today, but just year/month/day
          item.type === '50'
      })

      if (!foundUforetidpunktPeriod && !foundVirkningstidspunktPeriod) {
        const startdatoUforetidspunkt: Date = uforetidspunkt
        const sluttdatoUforetidspunkt: Date = dayjs(virkningstidspunkt).subtract(1, 'day').toDate()
        const diffUforetidspunkt: FormattedDateDiff = dateDiff(startdatoUforetidspunkt, sluttdatoUforetidspunkt)

        const startdatoVirkningstidspunkt: Date = virkningstidspunkt
        const sluttdatoVirkningstidspunkt: Date = new Date()
        const diffVirkningstidspunkt: FormattedDateDiff = dateDiff(startdatoVirkningstidspunkt, sluttdatoVirkningstidspunkt)
        // I will use a random period as a template, to fill out stuff like land
        const newItemTemplate = _.sample(newItems) as P5000ListRow

        const newItem1: P5000ListRow = {
          land: newItemTemplate?.land ?? null,
          beregning: newItemTemplate?.beregning ?? null,
          ordning: newItemTemplate?.ordning ?? null,
          ytelse: newItemTemplate?.ytelse ?? null,
          acronym: newItemTemplate?.acronym ?? null,
          type: '41',
          startdato: startdatoUforetidspunkt,
          sluttdato: sluttdatoUforetidspunkt,
          status: 'new',
          aar: '' + diffUforetidspunkt.years,
          mnd: '' + diffUforetidspunkt.months,
          dag: '' + diffUforetidspunkt.days,
          selected: true,
          flag: true,
          flagIkon: 'UFT',
          key: '' // will be generated later
        } as P5000ListRow

        const newItem2: P5000ListRow = {
          land: newItemTemplate?.land ?? null,
          beregning: newItemTemplate?.beregning ?? null,
          ordning: newItemTemplate?.ordning ?? null,
          ytelse: newItemTemplate?.ytelse ?? null,
          acronym: newItemTemplate?.acronym ?? null,
          type: '50',
          startdato: startdatoVirkningstidspunkt,
          sluttdato: sluttdatoVirkningstidspunkt,
          status: 'new',
          aar: '' + diffVirkningstidspunkt.years,
          mnd: '' + diffVirkningstidspunkt.months,
          dag: '' + diffVirkningstidspunkt.days,
          selected: true,
          flag: true,
          flagIkon: 'UFT',
          key: '' // will be generated later
        } as P5000ListRow

        // converting new item to period, so I can get the generated key
        const p5000Period1: P5000Period = listItemtoPeriod(newItem1)
        newItem1.key = p5000Period1.options?.key!
        newItems = newItems.concat(newItem1)

        const p5000Period2: P5000Period = listItemtoPeriod(newItem2)
        newItem2.key = p5000Period2.options?.key!
        newItems = newItems.concat(newItem2)

        onSave({
          items: newItems
        })
      }
    }
  }, [uforetidspunkt, virkningstidspunkt, requestingUFT])

  useEffect(() => {
    if (!_.isUndefined(sentP5000info) && !_showModal) {
      _setShowModal(true)
    }
  }, [sentP5000info, _showModal])

  return (
    <>
      <Modal
        open={_showModal}
        appElementId='p5000Edit'
        onModalClose={modalClose}
        modal={{
          modalContent: (
            <>
              {_.isNull(sentP5000info) && (
                <VStack
                  align="center"
                >
                  <Box paddingBlock="12 4">
                    <Alert variant='warning'>
                      {t('p5000:warning-failedP5000Sending')}
                    </Alert>
                  </Box>
                  <HStack
                    justify="space-between"
                  >
                    <Spacer />
                    <Button
                      variant='primary'
                      onClick={() => {
                        modalClose()
                      }}
                    >OK
                    </Button>
                    <Spacer />
                  </HStack>
                </VStack>
              )}
              {!_.isNil(sentP5000info) && (
              <VStack
                align="center"
              >
                  <Box paddingBlock="0 4">
                    <Alert variant='info'>
                      {t('p5000:warning-okP5000Sending', { caseId })}
                    </Alert>
                  </Box>
                  <HStack
                    justify="space-between"
                  >
                    <div />
                    <Button
                      variant='primary'
                      onClick={() => {
                        modalClose()
                        setTimeout(onBackClick, 200)
                      }}
                    >OK
                    </Button>
                    <div />
                  </HStack>
              </VStack>
              )}
            </>
          )
        }}
      />
      <P5000HelpModal
        open={_showHelpModal}
        onClose={() => _setShowHelpModal(false)}
      />
      <HStack
        paddingBlock="0 4"
      >
        <Spacer />
        <Alert
          variant='warning'
          style={{ width: '50%' }}
        >
          <HStack
            gap="2"
            align="center"
          >
            {t('p5000:warning-P5000Edit-instructions-li1')}
            <HelpText>
                {t('p5000:warning-P5000Edit-instructions-li1-help')}
            </HelpText>
          </HStack>
        </Alert>
        <Spacer />
      </HStack>
      <HGrid
        paddingBlock="0 4"
        columns={3}
        style={{ width: '100%' }}
      >
        <Select
          key={'ytelse' + ytelseOption}
          className='P5000Edit-ytelse-select'
          error={validation['P5000Edit-ytelse-select']?.feilmelding}
          id='P5000Edit-ytelse-select'
          label={t('p5000:4-1-title')}
          menuPortalTarget={document.body}
          options={ytelseOptions}
          onChange={_setYtelseOption}
          defaultValue={_.find(ytelseOptions, y => y.value === ytelseOption) ?? null}
          value={_.find(ytelseOptions, y => y.value === ytelseOption) ?? null}
        />
        <HStack
          paddingInline="6 0"
          align="start"
        >
          <RadioGroup
            value={forsikringEllerBosetningsperioder}
            error={validation['P5000Edit-forsikringEllerBosetningsperioder']?.feilmelding}
            id='P5000Edit-forsikringEllerBosetningsperioder'
            onChange={_setForsikringEllerBosetningsperioder}
            legend={(
              <HStack
                gap="4"
                align="center"
              >
                <OneLineSpan>
                  {t('p5000:4-2-title')}
                </OneLineSpan>
                <HelpText>
                    {t('p5000:help-1') + t('p5000:help-2')}
                </HelpText>
              </HStack>
            )}
          >
            <HStack
              gap="12"
              align="end"
            >
              <Radio value='1'>
                {t('ui:yes')}
              </Radio>
              <Radio value='0'>
                {t('ui:no')}
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>
        <HStack
          gap="4"
          align="end"
          justify="end"
        >
          <NavSelect
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
          </NavSelect>
          <Button
            variant='primary'
            disabled={sendingP5000info || editingRow || _.isNil(p5000WorkingCopy)}
            onClick={handleOverforTilRina}
          >
            {sendingP5000info && <Loader />}
            {sendingP5000info ? t('ui:sending') : t('buc:form-send-to-RINA')}
          </Button>
          <ReactToPrint
            documentTitle='P5000Sum'
            onAfterPrint={afterPrintOut}
            onBeforePrint={beforePrintOut}
            onBeforeGetContent={prepareContent}
            trigger={() => (
              <Button
                variant='secondary'
                disabled={_printDialogOpen}
              >
                {_printDialogOpen && <Loader />}
                {t('ui:print')}
              </Button>
            )}
            content={() => componentRef.current}
          />
        </HStack>
      </HGrid>
      <HStack
        paddingBlock="0 4"
        paddingInline="0 2"
        align="end"
        justify="end"
      >
        <Spacer />
        <div style={{ textAlign: 'end' }}>
          {p5000changed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <HStack gap="2"
              justify="end"
              >
                <span>
                  {t('p5000:saved-working-copy')}
                </span>
                  <Link style={{ display: 'inline-block' }} href='#' onClick={() => _setShowHelpModal(true)}>
                    {t('ui:hva-betyr-det')}
                  </Link>
              </HStack>
            </div>
          )}
        </div>
      </HStack>
      <HStack>
        <div>
          {sakType === SakTypeMap.UFOREP && pesysContext === constants.VEDTAKSKONTEKST && (
             <HStack
               gap="4"
               align="baseline"
             >
               <Button
                 variant='secondary'
                 disabled={gettingUft}
                 onClick={hentUFT}
               >
                 {gettingUft && <Loader />}
                 {gettingUft ? t('message:loading-uft') : t('p5000:hent-uft')}
               </Button>
               <HelpText placement='right'>
                   {t('p5000:help-uft')}
               </HelpText>
             </HStack>
          )}

          {(
            pesysContext === GJENNY ||
            ((sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP) && pesysContext === VEDTAKSKONTEKST)) &&
            (
            <VStack gap="2">
              <HStack
                gap="4"
                align="center"
              >
                <Label>{t('p5000:trygdetid-for-dødsfallsmåneden')}</Label>
                <HelpText placement='right'>
                  {t('p5000:help-gjpbp')}
                </HelpText>
              </HStack>
              <HStack
                gap="4"
                paddingBlock="0 4"
                align="center"
              >
                <Button
                  variant='secondary'
                  disabled={requestingGjpBp}
                  onClick={hentGjpBp}
                >
                  {requestingGjpBp && <Loader />}
                  {requestingGjpBp ? t('message:loading-gjpbp') : t('p5000:hent-gjpbp')}
                </Button>
                <RadioGroup legend="Type" hideLegend={true} value={_gjpBpType} onChange={setGjpBpType}>
                  <HStack gap="4">
                    <Radio value="30" checked={true}>{t('p5000:botid')}</Radio>
                    <Radio value="11">{t('p5000:arbeidsperioder')}</Radio>
                  </HStack>
                </RadioGroup>
              </HStack>
              {!_.isNil(gjpbpwarning) && (
                <Box paddingBlock="0 4">
                  <Alert variant={gjpbpwarning.type}>{gjpbpwarning.message}</Alert>
                </Box>
              )}
            </VStack>
          )}
        </div>
        <Spacer />
      </HStack>
    </>
  )
}

export default P5000EditControls
