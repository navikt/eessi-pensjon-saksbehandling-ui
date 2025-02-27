import React, {useEffect, useState} from "react";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, PSED, Validation} from "src/declarations/app";
import {useDispatch, useSelector} from "react-redux";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {fetchBuc, updatePSED, getSedP8000} from "src/actions/buc";
import {WaitingPanelDiv} from "src/components/StyledComponents";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import {InformasjonSomKanLeggesInn, OfteEtterspurtInformasjon, P8000SED, P8000Type} from "src/declarations/p8000";
import {State} from "src/declarations/reducers";
import {Box, Button, Heading, HStack, Textarea, ToggleGroup, VStack} from "@navikt/ds-react";
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
  P5000,
  P6000, PERSON_UTEN_PNR_DNR, SAKSBEHANDLINGSTID,
  TILTAK,
  YTELSESHISTORIKK
} from "src/constants/p8000";
import {CheckboxWithCountryAndPeriods} from "src/applications/P8000/components/CheckboxWithCountryAndPeriods";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000Fields} from "src/applications/P8000/P8000Fields";
import CountryData from "@navikt/land-verktoy";
import {SendFolgendeSEDer} from "src/applications/P8000/components/SendFolgendeSEDer";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";

export interface P8000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P8000FieldComponentProps {
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace: string
  label: string
  value: string
  target: string
  options?: any
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
 setMode,
}: P8000Props): JSX.Element => {
  const {t, i18n} = useTranslation()
  const dispatch = useDispatch()
  const { gettingSed, currentPSED }: P8000Selector = useSelector<State, P8000Selector>(mapState)
  const namespace = "p8000"

  const [_ytterligereInformasjon, setYtterligereInformasjon] = useState<string | undefined>(undefined)
  const [_type, setType] = useState<string>("")
  const bucType = buc.type?.split("_")[2]

  const countryData = CountryData.getCountryInstance('nb')

  useEffect(() => {
    if(currentPSED){
      setYtterligereInformasjon(currentPSED?.pensjon?.ytterligeinformasjon)
    } else {
      setYtterligereInformasjon(undefined)
    }
  }, [])

  useEffect(() => {
    if(currentPSED && !currentPSED?.type?.ytelse){
      currentPSED?.type?.spraak ? setTypeProperty("spraak", currentPSED?.type?.spraak) : setTypeProperty("spraak", "nb")
      currentPSED?.type?.bosettingsstatus ? setTypeProperty("bosettingsstatus", currentPSED?.type?.bosettingsstatus) : setTypeProperty("bosettingsstatus", "UTL")
      if(bucType === "03"){
        setTypeProperty("ytelse", "UT")
      } else if(bucType === "01"){
        setTypeProperty("ytelse", "AP")
      }
    }
  }, [currentPSED, bucType])

  useEffect(() => {
    const P8000Type: P8000Type = currentPSED?.type
    if(P8000Type && bucType && P8000Type.ytelse && P8000Type.bosettingsstatus && P8000Type.spraak){
      setType(P8000Type.ytelse + "_" + P8000Type.bosettingsstatus + "_" + bucType)
    }
  }, [currentPSED, currentPSED?.type])

  useEffect(() => {
    if(sed){
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(getSedP8000(buc.caseId!, sed))
    }

  }, [sed])

  useEffect(() => {
    if(i18n.language !== currentPSED?.type?.spraak){
      i18n.changeLanguage(currentPSED?.type?.spraak)
    }

    let text = ""
    if(currentPSED && currentPSED.ofteEtterspurtInformasjon){
      P8000Variants[_type]?.ofteEtterspurtInformasjon?.map((field: string) => {
        const ofteEtterspurtInformasjon: OfteEtterspurtInformasjon = currentPSED?.ofteEtterspurtInformasjon
        const key: keyof OfteEtterspurtInformasjon = field as keyof OfteEtterspurtInformasjon

        if(ofteEtterspurtInformasjon && ofteEtterspurtInformasjon[key] && ofteEtterspurtInformasjon[key]?.value){
          const country = countryData.findByValue(ofteEtterspurtInformasjon[key]?.landkode)
          const extra = {
            land: country?.label,
            periodeFra: ofteEtterspurtInformasjon[key]?.periodeFra,
            periodeTil: ofteEtterspurtInformasjon[key]?.periodeTil,
            antallMaaneder: ofteEtterspurtInformasjon[key]?.antallMaaneder
          }

          text = text + t('p8000:' + field, extra) + "\n\n"
        }
      })
    }
    if(currentPSED && currentPSED.informasjonSomKanLeggesInn){
      P8000Variants[_type]?.informasjonSomKanLeggesInn?.map((field: string) => {
        const informasjonSomKanLeggesInn: InformasjonSomKanLeggesInn = currentPSED?.informasjonSomKanLeggesInn
        const key: keyof InformasjonSomKanLeggesInn = field as keyof InformasjonSomKanLeggesInn

        if(informasjonSomKanLeggesInn && informasjonSomKanLeggesInn[key] && informasjonSomKanLeggesInn[key]?.value){
          const country = countryData.findByValue(informasjonSomKanLeggesInn[key]?.landkode)
          const extra = {
            land: country?.label,
            periodeFra: informasjonSomKanLeggesInn[key]?.periodeFra,
            periodeTil: informasjonSomKanLeggesInn[key]?.periodeTil,
            antallMaaneder: informasjonSomKanLeggesInn[key]?.antallMaaneder
          }
          text = text + t('p8000:' + field, extra) + "\n\n"
        }
      })
    }
    setYtterligereInformasjon(text)
  }, [currentPSED])

  useEffect(() => {
    dispatch(updatePSED(`pensjon.ytterligeinformasjon`, _ytterligereInformasjon))
  }, [_ytterligereInformasjon])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  const setTypeProperty = (property: string, propValue: string) => {
    dispatch(updatePSED(`type.${property}`, propValue))
  }

  const resetP8000 = () => {
    dispatch(updatePSED("pensjon.anmodning.seder[0].sendFolgendeSEDer", []))
    dispatch(updatePSED("ofteEtterspurtInformasjon", undefined))
    dispatch(updatePSED("informasjonSomKanLeggesInn", undefined))
  }

  const onToggle = (property: string, propValue: string) => {
    setTypeProperty(property, propValue)
    if(property !== 'spraak'){
      resetP8000()
    }
  }

  if(gettingSed){
    return(
      <WaitingPanelDiv>
        <WaitingPanel/>
      </WaitingPanelDiv>
    )
  }



  const P8000Variants: { [key:string]: any} = {
    UT_UTL_03: {
      ofteEtterspurtInformasjon: [
        P5000,
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
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-default"
          background="bg-default"
          padding="4"
        >
          <VStack gap="4">
            <Heading level="1" size="medium">{t('p8000:form-heading-p8000')} ({buc.type?.toUpperCase()} - {t('buc:buc-' + buc.type?.toUpperCase())})</Heading>
            {currentPSED && currentPSED.type &&
              <HStack gap="4">
                <ToggleGroup value={currentPSED?.type?.spraak} onChange={(v)=> onToggle("spraak", v)} label={t('p8000:form-label-velg-spraak')}>
                  <ToggleGroup.Item value="nb" label={t('p8000:form-label-spraak-norsk')} />
                  <ToggleGroup.Item value="en" label={t('p8000:form-label-spraak-engelsk')} />
                </ToggleGroup>
                {bucType !== "03" && bucType !== "01" &&
                  <ToggleGroup value={currentPSED?.type?.ytelse} onChange={(v)=> onToggle("ytelse", v)} label={t('p8000:form-label-velg-ytelse')}>
                    <ToggleGroup.Item value="AP" label={t('p8000:form-label-ytelse-alderspensjon')} />
                    <ToggleGroup.Item value="UT" label={t('p8000:form-label-ytelse-ufoere')} />
                  </ToggleGroup>
                }
                <ToggleGroup value={currentPSED?.type?.bosettingsstatus} onChange={(v)=> onToggle("bosettingsstatus", v)} label={t('p8000:form-label-velg-bosettingsstatus')}>
                  <ToggleGroup.Item value="NO" label={t('p8000:form-label-bosettingsstatus-norge')} />
                  <ToggleGroup.Item value="UTL" label={t('p8000:form-label-bosettingsstatus-utland')} />
                </ToggleGroup>
              </HStack>
            }
          </VStack>
        </Box>
        {_type &&
          <>
            <Box
              borderWidth="1"
                 borderRadius="medium"
                 borderColor="border-default"
                 background="bg-default"
                 padding="4"
            >
              <VStack gap="4">
                <Heading level="2" size="small">{t('p8000:form-heading-ofte-etterspurt-informasjon')}</Heading>
                <P8000Fields
                  fields={[
                    {label: P5000, value: P5000, component: SendFolgendeSEDer, target: 'pensjon.anmodning.seder[0].sendFolgendeSEDer'},
                    {label: P4000, value: P4000, component: SendFolgendeSEDer, target: 'pensjon.anmodning.seder[0].sendFolgendeSEDer'} ,
                    {label: P6000, value: P6000, component: SendFolgendeSEDer, target: 'pensjon.anmodning.seder[0].sendFolgendeSEDer'} ,
                    {label: "Brukers adresse", value: BRUKERS_ADRESSE, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Medisinsk informasjon", value: MEDISINSK_INFORMASJON, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Opplysninger om tiltak", value: TILTAK, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Nåværende arbeid: Arbeidstimer per uke og månedsinntekt", value: NAAVAERENDE_ARBEID, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Dokumentasjon på arbeid i Norge", value: DOKUMENTASJON_PAA_ARBEID_I_NORGE, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Ytelseshistorikk adresse", value: YTELSESHISTORIKK, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Inntekt før uførhet i utlandet", value: INNTEKT_FOER_UFOERHET_I_UTLANDET, component: CheckboxWithCountryAndPeriods, target: 'ofteEtterspurtInformasjon', options: {showCountry: true, showPeriod: true, showMonths: false}},
                    {label: "IBAN og SWIFT", value: IBAN_SWIFT, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Folkbokföring (SE)", value: FOLKBOKFOERING, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Brukers sivilstand", value: BRUKERS_SIVILSTAND, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                    {label: "Opplysninger om EPS", value: OPPLYSNINGER_OM_EPS, component: CheckboxWithCountryAndPeriods, target: 'ofteEtterspurtInformasjon', options: {showCountry: true, showPeriod: false, showMonths: false}},
                    {label: "Person uten p.nr/d.nr", value: PERSON_UTEN_PNR_DNR, component: CheckBoxField, target: 'ofteEtterspurtInformasjon'},
                  ]}
                  variant={P8000Variants[_type]?.ofteEtterspurtInformasjon}
                  PSED={currentPSED}
                  updatePSED={updatePSED}
                  namespace={namespace + '-ofteEtterspurtInformasjon'}
                />
              </VStack>
            </Box>
            <Box
              borderWidth="1"
              borderRadius="medium"
              borderColor="border-default"
              background="bg-default"
              padding="4"
            >
              <VStack gap="4">
                <Heading level="2" size="small">{t('p8000:form-heading-informasjon-som-kan-legges-inn')}</Heading>
                <P8000Fields
                  fields={[
                    {label: "Legg til saksbehandlingstid", value: SAKSBEHANDLINGSTID, component: CheckboxWithCountryAndPeriods, target: 'informasjonSomKanLeggesInn', options: {showCountry: false, showPeriod: false, showMonths: true}},
                    {label: "P5000 trengs for å fylle ut P5000NO", value: P5000_FOR_P5000NO, component: CheckBoxField, target: 'informasjonSomKanLeggesInn'},
                  ]}
                  variant={P8000Variants[_type]?.informasjonSomKanLeggesInn}
                  PSED={currentPSED}
                  updatePSED={updatePSED}
                  namespace={namespace + '-informasjonSomKanLeggesInn'}
                />
              </VStack>
            </Box>
            <Box
              borderWidth="1"
              borderRadius="medium"
              borderColor="border-default"
              background="bg-default"
              padding="4"
            >
              <VStack gap="4">
                <Textarea label={t('p8000:form-forhaandsvisning-av-tekst')} value={_ytterligereInformasjon ?? ""}/>
              </VStack>
            </Box>
          </>
        }
      </VStack>
    </>
  )
}

export default P8000
