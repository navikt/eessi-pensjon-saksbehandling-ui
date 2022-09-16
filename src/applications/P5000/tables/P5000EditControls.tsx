import { Alert, Button, HelpText, Link, Loader, Radio, RadioGroup, Select as NavSelect } from '@navikt/ds-react'
import {
  AlignEndRow,
  Column, FlexBaseDiv, FlexCenterDiv,
  FlexCenterSpacedDiv, FlexEndDiv,
  FullWidthDiv, HorizontalSeparatorDiv,
  PileCenterDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { resetSentP5000info, sendP5000toRina, setGjpBpWarning } from 'actions/p5000'
import { getGjpBp, getUFT } from 'actions/person'
import { listItemtoPeriod } from 'applications/P5000/utils/conversionUtils'
import { ytelseType } from 'applications/P5000/P5000.labels'
import P5000HelpModal from 'applications/P5000/components/P5000HelpModal'
import Modal from 'components/Modal/Modal'
import Select from 'components/Select/Select'
import { OneLineSpan } from 'components/StyledComponents'
import * as constants from 'constants/constants'
import { FeatureToggles, LocalStorageEntry, Option, Validation } from 'declarations/app'
import { SakTypeMap, SakTypeValue } from 'declarations/buc.d'
import { P5000sFromRinaMap } from 'declarations/p5000.d'
import { P5000ListRow, P5000ListRows, P5000Period, P5000SED, P5000UpdatePayload } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { standardLogger } from 'metrics/loggers'
import { extendMoment } from 'moment-range'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import dateDiff, { FormattedDateDiff } from 'utils/dateDiff'
import * as Moment from 'moment'
const moment = extendMoment(Moment)

export interface P5000EditControlsSelector {
  featureToggles: FeatureToggles
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
}

const mapState = (state: State): P5000EditControlsSelector => ({
  gettingUft: state.loading.gettingUft,
  featureToggles: state.app.featureToggles,
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
  sedId
}: P5000EditControlsProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    featureToggles, sentP5000info, sendingP5000info, gettingUft, uforetidspunkt,
    virkningstidspunkt, gjpbp, gjpbpwarning, pesysContext, vedtakId, sakType
  }: P5000EditControlsSelector = useSelector<State, P5000EditControlsSelector>(mapState)
  const [_showModal, _setShowModal] = useState<boolean>(false)
  const [_showHelpModal, _setShowHelpModal] = useState<boolean>(false)
  const [_printDialogOpen, _setPrintDialogOpen] = useState<boolean>(false)

  const [requestingUFT, setRequestingUFT] = useState<boolean>(false)
  const [requestingGjpBp, setRequestingGjpBp] = useState<boolean>(false)

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

  const modalClose = () => {
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
    standardLogger('buc.edit.tools.P5000.edit.print.button')
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
        dispatch(sendP5000toRina(caseId, sedId, payload))
      }
    }
  }

  useEffect(() => {
    // if we got all 1 or 2 avdøds
    if (_.isDate(gjpbp) && requestingGjpBp) {
      setRequestingGjpBp(false)
      let newItems: P5000ListRows = _.cloneDeep(items)

      const sluttdato = moment(gjpbp).toDate()
      const startdato = moment(gjpbp).set('date', 1).toDate() // 'day' sets day of week. 'date' sets day of the month.

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
      const fixedSluttdato = moment(gjpbp).subtract(1, 'd').toDate()

      // check if we do not have such period
      const foundPeriod = _.find(newItems, item => {
        return moment(item.startdato).isSame(startdato, 'day') &&
          moment(item.sluttdato).isSame(fixedSluttdato, 'day') &&
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
          type: '30',
          startdato,
          sluttdato: fixedSluttdato,
          status: 'new',
          aar: '' + diff.years,
          mnd: '' + diff.months,
          dag: '' + diff.days,
          selected: true,
          flag: true,
          flagIkon: 'GJP/BP',
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
        newItem.selected = moment(item.startdato).isSameOrAfter(uforetidspunkt)
        newItem.flag = moment(item.startdato).isSameOrAfter(uforetidspunkt)
        return newItem
      })

      // check if we do not have such period
      const foundUforetidpunktPeriod = _.find(newItems, item => {
        return moment(item.startdato).isSame(uforetidspunkt, 'day') &&
          moment(item.sluttdato).isSame(moment(virkningstidspunkt).subtract(1, 'day'), 'day') && // compare sluttdato with today, but just year/month/day
          item.type === '41'
      })
      // check if we do not have such period
      const foundVirkningstidspunktPeriod = _.find(newItems, item => {
        return moment(item.startdato).isSame(virkningstidspunkt) &&
          moment(item.sluttdato).isSame(new Date(), 'day') && // compare sluttdato with today, but just year/month/day
          item.type === '50'
      })

      if (!foundUforetidpunktPeriod && !foundVirkningstidspunktPeriod) {
        const startdatoUforetidspunkt: Date = uforetidspunkt
        const sluttdatoUforetidspunkt: Date = moment(virkningstidspunkt).subtract(1, 'day').toDate()
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
          closeButton: false,
          modalContent: (
            <div>
              {_.isNull(sentP5000info) && (
                <PileCenterDiv>
                  <VerticalSeparatorDiv size='3' />
                  <Alert variant='warning'>
                    {t('p5000:warning-failedP5000Sending')}
                  </Alert>
                  <VerticalSeparatorDiv />
                  <FlexCenterSpacedDiv>
                    <div />
                    <Button
                      variant='primary'
                      onClick={() => {
                        resetP5000()
                        modalClose()
                      }}
                    >OK
                    </Button>
                    <div />
                  </FlexCenterSpacedDiv>
                </PileCenterDiv>
              )}
              {!_.isNil(sentP5000info) && (
                <PileCenterDiv>
                  <Alert variant='info'>
                    {t('p5000:warning-okP5000Sending', { caseId })}
                  </Alert>
                  <VerticalSeparatorDiv />
                  <FlexCenterSpacedDiv>
                    <div />
                    <Button
                      variant='primary'
                      onClick={() => {
                        resetP5000()
                        modalClose()
                        setTimeout(onBackClick, 200)
                      }}
                    >OK
                    </Button>
                    <div />
                  </FlexCenterSpacedDiv>
                </PileCenterDiv>
              )}
            </div>
          )
        }}
      />
      <P5000HelpModal
        open={_showHelpModal}
        onClose={() => _setShowHelpModal(false)}
      />
      <AlignEndRow style={{ width: '100%' }}>
        <Column />
        <Column flex='2'>
          <Alert variant='warning'>
            <FlexCenterDiv>
              {t('p5000:warning-P5000Edit-instructions-li1')}
              <HorizontalSeparatorDiv size='0.5' />
              <HelpText>
                  {t('p5000:warning-P5000Edit-instructions-li1-help')}
              </HelpText>
            </FlexCenterDiv>
          </Alert>
        </Column>
        <Column />
      </AlignEndRow>
      <VerticalSeparatorDiv />
      <AlignEndRow style={{ width: '100%' }}>
        <Column>
          <FullWidthDiv>
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
          </FullWidthDiv>
        </Column>
        <Column style={{ justifyContent: 'center' }}>
          <FlexCenterDiv>
            <RadioGroup
              value={forsikringEllerBosetningsperioder}
              error={validation['P5000Edit-forsikringEllerBosetningsperioder']?.feilmelding}
              id='P5000Edit-forsikringEllerBosetningsperioder'
              onChange={_setForsikringEllerBosetningsperioder}
              legend={(
                <FlexCenterDiv>
                  <OneLineSpan>
                    {t('p5000:4-2-title')}
                  </OneLineSpan>
                  <HorizontalSeparatorDiv />
                  <HelpText>
                      {t('p5000:help-1') + t('p5000:help-2')}
                  </HelpText>
                </FlexCenterDiv>
              )}
            >
              <FlexEndDiv>
                <Radio value='1'>
                  {t('ui:yes')}
                </Radio>
                <HorizontalSeparatorDiv size='3' />
                <Radio value='0'>
                  {t('ui:no')}
                </Radio>
              </FlexEndDiv>
            </RadioGroup>
          </FlexCenterDiv>
        </Column>
        <Column>
          <FlexEndDiv style={{ justifyContent: 'flex-end' }}>
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
            <HorizontalSeparatorDiv />
            <Button
              variant='primary'
              disabled={sendingP5000info}
              onClick={handleOverforTilRina}
            >
              {sendingP5000info && <Loader />}
              {sendingP5000info ? t('ui:sending') : t('buc:form-send-to-RINA')}
            </Button>
            <HorizontalSeparatorDiv />
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
          </FlexEndDiv>
        </Column>
      </AlignEndRow>
      <VerticalSeparatorDiv />
      <AlignEndRow style={{ width: '100%' }}>
        <Column />
        <Column style={{ textAlign: 'end' }}>
          {p5000changed && (
            <div style={{ whiteSpace: 'nowrap' }}>
              <span>
                {t('p5000:saved-working-copy')}
              </span>
              <HorizontalSeparatorDiv size='0.5' />
              <Link style={{ display: 'inline-block' }} href='#' onClick={() => _setShowHelpModal(true)}>
                {t('ui:hva-betyr-det')}
              </Link>
            </div>
          )}
        </Column>
      </AlignEndRow>
      <VerticalSeparatorDiv />
      <AlignEndRow style={{ width: '100%' }}>
        <Column>
          {featureToggles.P5000_UPDATES_VISIBLE &&
           featureToggles.UFT_BUTTON &&
           sakType === SakTypeMap.UFOREP && pesysContext === constants.VEDTAKSKONTEKST && (
             <FlexBaseDiv>
               <Button
                 variant='secondary'
                 disabled={gettingUft}
                 onClick={hentUFT}
               >
                 {gettingUft && <Loader />}
                 {gettingUft ? t('message:loading-uft') : t('p5000:hent-uft')}
               </Button>
               <HorizontalSeparatorDiv />
               <HelpText placement='right'>
                   {t('p5000:help-uft')}
               </HelpText>
             </FlexBaseDiv>
          )}
          {featureToggles.P5000_UPDATES_VISIBLE &&
            featureToggles.UFT_BUTTON &&
            (sakType === SakTypeMap.GJENLEV || sakType === SakTypeMap.BARNEP) &&
          pesysContext === constants.VEDTAKSKONTEKST && (
            <>
              <FlexBaseDiv>
                <Button
                  variant='secondary'
                  disabled={requestingGjpBp}
                  onClick={hentGjpBp}
                >
                  {requestingGjpBp && <Loader />}
                  {requestingGjpBp ? t('message:loading-gjpbp') : t('p5000:hent-gjpbp')}
                </Button>
                <HorizontalSeparatorDiv />
                <HelpText placement='right'>
                    {t('p5000:help-gjpbp')}
                </HelpText>
              </FlexBaseDiv>
              {!_.isNil(gjpbpwarning) && (
                <>
                  <VerticalSeparatorDiv />
                  <Alert variant={gjpbpwarning.type}>{gjpbpwarning.message}</Alert>
                </>
              )}
            </>
          )}
        </Column>
        <Column />
      </AlignEndRow>
    </>
  )
}

export default P5000EditControls
