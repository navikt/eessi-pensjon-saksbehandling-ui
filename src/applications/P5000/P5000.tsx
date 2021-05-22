import { getSed, resetSentP5000info } from 'actions/buc'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import WarningCircle from 'assets/icons/WarningCircle'
import Alert from 'components/Alert/Alert'
import { SeparatorSpan, SpinnerDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, BUCMode, FeatureToggles } from 'declarations/app'
import { Buc, Participant, Sed, SedContentMap, Seds } from 'declarations/buc'
import { ActiveSeds, EmptyPeriodsReport, SedSender } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import Flag from 'flagg-ikoner'
import CountryData from 'land-verktoy'
import _ from 'lodash'
import moment from 'moment'
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
import P5000Edit from './P5000Edit'
import P5000Overview from './P5000Overview'
import P5000Sum from './P5000Sum'

export interface P5000Props {
  buc: Buc
  context: 'edit' | 'overview'
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P5000Selector {
  highContrast: boolean
  locale: AllowedLocaleString
  sedOriginalContent: SedContentMap
  featureToggles: FeatureToggles
}

const mapState = (state: State): P5000Selector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  sedOriginalContent: state.buc.sedContent,
  featureToggles: state.app.featureToggles
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
    highContrast, locale, sedOriginalContent, featureToggles
  }: P5000Selector = useSelector<State, P5000Selector>(mapState)

  const [_activeSeds, setActiveSeds] = useState<ActiveSeds>( {})
  const [_fetchingP5000, setFetchingP5000] = useState<Seds | undefined>(undefined)
  const [_ready, setReady] = useState<boolean>(false)
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)

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

  const changeActiveSed = (sedId: string): void => {
    const newActiveSeds = _.cloneDeep(_activeSeds) as ActiveSeds
    newActiveSeds[sedId] = !_activeSeds[sedId]
    setActiveSeds(newActiveSeds)
  }

  const getSedSender = (sedId: string): SedSender | undefined => {
    const sed: Sed | undefined = _.find(_seds, { id: sedId })
    if (!sed) {
      return undefined
    }
    const sender: Participant | undefined = sed.participants?.find((participant: Participant) => participant.role === 'Sender')
    if (!sender) {
      return undefined
    }
    return {
      date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
      countryLabel: CountryData.getCountryInstance(locale).findByValue(sender.organisation.countryCode).label,
      country: sender.organisation.countryCode,
      institution: sender.organisation.name,
      acronym: sender.organisation.acronym || '-'
    }
  }

  const sedSender: SedSender | undefined = sed ? getSedSender(sed!.id) as SedSender : undefined

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res[key] = sedOriginalContent[key]?.pensjon?.medlemskapAnnen?.length > 0
      }
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  // this effect checks if we need to load seds, when buc/sed/contect changes
  useEffect(() => {
    console.log('get P5000 as buc, sed or context changed')
    const seds = getP5000(buc, sed)
    _setSeds(seds)
    // which Seds we do NOT have on cache? Load them.
    const cachedSedIds: Array<string> = Object.keys(sedOriginalContent)
    const notloadedSeds: Seds = _.filter(seds, sed => cachedSedIds.indexOf(sed.id) < 0)
    console.log('notloadedSeds', notloadedSeds)
    if (!_.isEmpty(notloadedSeds)) {
      setReady(false)
      setFetchingP5000(notloadedSeds)
      notloadedSeds.forEach(sed => {
        console.log('fetching sed ', sed)
        dispatch(getSed(buc.caseId!, sed))
      })
    } else {
      console.log('nothing to load')
      setActiveSeds(_.mapValues(_.keyBy(seds, 'id'), () => true))
      setFetchingP5000(undefined)

      setReady(true)
    }
  }, [buc, sed, context])

  useEffect(() => {
    if (!_ready && _.isArray(_fetchingP5000)) {
      if (!_.isEmpty(_fetchingP5000)) {
        // update _fetchingP5000 with new cached info from sedOriginalContent
        const cachedSedIds = Object.keys(sedOriginalContent)
        const notloadedSeds: Seds = _.filter(_seds, sed => cachedSedIds.indexOf(sed.id) < 0)
        if (!_.isEmpty(notloadedSeds)) {
          setFetchingP5000(notloadedSeds)
        } else {
          setActiveSeds(_.mapValues(_.keyBy(_seds, 'id'), () => true))
          setFetchingP5000(undefined)
          setReady(true)
        }
      } else {
        setActiveSeds(_.mapValues(_.keyBy(_seds, 'id'), () => true))
        setFetchingP5000(undefined)
        setReady(true)
      }
    }
  }, [_fetchingP5000, sedOriginalContent])

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
        {context !== 'overview' ? sedSender && (
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
        ) : (
          <PileDiv>
            <UndertekstBold>
              {t('buc:p5000-active-seds')}:
            </UndertekstBold>
            <VerticalSeparatorDiv size='0.5' />
            {Object.keys(_activeSeds).map(sedId => {
              const sender: SedSender | undefined = getSedSender(sedId)
              return (
                <div key={sedId}>
                  <Checkbox
                    data-test-id={'a-buc-c-P5000overview__checkbox-' + sedId}
                    checked={_activeSeds[sedId]}
                    key={'a-buc-c-P5000overview__checkbox-' + sedId}
                    id={'a-buc-c-P5000overview__checkbox-' + sedId}
                    onChange={() => changeActiveSed(sedId)}
                    label={(
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
                          : sedId}
                        {emptyPeriodReport[sedId] && (
                          <>
                            <HorizontalSeparatorDiv size='0.5' />
                            <WarningCircle />
                          </>
                        )}
                      </FlexEndSpacedDiv>
                    )}
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
    <VerticalSeparatorDiv size='2'/>
      {featureToggles.P5000_SUMMER_VISIBLE && context !== 'overview'
        ? (
          <>
            <VerticalSeparatorDiv size='3' />
            {renderBackLink()}
            <VerticalSeparatorDiv size='2' />
            <Undertittel>
              {t('buc:p5000-edit-title')}
            </Undertittel>
            <VerticalSeparatorDiv/>
              <HighContrastPanel>
                <P5000Edit
                key={'P5000Edit-' + _seds!.map(s => s.id).join(',') + '-context-' + context}
                caseId={buc.caseId!}
                highContrast={highContrast}
                locale={locale}
                seds={_seds!}
                sedOriginalContent={sedOriginalContent}
              />
              </HighContrastPanel>
          </>
          )
        : (featureToggles.P5000_SUMMER_VISIBLE && (
          <Normaltekst>
            {t('buc:p5000-to-see-p5000edit')}
          </Normaltekst>
          ))
      }
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
              activeSeds={_activeSeds}
              getSedSender={getSedSender}
              highContrast={highContrast}
              key={'P5000Overview-' + _seds!.map(s => s.id).join(',') + '-context-' + context}
              sedOriginalContent={sedOriginalContent}
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
          <VerticalSeparatorDiv/>
           <HighContrastPanel>
             <P5000Sum
              activeSeds={_activeSeds}
              highContrast={highContrast}
              key={'P5000Sum' + _seds!.map(s => s.id).join(',') + 'sedOriginalContent' + Object.keys(sedOriginalContent).join(',')}
              sedOriginalContent={sedOriginalContent}
            />
           </HighContrastPanel>
        </>
      )}
    </div>
  )
}

export default P5000
