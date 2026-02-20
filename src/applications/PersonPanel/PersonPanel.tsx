import { Accordion, Box } from '@navikt/ds-react'
import {getPersonAvdodInfo, getPersonInfo} from 'src/actions/person'
import { AllowedLocaleString, FeatureToggles, PesysContext } from 'src/declarations/app.d'
import { PersonPDL } from 'src/declarations/person'
import { PersonAvdods } from 'src/declarations/person.d'
import { State } from 'src/declarations/reducers'
import { JSX, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PersonBody from './PersonBody'
import PersonTitle from './PersonTitle'
import {GJENNY, VEDTAKSKONTEKST} from "src/constants/constants";
import {umamiAccordionLogger} from "src/metrics/umami";

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

const PersonPanel = (): JSX.Element => {
  const { aktoerId, featureToggles, gettingPersonInfo, locale, personPdl, personAvdods, pesysContext, vedtakId }: PersonPanelSelector =
    useSelector<State, PersonPanelSelector>(mapState)
  const [openPersonBody, setOpenPersonBody] = useState(false);
  const dispatch = useDispatch()


  useEffect(() => {
    if (aktoerId && pesysContext && pesysContext !== GJENNY) {
        dispatch(getPersonInfo(aktoerId))
        if (pesysContext === VEDTAKSKONTEKST && !!vedtakId) {
          dispatch(getPersonAvdodInfo(aktoerId, vedtakId, featureToggles.NR_AVDOD as number | undefined))
        }
    }
  }, [aktoerId, pesysContext])

  return (
    <Box
      padding="0"
      borderWidth="1"
      borderRadius="small"
      style={{ backgroundColor: 'white' }}
    >
      <Accordion style={{ borderRadius: '4px' }} data-testid='w-PersonPanel-id'>
        <Accordion.Item
          open={openPersonBody}
        >
          <Accordion.Header
            onClick={() => {
              !openPersonBody && umamiAccordionLogger({tittel: 'PersonPanel'});
              setOpenPersonBody(!openPersonBody);
            }}
          >
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
    </Box>
  )
}

export default PersonPanel
