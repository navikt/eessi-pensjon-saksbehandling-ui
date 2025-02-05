import React, {useEffect} from "react";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {useDispatch, useSelector} from "react-redux";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {fetchBuc, updatePSED, getSedP8000} from "src/actions/buc";
import {WaitingPanelDiv} from "src/components/StyledComponents";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import {P8000SED} from "src/declarations/p8000";
import {State} from "src/declarations/reducers";
import {Box, Button, Heading, Spacer, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {
  BRUKERS_ADRESSE,
  BRUKERS_SIVILSTAND,
  DOKUMENTASJON_PAA_ARBEID_I_NORGE,
  FOLKBOKFOERING,
  IBAN_SWIFT,
  INNTEKT_FOER_UFOERHET_I_UTLANDET,
  MEDISINSK_INFORMASJON,
  NAAVAERENDE_ARBEID, OPPLYSNINGER_OM_EPS,
  P4000, P5000_FOR_P5000NO,
  P5000_FRA,
  P6000, PERSON_UTEN_PNR_DNR, SAKSBEHANDLINGSTID,
  TILTAK,
  YTELSESHISTORIKK
} from "src/constants/p8000";
import {InntektFoerUfoerhetIUtlandet} from "src/applications/P8000/components/InntektFoerUfoerhetIUtlandet";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000Fields} from "src/applications/P8000/P8000Fields";

export interface P8000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P8000Selector {
  PSEDChanged: boolean
  currentPSED: P8000SED
  savingSed: boolean
  sendingSed: boolean
  PSEDSendResponse: any | null | undefined
  PSEDSavedResponse: any | null | undefined
  gettingSed: boolean
  validation: Validation
  aktoerId: string
}

const mapState = (state: State): P8000Selector => ({
  PSEDChanged: state.buc.PSEDChanged,
  currentPSED: state.buc.PSED as P8000SED,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  PSEDSendResponse: state.buc.PSEDSendResponse,
  PSEDSavedResponse: state.buc.PSEDSavedResponse,
  gettingSed: state.loading.gettingSed,
  validation: state.validation.status,
  aktoerId: state.app.params.aktoerId
})


const P8000: React.FC<P8000Props> = ({
 buc,
 sed,
 setMode
}: P8000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { gettingSed, currentPSED }: P8000Selector = useSelector<State, P8000Selector>(mapState)
  const namespace = "p8000"

  useEffect(() => {
    if(sed){
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(getSedP8000(buc.caseId!, sed))
    }

  }, [sed])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  if(gettingSed){
    return(
      <WaitingPanelDiv>
        <WaitingPanel/>
      </WaitingPanelDiv>
    )
  }

  const P8000Variants = {
    UT_UTL_03: {
      ofteEtterspurtInformasjon: [
        P5000_FRA,
        P4000,
        P6000,
        BRUKERS_ADRESSE,
        MEDISINSK_INFORMASJON,
        TILTAK,
        NAAVAERENDE_ARBEID,
        DOKUMENTASJON_PAA_ARBEID_I_NORGE,
        YTELSESHISTORIKK,
        INNTEKT_FOER_UFOERHET_I_UTLANDET,
        IBAN_SWIFT,
        FOLKBOKFOERING,
        BRUKERS_SIVILSTAND,
        OPPLYSNINGER_OM_EPS,
        PERSON_UTEN_PNR_DNR
      ],
      informasjonSomKanLeggesInn: [
        SAKSBEHANDLINGSTID,
        P5000_FOR_P5000NO
      ]
    },
    UT_UTL_05: [],
    UT_NO_03: [],
    UT_NO_05: [],
    AP_UTL_01: [],
    AP_UTL_05: [],
    AP_NO_01: [],
    AP_NO_05: [],
    EO_UTL_02: [],
    EO_NO_02: [],
    EO_UTL_05: [],
    EO_NO_05: []
  }

  return (
    <>
      <VStack gap="4">
        <div style={{ display: 'inline-block' }}>
          <Button
            variant='secondary'
            onClick={onBackClick}
            iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
          >
            <span>
              {t('ui:back')}
            </span>
          </Button>
        </div>
        <Box
          as="header"
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-default"
          background="bg-default"
          padding="4"
        >
          <Heading level="1" size="medium">P8000</Heading>
          <Spacer/>
          <P8000Fields
            fields={[
              {label: P4000, value: P4000, component: CheckBoxField},
              {label: "Inntekt før uførhet i utlandet", value: INNTEKT_FOER_UFOERHET_I_UTLANDET, component: InntektFoerUfoerhetIUtlandet},
              {label: "Brukers adresse", value: BRUKERS_ADRESSE, component: CheckBoxField},
              {label: "Medisinsk informasjon", value: MEDISINSK_INFORMASJON, component: CheckBoxField},
              {label: "Opplysninger om tiltak", value: TILTAK, component: CheckBoxField},
            ]}
            variant={P8000Variants.UT_UTL_03.ofteEtterspurtInformasjon}
            PSED={currentPSED}
            updatePSED={updatePSED}
            namespace={namespace + '-ofteEtterspurtInformasjon'}
            target='ofteEtterspurtInformasjon'
          />
        </Box>
      </VStack>
    </>
  )
}

export default P8000
