import { getSed, resetSentP5000info } from 'actions/buc'
import { BUCMode } from 'applications/BUC'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import WarningCircle from 'assets/icons/WarningCircle'
import Alert from 'components/Alert/Alert'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import { SeparatorSpan, SpinnerDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString, FeatureToggles, LocalStorageEntry, P5000EditLocalStorageContent } from 'declarations/app'
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
  FlexEndSpacedDiv,
  HighContrastLink,
  HorizontalSeparatorDiv,
  PileDiv,
  Row,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import SEDP5000Edit from './SEDP5000Edit'
import SEDP5000Overview from './SEDP5000Overview'
import SEDP5000Sum from './SEDP5000Sum'

export interface SEDP5000Props {
  buc: Buc
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  sed?: Sed,
  seeOversikt?: boolean
  seeSummer?: boolean
  seeEdit?: boolean
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  setP5000Storage: any
  fromStorage?: any
}

export interface SEDP5000Selector {
  highContrast: boolean
  locale: AllowedLocaleString
  sedContent: SedContentMap
  featureToggles: FeatureToggles
}

const mapState = (state: State): SEDP5000Selector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  sedContent: state.buc.sedContent,
  featureToggles: state.app.featureToggles
})

const SEDP5000: React.FC<SEDP5000Props> = ({
  buc,
  fromStorage = undefined,
  p5000Storage,
  sed = undefined,
  seeOversikt = true,
  seeSummer = true,
  seeEdit = true,
  setMode,
  setP5000Storage
}: SEDP5000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    highContrast, locale, sedContent, featureToggles
  }: SEDP5000Selector = useSelector<State, SEDP5000Selector>(mapState)

  const [_fetchingP5000, setFetchingP5000] = useState<Seds | undefined>(undefined)
  const [_ready, setReady] = useState<boolean>(false)
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)
  const [_activeSeds, setActiveSeds] = useState<ActiveSeds>( {})
  const [_buc, _setBuc] = useState<Buc>(buc)
  const [_sed, _setSed] = useState<Sed | undefined>(sed)

  const getP5000 = (buc: Buc, sed: Sed | undefined): Seds | undefined => {
    if (sed) {
      return [sed]
    }
    if (!buc.seds) {
      return undefined
    }
    const seds: Seds | undefined = buc.seds
      .filter(sedFilter)
      .filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled')

    return seds
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
    const sed = _.find(_seds, { id: sedId })
    if (!sed) {
      return undefined
    }
    const sender: Participant | undefined = sed.participants?.find((participant: Participant) => participant.role === 'Sender')
    if (sender) {
      return {
        date: moment(sed.lastUpdate).format('DD.MM.YYYY'),
        countryLabel: CountryData.getCountryInstance(locale).findByValue(sender.organisation.countryCode).label,
        country: sender.organisation.countryCode,
        institution: sender.organisation.name,
        acronym: sender.organisation.acronym || '-'
      }
    }
    return undefined
  }

  const getEmptyPeriodsReport = (): EmptyPeriodsReport => {
    const res: EmptyPeriodsReport = {}
    Object.keys(_activeSeds).forEach((key: string) => {
      if (_activeSeds[key]) {
        res[key] = sedContent[key]?.pensjon?.medlemskapAnnen?.length > 0
      }
    })
    return res
  }

  const hasEmptyPeriods = (emptyPeriodsReport: EmptyPeriodsReport): boolean => {
    return Object.values(emptyPeriodsReport).indexOf(true) >= 0
  }

  const emptyPeriodReport: EmptyPeriodsReport = getEmptyPeriodsReport()
  const warning = hasEmptyPeriods(emptyPeriodReport)

  useEffect(() => {
    if ((buc.caseId !== _buc.caseId) || (sed?.id !== _sed?.id)) {
      _setBuc(buc)
      _setSed(sed)
      const seds = getP5000(buc, sed)
      _setSeds(seds)
    }
  }, [buc, _buc, sed, _sed])

  useEffect(() => {
    if (!_ready) {
      if (_.isNil(_fetchingP5000)) {
        const seds: Seds | undefined = getP5000(buc, sed)
        _setSeds(seds)
        if (seds) {
          setFetchingP5000(seds)
          seds.forEach(sed => {
            dispatch(getSed(buc.caseId!, sed))
          })
        }
      }

      if (_.isArray(_fetchingP5000)) {
        if (!_.isEmpty(_fetchingP5000)) {
          const myDocumentIds = _fetchingP5000!.map((sed: Sed) => sed.id)
          const loadedSeds = Object.keys(sedContent)
          const commonSeds = _.intersection(myDocumentIds, loadedSeds)
          if (!_.isEmpty(commonSeds)) {
            const newFetchingP5000 = _.filter(_fetchingP5000, sed => !_.includes(commonSeds, sed.id))
            setFetchingP5000(newFetchingP5000)
          }
        } else {
          setActiveSeds(_.mapValues(_.keyBy(_seds, 'id'), () => true))
          setReady(true)
        }
      }
    }
  }, [_fetchingP5000, sedContent])

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
                  data-test-id={'a-buc-c-sedp5000overview__checkbox-' + sedId}
                  checked={_activeSeds[sedId]}
                  key={'a-buc-c-sedp5000overview__checkbox-' + sedId}
                  id={'a-buc-c-sedp5000overview__checkbox-' + sedId}
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
      {featureToggles.P5000_SUMMER_VISIBLE && seeEdit
        ? (
          <>
            <VerticalSeparatorDiv size='3' />
            {renderBackLink()}
            <VerticalSeparatorDiv size='2' />
            <ExpandingPanel
              open
              renderContentWhenClosed
              highContrast={highContrast}
              heading={(
                <Undertittel>
                  {t('buc:p5000-edit-title')}
                </Undertittel>
              )}
            >
              <SEDP5000Edit
                key={'SEDP5000Edit' + _seds!.map(s => s.id).join(',') + 'fromstorage' + fromStorage?.id + 'sedContent' + Object.keys(sedContent).join(',')}
                caseId={buc.caseId!}
                fromStorage={fromStorage}
                highContrast={highContrast}
                locale={locale}
                p5000Storage={p5000Storage}
                seds={_seds!}
                sedContentMap={sedContent}
                setP5000Storage={setP5000Storage}
              />
            </ExpandingPanel>
          </>
          )
        : (featureToggles.P5000_SUMMER_VISIBLE && (
          <Normaltekst>
            {t('buc:p5000-to-see-p5000edit')}
          </Normaltekst>
          ))}
      {seeOversikt && (
        <>
          <VerticalSeparatorDiv size='3' />
          {renderBackLink()}
          <VerticalSeparatorDiv size='2' />
          <ExpandingPanel
            open
            renderContentWhenClosed
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {t('buc:p5000-overview-title')}
              </Undertittel>
            )}
          >
            <SEDP5000Overview
              activeSeds={_activeSeds}
              getSedSender={getSedSender}
              highContrast={highContrast}
              key={'SEDP5000Overview' + _seds!.map(s => s.id).join(',') + 'sedContent' + Object.keys(sedContent).join(',')}
              sedContent={sedContent}
            />
          </ExpandingPanel>
        </>
      )}
      {featureToggles.P5000_SUMMER_VISIBLE && seeSummer && (
        <>
          <VerticalSeparatorDiv size='3' />
          {renderBackLink()}
          <VerticalSeparatorDiv size='2' />
          <ExpandingPanel
            open
            renderContentWhenClosed
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {t('buc:p5000-summary-title')}
              </Undertittel>
            )}
          >
            <SEDP5000Sum
              activeSeds={_activeSeds}
              highContrast={highContrast}
              key={'SEDP5000Sum' + _seds!.map(s => s.id).join(',') + 'sedContent' + Object.keys(sedContent).join(',')}
              sedContent={sedContent}
            />
          </ExpandingPanel>
        </>
      )}
    </div>
  )
}

export default SEDP5000
