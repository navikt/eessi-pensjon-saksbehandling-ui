import { getSed, resetSentP5000info, syncToP5000Storage, unsyncFromP5000Storage } from 'actions/p5000'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import WarningCircle from 'assets/icons/WarningCircle'
import Alert from 'components/Alert/Alert'
import { SeparatorSpan, SpinnerDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, BUCMode, FeatureToggles, LocalStorageEntry, LocalStorageValue } from 'declarations/app'
import { Buc, P5000FromRinaMap, Sed, Seds } from 'declarations/buc'
import { EmptyPeriodsReport, P5000Context, P5000SED, SedSender } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag from 'flagg-ikoner'
import _ from 'lodash'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Checkbox } from 'nav-frontend-skjema'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import {
  Column,
  FlexCenterDiv,
  FlexDiv,
  FlexEndSpacedDiv,
  HighContrastLink,
  HighContrastPanel,
  HorizontalSeparatorDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getSedSender } from './conversion'
import P5000Edit from './P5000Edit'
import P5000Overview from './P5000Overview'
import P5000Sum from './P5000Sum'

export interface P5000Props {
  buc: Buc
  context: P5000Context
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P5000Selector {
  featureToggles: FeatureToggles
  highContrast: boolean
  locale: AllowedLocaleString
  p5000FromRinaMap: P5000FromRinaMap
  p5000Storage: LocalStorageEntry<P5000SED> | undefined
}

const mapState = (state: State): P5000Selector => ({
  featureToggles: state.app.featureToggles,
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  p5000FromRinaMap: state.p5000.p5000FromRinaMap,
  p5000Storage: state.p5000.p5000Storage
})

const P5000: React.FC<P5000Props> = ({
  buc,
  context,
  sed = undefined,
  setMode
}: P5000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    featureToggles, highContrast, p5000FromRinaMap, p5000Storage
  }: P5000Selector = useSelector<State, P5000Selector>(mapState)

