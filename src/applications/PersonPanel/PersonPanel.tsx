import { Accordion, Alert, Panel } from '@navikt/ds-react'
import {getPersonAvdodInfo, getPersonAvdodInfoFromAktoerId, getPersonInfo} from 'actions/person'
import { AllowedLocaleString, FeatureToggles, PesysContext } from 'declarations/app.d'
import { PersonPDL } from 'declarations/person'
import { PersonAvdods } from 'declarations/person.d'
import { State } from 'declarations/reducers'
import { timeDiffLogger } from 'metrics/loggers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import PersonBody from './PersonBody'
import PersonTitle from './PersonTitle'
import {GJENNY, VEDTAKSKONTEKST} from "constants/constants";

export interface PersonPanelSelector {
  aktoerId: string | null | undefined
  avdodAktoerId: string | null | undefined
  featureToggles: FeatureToggles
  gettingPersonInfo: boolean
  locale: AllowedLocaleString
  personPdl?: PersonPDL,
  personAvdods: PersonAvdods | undefined,
  pesysContext: PesysContext | undefined,
  vedtakId: string | null | undefined
}

const mapState = (state: State): PersonPanelSelector => ({
  /* istanbul ignore next */
  aktoerId: state.app.params.aktoerId,
  avdodAktoerId: state.app.params.avdodAktoerId,
  featureToggles: state.app.featureToggles,
  gettingPersonInfo: state.loading.gettingPersonInfo,
  locale: state.ui.locale,
  personPdl: state.person.personPdl,
  personAvdods: state.person.personAvdods,
  pesysContext: state.app.pesysContext,
  vedtakId: state.app.params.vedtakId
})

export const PersonPanel = (): JSX.Element => {
  const { aktoerId, avdodAktoerId, featureToggles, gettingPersonInfo, locale, personPdl, personAvdods, pesysContext, vedtakId }: PersonPanelSelector =
    useSelector<State, PersonPanelSelector>(mapState)
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('PersonPanel.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  useEffect(() => {
    if (aktoerId && pesysContext && !personPdl) {
      dispatch(getPersonInfo(aktoerId))
      if (pesysContext === VEDTAKSKONTEKST && !!vedtakId) {
        dispatch(getPersonAvdodInfo(aktoerId, vedtakId, featureToggles.NR_AVDOD as number | undefined))
      } else if (avdodAktoerId && pesysContext === GJENNY) {
        dispatch(getPersonAvdodInfoFromAktoerId(avdodAktoerId))
      }
    }
  }, [aktoerId, avdodAktoerId, pesysContext])

  useEffect(() => {
    console.log("PERSON PDL:", personPdl)
    console.log("PERSON AVDØD:", personAvdods)
  }, [personPdl, personAvdods])

  if (!aktoerId) {
    return (
      <Alert
        variant='warning'
        data-testid='w-PersonPanel--alert'
      >
        {t('message:validation-noAktoerId')}
      </Alert>
    )
  }

  return (
    <Panel
      border style={{ padding: '0px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion style={{ borderRadius: '4px' }} data-testid='w-PersonPanel-id'>
        <Accordion.Item>
          <Accordion.Header>
            <PersonTitle
              gettingPersonInfo={gettingPersonInfo}
              person={personPdl}
            />
          </Accordion.Header>
          <Accordion.Content>
            <PersonBody
              locale={locale}
              person={personPdl}
              personAvdods={personAvdods}
            />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

export default PersonPanel
