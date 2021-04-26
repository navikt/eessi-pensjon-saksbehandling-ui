//import {  timeLogger } from 'metrics/loggers'
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
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface SEDP5000Props {
  buc: Buc
  p5000Storage: any
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
  setMode,
  p5000Storage,
  setP5000Storage,
  initialItems = undefined,
  initialYtelseOption = undefined
}: SEDP5000Props): JSX.Element => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    highContrast, locale, sedContent
  }: SEDP5000Selector = useSelector<State, SEDP5000Selector>(mapState)

  const [_fetchingP5000, setFetchingP5000] = useState<Seds | undefined>(undefined)
  //const [_timeWithP5000Modal, setTimeWithP5000Modal] = useState<Date | undefined>(undefined)
  const [_ready, setReady] = useState<boolean>(false)

  const getP5000 = useCallback((): Seds | undefined => {
    if (!buc.seds) {
      return undefined
    }
    return buc.seds
      .filter(sedFilter)
      .filter((sed: Sed) => sed.type === 'P5000' && sed.status !== 'cancelled')
  }, [buc])

  useEffect(() => {

    if (_fetchingP5000 === undefined) {
      const p5000s: Seds | undefined = getP5000()
      if (p5000s) {
        setFetchingP5000(p5000s)
        p5000s.forEach(sed => {
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

  }, [_fetchingP5000, sedContent])

  /*
  useEffect(() => {
    setTimeWithP5000Modal(new Date())
    return () => {
      timeLogger('buc.edit.tools.P5000', _timeWithP5000Modal!)
    }
  }, [])*/


  if (!_ready) {
    return (
      <SpinnerDiv>
        <WaitingPanel />
      </SpinnerDiv>
    )
  }

  return (
    <>
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
      <ExpandingPanel
        highContrast={highContrast}
        heading={(
          <Undertittel>
            {t('buc:P5000-overview-title')}
          </Undertittel>
        )}
      >
        <SEDP5000Overview
        highContrast={highContrast}
        seds={getP5000()!}
        sedContent={sedContent}
        locale={locale}
        />
      </ExpandingPanel>
      <VerticalSeparatorDiv data-size='3'/>

      <ExpandingPanel
        highContrast={highContrast}
        heading={(
          <Undertittel>
            {t('buc:P5000-summary-title')}
          </Undertittel>
        )}
      >
        <SEDP5000Sum
          highContrast={highContrast}
          seds={getP5000()!}
          sedContent={sedContent}
          locale={locale}
        />
      </ExpandingPanel>

      <VerticalSeparatorDiv data-size='3'/>

      <ExpandingPanel
        highContrast={highContrast}
        heading={(
          <Undertittel>
            {t('buc:P5000-edit-title')}
          </Undertittel>
        )}
      >
        <SEDP5000Edit
          caseId={buc.caseId!}
          highContrast={highContrast}
          seds={getP5000()!}
          sedContent={sedContent}
          p5000Storage={p5000Storage}
          setP5000Storage={setP5000Storage}
          initialItems={initialItems}
          initialYtelseOption={initialYtelseOption}
        />
      </ExpandingPanel>

      </>
    )
}


export default SEDP5000