  const [_activeSeds, _setActiveSeds] = useState<Seds>([])
  const [_fetchingP5000, _setFetchingP5000] = useState<Seds | undefined>(undefined)
  const [_ready, _setReady] = useState<boolean>(false)
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)

  // use local storage stuff only in edit context, no need for overview context
  const p5000EntryFromStorage: LocalStorageValue | undefined = _.find(p5000Storage![buc.caseId!], { id: sed?.id })
  const p5000FromStorageVersion: number | undefined = p5000EntryFromStorage?.date
  const p5000FromStorage: P5000SED | undefined = p5000EntryFromStorage?.content

  const saveP5000ToStorage = (newSed: P5000SED, sedId: string): void => {
    dispatch(syncToP5000Storage(newSed, buc.caseId, sedId))
  }

  const removeP5000FromStorage = (sedId: string): void => {
    dispatch(unsyncFromP5000Storage(buc.caseId, sedId))
  }

  // select which P5000 SEDs we want to see
  const getP5000 = (buc: Buc, sed: Sed | undefined): Seds | undefined => {
    if (sed) {
      return [sed]
    }
    if (!buc.seds) {
      return undefined
    }
    return buc.seds
      .filter(sedFilter)
      .filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled')
  }

  const onBackClick = () => {
    dispatch(resetSentP5000info())
    setMode('bucedit', 'back')
  }

  const renderBackLink = () => (
    <div style={{ display: 'inline-block' }}>
      <HighContrastLink
        href='#'
        onClick={onBackClick}
      >
        <VenstreChevron />
        <HorizontalSeparatorDiv size='0.25' />
        <span>
          {t('ui:back')}
        </span>
      </HighContrastLink>
    </div>
  )

  const changeActiveSed = (sed: Sed, checked: boolean): void => {
    let newActiveSeds: Seds = _.cloneDeep(_activeSeds)
    if (checked) {
      newActiveSeds = newActiveSeds.concat(sed)
    } else {
      newActiveSeds = _.filter(newActiveSeds, s => s.id === sed.id)
    }
    _setActiveSeds(newActiveSeds)
  }

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    _activeSeds.forEach((sed: Sed) => {
      res[sed.id] = p5000FromRinaMap[sed.id]?.pensjon?.medlemskapAnnen?.length > 0
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const sedSender: SedSender | undefined = sed ? getSedSender(sed) as SedSender : undefined
  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  // this effect checks if we need to load seds, when buc/sed/contect changes
  useEffect(() => {
    console.log('get P5000 as buc, sed or context changed')
    const seds = getP5000(buc, sed)
    _setSeds(seds)
    // which Seds we do NOT have on cache? Load them.
    const cachedSedIds: Array<string> = Object.keys(p5000FromRinaMap)
    const notloadedSeds: Seds = _.filter(seds, sed => cachedSedIds.indexOf(sed.id) < 0)
    console.log('notloadedSeds', notloadedSeds)
    if (!_.isEmpty(notloadedSeds)) {
      _setReady(false)
      _setFetchingP5000(notloadedSeds)
      notloadedSeds.forEach(sed => {
        console.log('fetching sed ', sed)
        dispatch(getSed(buc.caseId!, sed))
      })
    } else {
      console.log('nothing to load')
      if (seds) {
        _setActiveSeds(seds)
      }
      _setFetchingP5000(undefined)
      _setReady(true)
    }
  }, [buc, sed, context])

  useEffect(() => {
    if (!_ready && _.isArray(_fetchingP5000)) {
      if (!_.isEmpty(_fetchingP5000)) {
        // update _fetchingP5000 with new cached info from p5000FromRinaMap
        const cachedSedIds = Object.keys(p5000FromRinaMap)
        const notloadedSeds: Seds = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) < 0)
        if (!_.isEmpty(notloadedSeds)) {
          _setFetchingP5000(notloadedSeds)
        } else {
          if (!_.isNil(_seds)) {
            _setActiveSeds(_seds)
          }
          _setFetchingP5000(undefined)
          _setReady(true)
        }
      } else {
        if (!_.isNil(_seds)) {
          _setActiveSeds(_seds)
        }
        _setFetchingP5000(undefined)
        _setReady(true)
      }
    }
  }, [_fetchingP5000, p5000FromRinaMap])

  if (!_ready) {
    return (
      <SpinnerDiv>
        <WaitingPanel />
      </SpinnerDiv>
    )
  }

  return (
    <div key={_seds?.map(s => s.id).join(',')}>
      <Row>
        <Column>
          {context !== 'overview'
            ? sedSender && (
              <FlexDiv>
                <>
                  <span>
                    {t('buc:form-dateP5000', { date: sedSender?.date })}
                  </span>
                  <SeparatorSpan>-</SeparatorSpan>
                  <FlexCenterDiv>
                    <Flag
                      country={sedSender?.country}
                      label={sedSender?.countryLabel}
                      size='XS'
                      type='circle'
                    />
                    <HorizontalSeparatorDiv size='0.2' />
                    <span>{sedSender?.countryLabel}</span>
                    <SeparatorSpan>-</SeparatorSpan>
                    <span>{sedSender?.institution}</span>
                  </FlexCenterDiv>
                </>
              </FlexDiv>
              )
            : (
              <PileDiv>
                <UndertekstBold>
                  {t('buc:p5000-active-seds')}:
                </UndertekstBold>
                <VerticalSeparatorDiv size='0.5' />
                {_seds?.map(sed => {
                  const sender: SedSender | undefined = getSedSender(sed)
                  const label: JSX.Element = (
                    <FlexEndSpacedDiv style={{ flexWrap: 'wrap' }}>
                      <span>
                        {t('buc:form-dateP5000', { date: sender?.date })}
                      </span>
                      <SeparatorSpan>-</SeparatorSpan>
                      {sender
                        ? (
                          <FlexCenterDiv>
                            <Flag
                              country={sender?.country}
                              label={sender?.countryLabel}
                              size='XS'
                              type='circle'
                            />
                            <HorizontalSeparatorDiv size='0.2' />
                            <span>{sender?.countryLabel}</span>
                            <SeparatorSpan>-</SeparatorSpan>
                            <span>{sender?.institution}</span>
                          </FlexCenterDiv>
                          )
                        : sed.id}
                      {emptyPeriodReport[sed.id] && (
                        <>
                          <HorizontalSeparatorDiv size='0.5' />
                          <WarningCircle />
                        </>
                      )}
                    </FlexEndSpacedDiv>
                  )
                  return (
                    <div key={sed.id}>
                      <Checkbox
                        data-test-id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                        checked={_.find(_activeSeds, s => s.id === sed.id) !== undefined}
                        key={'a-buc-c-P5000overview__checkbox-' + sed.id}
                        id={'a-buc-c-P5000overview__checkbox-' + sed.id}
                        onChange={(e) => changeActiveSed(sed, e.target.checked)}
                        label={label}
                      />
                      <VerticalSeparatorDiv size='0.5' />
                    </div>
                  )
                })}
              </PileDiv>
              )}
        </Column>
        <Column>
          {warning && (
            <Alert
              type='client'
              fixed={false}
              status='WARNING'
              message={t('buc:form-P5000-warning')}
            />
          )}
        </Column>
      </Row>
      <VerticalSeparatorDiv size='2' />
      {featureToggles.P5000_SUMMER_VISIBLE && context !== 'overview'
        ? (
          <>
            <VerticalSeparatorDiv size='3' />
            {renderBackLink()}
            <VerticalSeparatorDiv size='2' />
            <Undertittel>
              {t('buc:p5000-edit-title')}
            </Undertittel>
            <VerticalSeparatorDiv />
            <HighContrastPanel>
              <P5000Edit
                caseId={buc.caseId!}
                highContrast={highContrast}
                key={'P5000Edit-' + _activeSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorageVersion}
                p5000FromRinaMap={p5000FromRinaMap}
                p5000FromStorage={p5000FromStorage}
                saveP5000ToStorage={saveP5000ToStorage}
                removeP5000FromStorage={removeP5000FromStorage}
                seds={_activeSeds}
              />
            </HighContrastPanel>
          </>
          )
        : (featureToggles.P5000_SUMMER_VISIBLE && (
          <Normaltekst>
            {t('buc:p5000-to-see-p5000edit')}
          </Normaltekst>
          ))}
      <>
        <VerticalSeparatorDiv size='3' />
        {renderBackLink()}
        <VerticalSeparatorDiv size='2' />
        <Undertittel>
          {t('buc:p5000-overview-title')}
        </Undertittel>
        <VerticalSeparatorDiv />
        <HighContrastPanel>
          <P5000Overview
            context={context}
            highContrast={highContrast}
            key={'P5000Overview-' + _activeSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorageVersion}
            p5000FromRinaMap={p5000FromRinaMap}
            p5000FromStorage={p5000FromStorage}
            seds={_activeSeds}
          />
        </HighContrastPanel>
      </>
      {featureToggles.P5000_SUMMER_VISIBLE && (
        <>
          <VerticalSeparatorDiv size='3' />
          {renderBackLink()}
          <VerticalSeparatorDiv size='2' />
          <Undertittel>
            {t('buc:p5000-summary-title')}
          </Undertittel>
          <VerticalSeparatorDiv />
          <HighContrastPanel>
            <P5000Sum
              context={context}
              highContrast={highContrast}
              key={'P5000Sum' + _activeSeds!.map(s => s.id).join(',') + '-context-' + context + '-version-' + p5000FromStorageVersion}
              p5000FromRinaMap={p5000FromRinaMap}
              p5000FromStorage={p5000FromStorage}
              seds={_activeSeds}
            />
          </HighContrastPanel>
        </>
      )}
    </div>
  )
}

export default P5000
