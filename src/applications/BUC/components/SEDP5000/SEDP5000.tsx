import { getSed } from 'actions/buc'
import { BUCMode } from 'applications/BUC'
import { SpinnerDiv } from 'applications/BUC/components/BUCTools/BUCTools'
import { sedFilter } from 'applications/BUC/components/BUCUtils/BUCUtils'
import SEDP5000Edit from 'applications/BUC/components/SEDP5000/SEDP5000Edit'
import SEDP5000Overview from 'applications/BUC/components/SEDP5000/SEDP5000Overview'
import SEDP5000Sum from 'applications/BUC/components/SEDP5000/SEDP5000Sum'
import ExpandingPanel from 'components/ExpandingPanel/ExpandingPanel'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { AllowedLocaleString } from 'declarations/app'
import { Buc, Sed, SedContentMap, Seds } from 'declarations/buc'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { VenstreChevron } from 'nav-frontend-chevron'
import { Undertittel } from 'nav-frontend-typografi'
import { HighContrastLink, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface SEDP5000Props {
  buc: Buc
  p5000Storage: any
  sed?: Sed,
  seeOversikt?: boolean
  seeSummer?: boolean
  seeEdit?: boolean
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
  setP5000Storage: any
  initialItems?: any
  initialYtelseOption?: any
}

export interface SEDP5000Selector {
  highContrast: boolean
  locale: AllowedLocaleString
  sedContent: SedContentMap
}

const mapState = (state: State): SEDP5000Selector => ({
  highContrast: state.ui.highContrast,
  locale: state.ui.locale,
  sedContent: state.buc.sedContent
})

const SEDP5000: React.FC<SEDP5000Props> = ({
  buc,
  initialItems = undefined,
  initialYtelseOption = undefined,
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
    highContrast, locale, sedContent
  }: SEDP5000Selector = useSelector<State, SEDP5000Selector>(mapState)

  const [_fetchingP5000, setFetchingP5000] = useState<Seds | undefined>(undefined)
  const [_ready, setReady] = useState<boolean>(false)
  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)
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

  useEffect(() => {
    if ((buc.caseId !== _buc.caseId) || (sed?.id !== _sed?.id)) {
      _setBuc(buc)
      _setSed(sed)
      console.log('get P5000')
      const seds = getP5000(buc, sed)
      _setSeds(seds)
    }
  }, [buc, _buc, sed, _sed])

  useEffect(() => {
    if (!_ready) {
      if (_fetchingP5000 === undefined) {
        const seds: Seds | undefined = getP5000(buc, sed)
        _setSeds(seds)
        if (seds) {
          setFetchingP5000(seds)
          seds.forEach(sed => {
            dispatch(getSed(buc.caseId!, sed))
          })
        }
      }

      if (!_.isEmpty(_fetchingP5000)) {
        const myDocumentIds = _fetchingP5000!.map((sed: Sed) => sed.id)
        const loadedSeds = Object.keys(sedContent)
        const commonSeds = _.intersection(myDocumentIds, loadedSeds)
        if (!_.isEmpty(commonSeds)) {
          const newFetchingP5000 = _.filter(_fetchingP5000, sed => !_.includes(commonSeds, sed.id))
          setFetchingP5000(newFetchingP5000)
        }
      } else {
        setReady(true)
      }
    }

  }, [_fetchingP5000, sedContent])

/*
  useEffect(() => {
    setTimeWithP5000Modal(new Date())
    return () => {
      timeLogger('buc.edit.tools.P5000', _timeWithP5000Modal!)
    }
  }, [])
*/

  if (!_ready) {
    return (
      <SpinnerDiv>
        <WaitingPanel />
      </SpinnerDiv>
    )
  }

  return (
    <div key={_seds?.map(s => s.id).join(',')}>
      <div style={{display: 'inline-block'}}>
        <HighContrastLink
          href='#'
          onClick={() => setMode('bucedit', 'back')}
        >
          <VenstreChevron />
          <HorizontalSeparatorDiv data-size='0.25' />
          <span>
              {t('ui:back')}
            </span>
        </HighContrastLink>
      </div>
      <VerticalSeparatorDiv data-size='2'/>
      {seeOversikt && (
        <>
          <ExpandingPanel
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {t('buc:p5000-overview-title')}
              </Undertittel>
            )}
          >
            <SEDP5000Overview
            highContrast={highContrast}
            seds={_seds!}
            sedContent={sedContent}
            locale={locale}
            />
          </ExpandingPanel>
          <VerticalSeparatorDiv data-size='3'/>
        </>
      )}
      {seeSummer && (
        <>
          <ExpandingPanel
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {t('buc:p5000-summary-title')}
              </Undertittel>
            )}
          >
            <SEDP5000Sum
              highContrast={highContrast}
              locale={locale}
              seds={_seds!}
              sedContent={sedContent}
            />
          </ExpandingPanel>
          <VerticalSeparatorDiv data-size='3'/>
        </>
      )}
      {seeEdit && (
        <>
          <ExpandingPanel
            highContrast={highContrast}
            heading={(
              <Undertittel>
                {t('buc:p5000-edit-title')}
              </Undertittel>
            )}
          >
            <SEDP5000Edit
              key={Object.keys(sedContent).join(',')}
              caseId={buc.caseId!}
              highContrast={highContrast}
              initialItems={initialItems}
              initialYtelseOption={initialYtelseOption}
              locale={locale}
              p5000Storage={p5000Storage}
              seds={_seds!}
              sedContentMap={sedContent}
              setP5000Storage={setP5000Storage}
            />
          </ExpandingPanel>
        </>
      )}
    </div>
  )
}

export default SEDP5000
