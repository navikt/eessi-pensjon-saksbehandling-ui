import React, {useEffect, useState} from "react";
import {Buc, Bucs, Institutions, Sed} from "src/declarations/buc";
import {BUCMode, PSED, Validation} from "src/declarations/app";
import {useDispatch, useSelector} from "react-redux";
import {resetEditingItems} from "src/actions/app";
import {resetValidation, setValidation} from "src/actions/validation";
import {fetchBuc, updatePSED, getSedP8000, resetPSED} from "src/actions/buc";
import {WaitingPanelDiv, BoxWithBorderAndPadding} from "src/components/StyledComponents";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import {InformasjonSomKanLeggesInn, OfteEtterspurtInformasjon, P8000SED, P8000Type} from "src/declarations/p8000";
import {State} from "src/declarations/reducers";
import {Alert, Button, Heading, HStack, Textarea, ToggleGroup, VStack} from "@navikt/ds-react";
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
  YTELSESHISTORIKK,
  P5000_MED_BEGRUNNELSE
} from "src/constants/p8000";
import {CheckboxWithCountryAndPeriods} from "src/applications/P8000/components/CheckboxWithCountryAndPeriods";
import {CheckBoxField} from "src/applications/P8000/components/CheckboxField";
import {P8000Fields} from "src/applications/P8000/P8000Fields";
import CountryData from "@navikt/land-verktoy";
import {SendFolgendeSEDer} from "src/applications/P8000/components/SendFolgendeSEDer";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import UtenlandskePin from "src/components/UtenlandskePin/UtenlandskePin";
import UtenlandskeSaksnr from "src/components/UtenlandskeSaksnr/UtenlandskeSaksnr";
import SaveAndSendSED from "src/components/SaveAndSendSED/SaveAndSendSED";
import useUnmount from "src/hooks/useUnmount";
import {validateP8000, ValidationP8000Props} from "src/applications/P8000/validateP8000";
import _ from "lodash";
import performValidation from "src/utils/performValidation";
import ValidationBox from "src/components/ValidationBox/ValidationBox";
import {SendFolgendeSEDerWithBegrunnelse} from "src/applications/P8000/components/SendFolgendeSEDerWithBegrunnelse";

export interface P8000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P8000FieldComponentProps {
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  namespace?: string
  label: string
  value: string
  target?: string
  options?: any
}

export interface P8000Selector {
  currentPSED: P8000SED
  currentBuc: string
  bucs: Bucs
  gettingSed: boolean
  validation: Validation
  aktoerId: string
}

const mapState = (state: State): P8000Selector => ({
  currentPSED: state.buc.PSED as P8000SED,
  currentBuc: state.buc.currentBuc,
  bucs: state.buc.bucs,
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
  const { gettingSed, currentPSED, currentBuc, bucs, validation }: P8000Selector = useSelector<State, P8000Selector>(mapState)
  const namespace = "p8000"

  const [_ytterligereInformasjon, setYtterligereInformasjon] = useState<string | undefined>(undefined)
  const [_fritekst, setFritekst] = useState<string | undefined>()
  const [_fritekstLoaded, setFritekstLoaded] = useState<boolean>(false)
  const [_hideBosettingsStatus, setHideBosettingsStatus] = useState<boolean>(false)
  const bucDeltakere: Institutions | null | undefined = bucs[currentBuc].deltakere

  const [_type, setType] = useState<string>("")
  const bucType = buc.type?.split("_")[2]

  const countryData = {
    "nb": CountryData.getCountryInstance('nb'),
    "en": CountryData.getCountryInstance('en'),
  }

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if(currentPSED && currentPSED.fritekst && !_fritekstLoaded){
      setFritekst(currentPSED.fritekst)
      setFritekstLoaded(true)
    }

    if(buc.seds && currentPSED && !currentPSED?.options?.type?.bosettingsstatus){
      const receivedP2200 = buc.seds.find((s) => {
        return s.type === "P2200" && s.status === "received"
      })
      const sentP2200 = buc.seds.find((s) => {
        return s.type === "P2200" && s.status === "sent"
      })

      if(receivedP2200){
        setProperty("bosettingsstatus", "UTL")
        setHideBosettingsStatus(true)
      } else if (sentP2200) {
        setProperty("bosettingsstatus", "NO")
        setHideBosettingsStatus(true)
      } else {
        setProperty("bosettingsstatus", "DUMMY")
      }
    }

    if(currentPSED && !currentPSED?.options?.type?.spraak){
      setProperty("spraak", "nb")
    }

    if(currentPSED && !currentPSED?.pensjon?.anmodning?.referanseTilPerson){
      setProperty("referanseTilPerson", "01")
    }

    if(currentPSED && !currentPSED?.options?.type?.ytelse){
      if(bucType === "03"){
        setProperty("ytelse", "UT")
      } else if(bucType === "01"){
        setProperty("ytelse", "AP")
      } else {
        setProperty("ytelse", "DUMMY")
      }
    }
  }, [currentPSED, bucType])

  useEffect(() => {
    const P8000Type: P8000Type | undefined = currentPSED?.options?.type
    if(P8000Type && bucType && P8000Type.ytelse && P8000Type.bosettingsstatus && P8000Type.spraak){
      setType(P8000Type.ytelse + "_" + P8000Type.bosettingsstatus + "_" + bucType)
    }
  }, [currentPSED?.options?.type])

  useEffect(() => {
    if(sed){
      console.log("BUC: " + buc)
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(getSedP8000(buc.caseId!, sed))
    }

  }, [sed])

  useEffect(() => {
    if(i18n.language !== currentPSED?.options?.type?.spraak){
      i18n.changeLanguage(currentPSED?.options?.type?.spraak)
    }

    let text = ""
    let textArray: Array<string> =  []
    if(currentPSED && currentPSED.options?.ofteEtterspurtInformasjon){
      P8000Variants[_type]?.ofteEtterspurtInformasjon?.map((field: string) => {
        const ofteEtterspurtInformasjon: OfteEtterspurtInformasjon | undefined = currentPSED?.options?.ofteEtterspurtInformasjon
        const key: keyof OfteEtterspurtInformasjon = field as keyof OfteEtterspurtInformasjon

        if(ofteEtterspurtInformasjon && ofteEtterspurtInformasjon[key] && ofteEtterspurtInformasjon[key]?.value && !ofteEtterspurtInformasjon[key]?.doNotGenerateFritekst){
          const country = countryData[i18n.language as keyof typeof countryData].findByValue(ofteEtterspurtInformasjon[key]?.landkode)
          const extra = {
            land: country?.label,
            periodeFra: ofteEtterspurtInformasjon[key]?.periodeFra,
            periodeTil: ofteEtterspurtInformasjon[key]?.periodeTil,
            antallMaaneder: ofteEtterspurtInformasjon[key]?.antallMaaneder
          }

          text = text + t('p8000:' + field, extra) + "\n\n"
          textArray.push(t('p8000:' + field, extra))
        }
      })
    }
    if(currentPSED && currentPSED.options?.informasjonSomKanLeggesInn){
      P8000Variants[_type]?.informasjonSomKanLeggesInn?.map((field: string) => {
        const informasjonSomKanLeggesInn: InformasjonSomKanLeggesInn | undefined = currentPSED?.options?.informasjonSomKanLeggesInn
        const key: keyof InformasjonSomKanLeggesInn = field as keyof InformasjonSomKanLeggesInn

        if(informasjonSomKanLeggesInn && informasjonSomKanLeggesInn[key] && informasjonSomKanLeggesInn[key]?.value && !informasjonSomKanLeggesInn[key]?.doNotGenerateFritekst){
          const country = countryData[i18n.language as keyof typeof countryData].findByValue(informasjonSomKanLeggesInn[key]?.landkode)
          const extra = {
            land: country?.label,
            periodeFra: informasjonSomKanLeggesInn[key]?.periodeFra,
            periodeTil: informasjonSomKanLeggesInn[key]?.periodeTil,
            antallMaaneder: informasjonSomKanLeggesInn[key]?.antallMaaneder
          }
          text = text + t('p8000:' + field, extra) + "\n\n"
          textArray.push(t('p8000:' + field, extra))
        }
      })
    }
    text = _fritekst ? text + "***********************\n" + _fritekst : text
    if(_fritekst){
      textArray.push("***********************")
      textArray.push(_fritekst)
    }

    const fritekstIndex = textArray.indexOf("***********************")
    const numberedTextArray = textArray.map((t: string, idx: number) => {
      if(fritekstIndex > 0 && idx < fritekstIndex || fritekstIndex < 0){
        return (idx+1) + ") " + t + "\n\n"
      } else {
        return t + "\n"
      }
    })
    setYtterligereInformasjon(numberedTextArray.join(""))
  }, [currentPSED, _fritekst])

  useEffect(() => {
    dispatch(updatePSED(`pensjon.ytterligeinformasjon`, "\n" + _ytterligereInformasjon))
  }, [_ytterligereInformasjon])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  const setProperty = (property: string, propValue: string) => {
    let propertyPath;
    if (property === "referanseTilPerson") {
      propertyPath = `pensjon.anmodning.${property}`
    } else {
      propertyPath = `options.type.${property}`
    }
    dispatch(updatePSED(propertyPath, propValue))
  }

  const resetP8000 = () => {
    dispatch(updatePSED("pensjon.anmodning.seder[0].sendFolgendeSEDer", []))
    dispatch(updatePSED("options.ofteEtterspurtInformasjon", undefined))
    dispatch(updatePSED("options.informasjonSomKanLeggesInn", undefined))
  }

  const onToggle = (property: string, propValue: string) => {
    setProperty(property, propValue)
    if(property !== 'spraak' && property !== 'referanseTilPerson'){
      resetP8000()
    }
  }

  const validateP8000Sed = () => {
    const newP8000SED: P8000SED = _.cloneDeep(currentPSED)
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationP8000Props>(clonedValidation, namespace, validateP8000, {
      P8000SED: newP8000SED
    })

    dispatch(setValidation(clonedValidation))

    return hasErrors
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
    UT_NO_03: {
      ofteEtterspurtInformasjon: [
        P5000_MED_BEGRUNNELSE,
        P6000,
        BRUKERS_ADRESSE,
        YTELSESHISTORIKK,
        INNTEKT_FOER_UFOERHET_I_UTLANDET,
        FOLKBOKFOERING,
        OPPLYSNINGER_OM_EPS,
        BRUKERS_SIVILSTAND
      ],
      informasjonSomKanLeggesInn: []
    },
    UT_UTL_05: {},
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
        <BoxWithBorderAndPadding>
          <VStack gap="4">
            <Heading level="1" size="medium">{t('p8000:form-heading-p8000')} ({buc.type?.toUpperCase()} - {t('buc:buc-' + buc.type?.toUpperCase())})</Heading>
            {currentPSED && currentPSED.options && currentPSED.options.type &&
              <HStack gap="4">
                <ToggleGroup
                  value={currentPSED?.options?.type?.spraak}
                  onChange={(v) => onToggle("spraak", v)}
                  label={t('p8000:form-label-velg-spraak')}
                >
                  <ToggleGroup.Item value="nb" label={t('p8000:form-label-spraak-norsk')}/>
                  <ToggleGroup.Item value="en" label={t('p8000:form-label-spraak-engelsk')}/>
                </ToggleGroup>
                {bucType !== "03" && bucType !== "01" &&
                  <ToggleGroup
                    value={currentPSED?.options?.type?.ytelse}
                    onChange={(v) => onToggle("ytelse", v)}
                    label={t('p8000:form-label-velg-ytelse')}
                  >
                    <ToggleGroup.Item value="AP" label={t('p8000:form-label-ytelse-alderspensjon')}/>
                    <ToggleGroup.Item value="UT" label={t('p8000:form-label-ytelse-ufoere')}/>
                  </ToggleGroup>
                }
                {!_hideBosettingsStatus &&
                  <ToggleGroup
                    value={currentPSED?.options?.type?.bosettingsstatus}
                    onChange={(v) => onToggle("bosettingsstatus", v)}
                    label={t('p8000:form-label-velg-bosettingsstatus')}
                  >
                    <ToggleGroup.Item value="NO" label={t('p8000:form-label-bosettingsstatus-norge')}/>
                    <ToggleGroup.Item value="UTL" label={t('p8000:form-label-bosettingsstatus-utland')}/>
                  </ToggleGroup>
                }
                <HStack gap="4" align={"end"}>
                  <ToggleGroup
                    value={currentPSED?.pensjon?.anmodning?.referanseTilPerson}
                    onChange={(v) => onToggle("referanseTilPerson", v)}
                    label={t('p8000:form-label-velg-anmodning-referanseTilPerson')}
                  >
                    <ToggleGroup.Item value="01" label={t('p8000:form-label-anmodning-referanseTilPerson-forsikret')}/>
                    <ToggleGroup.Item value="02" label={t('p8000:form-label-andmodning-referanseTilPerson-annen')}/>
                  </ToggleGroup>
                  {currentPSED?.pensjon?.anmodning?.referanseTilPerson === "02" &&
                    <Alert variant="info" size="small">
                      {t('p8000:form-message-andmodning-referanseTilPerson-annen')}
                    </Alert>
                  }
                </HStack>
              </HStack>
            }
          </VStack>
        </BoxWithBorderAndPadding>
        {_type &&
          <>
            <BoxWithBorderAndPadding>
              <VStack gap="4">
                <Heading level="2" size="small">{t('p8000:form-heading-ofte-etterspurt-informasjon')}</Heading>
                <P8000Fields
                  fields={[
                    {label: P5000, value: P5000, component: SendFolgendeSEDer},
                    {label: P5000, value: P5000_MED_BEGRUNNELSE, component: SendFolgendeSEDerWithBegrunnelse, options: {sed: P5000, radioLabel: "P5000 trengs for"}},
                    {label: P4000, value: P4000, component: SendFolgendeSEDer} ,
                    {label: P6000, value: P6000, component: SendFolgendeSEDer} ,
                    {label: "Brukers adresse", value: BRUKERS_ADRESSE, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Medisinsk informasjon", value: MEDISINSK_INFORMASJON, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Opplysninger om tiltak", value: TILTAK, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Nåværende arbeid: Arbeidstimer per uke og månedsinntekt", value: NAAVAERENDE_ARBEID, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Dokumentasjon på arbeid i Norge", value: DOKUMENTASJON_PAA_ARBEID_I_NORGE, component: CheckboxWithCountryAndPeriods, target: 'options.ofteEtterspurtInformasjon', options: {showCountry: false, showPeriod: true, showMonths: false, excludeNorway: false}},
                    {label: "Ytelseshistorikk", value: YTELSESHISTORIKK, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Inntekt før uførhet i utlandet", value: INNTEKT_FOER_UFOERHET_I_UTLANDET, component: CheckboxWithCountryAndPeriods, target: 'options.ofteEtterspurtInformasjon', options: {showCountry: true, showPeriod: true, showMonths: false, excludeNorway: true}},
                    {label: "IBAN og SWIFT", value: IBAN_SWIFT, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Folkbokföring (SE)", value: FOLKBOKFOERING, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Brukers sivilstand", value: BRUKERS_SIVILSTAND, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                    {label: "Opplysninger om EPS", value: OPPLYSNINGER_OM_EPS, component: CheckboxWithCountryAndPeriods, target: 'options.ofteEtterspurtInformasjon', options: {showCountry: true, showPeriod: false, showMonths: false, excludeNorway: true}},
                    {label: "Person uten p.nr/d.nr", value: PERSON_UTEN_PNR_DNR, component: CheckBoxField, target: 'options.ofteEtterspurtInformasjon'},
                  ]}
                  variant={P8000Variants[_type]?.ofteEtterspurtInformasjon}
                  PSED={currentPSED}
                  updatePSED={updatePSED}
                  namespace={namespace + '-ofteEtterspurtInformasjon'}
                />
              </VStack>
            </BoxWithBorderAndPadding>
            {P8000Variants[_type]?.informasjonSomKanLeggesInn.length > 0 &&
              <BoxWithBorderAndPadding>
                <VStack gap="4">
                  <Heading level="2" size="small">{t('p8000:form-heading-informasjon-som-kan-legges-inn')}</Heading>
                  <P8000Fields
                    fields={[
                      {label: "Legg til saksbehandlingstid", value: SAKSBEHANDLINGSTID, component: CheckboxWithCountryAndPeriods, target: 'options.informasjonSomKanLeggesInn', options: {showCountry: false, showPeriod: false, showMonths: true, excludeNorway: false}},
                      {label: "P5000 trengs for å fylle ut P5000NO", value: P5000_FOR_P5000NO, component: CheckBoxField, target: 'options.informasjonSomKanLeggesInn'},
                    ]}
                    variant={P8000Variants[_type]?.informasjonSomKanLeggesInn}
                    PSED={currentPSED}
                    updatePSED={updatePSED}
                    namespace={namespace + '-informasjonSomKanLeggesInn'}
                  />
                </VStack>
              </BoxWithBorderAndPadding>
            }
            <BoxWithBorderAndPadding>
              <UtenlandskePin
                PSED={currentPSED}
                parentNamespace={namespace}
                parentTarget="nav.bruker"
                updatePSED={updatePSED}
              />
            </BoxWithBorderAndPadding>
            <BoxWithBorderAndPadding>
              <UtenlandskeSaksnr
                PSED={currentPSED}
                parentNamespace={namespace}
                parentTarget="nav"
                updatePSED={updatePSED}
              />
            </BoxWithBorderAndPadding>
            <BoxWithBorderAndPadding>
              <VStack gap="4">
                <Textarea label={t('p8000:form-legg-til-fritekst')} value={_fritekst ?? ""} onChange={(e) => setFritekst(e.target.value)}/>
                <Textarea label={t('p8000:form-forhaandsvisning-av-tekst')} value={_ytterligereInformasjon ?? ""} maxLength={2500}/>
              </VStack>
            </BoxWithBorderAndPadding>
          </>
        }
        <ValidationBox heading={t('message:error-validationbox-sedstart')} validation={validation} />
        <SaveAndSendSED
          namespace={namespace}
          sakId={buc!.caseId!}
          sedId={sed!.id}
          sedType={sed!.type}
          setMode={setMode}
          validateCurrentPSED={validateP8000Sed}
          mottakere={currentPSED?.originalSed?.status === 'new' && buc?.type !== 'P_BUC_05' ? bucDeltakere! : undefined}
        />
      </VStack>
    </>
  )
}

export default P8000
