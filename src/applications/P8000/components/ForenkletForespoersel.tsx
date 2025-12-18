import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {SendFolgendeSEDerEllerDokumenter} from "src/applications/P8000/components/SendFolgendeSEDerEllerDokumenter";
import {Box, Checkbox, HStack, TextField, VStack} from "@navikt/ds-react";
import {P8000Field} from "src/declarations/p8000";
import {useTranslation} from "react-i18next";
import i18n from "i18next";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "src/applications/P2000/MainForm";
import {useAppSelector} from "src/store";
import {resetValidation} from "src/actions/validation";
import {hasFourDigits} from "src/utils/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

export const ForenkletForespoersel: React.FC<P8000FieldComponentProps> = ({
  label, PSED, updatePSED, options, value, namespace
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const target = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const targetBegrunnelse = "pensjon.anmodning.seder[0].begrunnelse"
  const targetOptions = "options.ofteEtterspurtInformasjon"
  const sendFolgendeSEDer: Array<string> | undefined = _.get(PSED, target) as Array<string> | undefined
  const forenkletForespoersel: P8000Field = _.get(PSED, targetOptions + ".forenkletForespoersel")
  const { validation } = useAppSelector(mapState)

  const field: P8000Field = _.get(PSED, `${targetOptions}.${value}`)

  let checked= !!_.find(sendFolgendeSEDer, (sed) => sed === options.sed.toLowerCase())

  const setHarIkkeUtenlandskPIN = (propValue: boolean) => {
    dispatch(updatePSED(`${targetOptions}.${value}.harIkkeUtenlandskPIN`, propValue))
    setBegrunnelse(propValue)
  }

  const setProperty = (property: string, propValue: string) => {
    dispatch(updatePSED(`${targetOptions}.${value}.${property}`, propValue))
  }

  const setBegrunnelse = (hasPin?: boolean) => {
    if(forenkletForespoersel && forenkletForespoersel.periodeFra  && forenkletForespoersel.periodeTil){
      const fra = forenkletForespoersel.periodeFra
      const til = forenkletForespoersel.periodeTil
      const harIkkeUtenlandskPIN = forenkletForespoersel.harIkkeUtenlandskPIN
      const ytelse = PSED?.options?.type?.ytelse

      if(hasFourDigits(fra) && hasFourDigits(til)){
        const txt = t('p8000:forenkletForespoersel-' + ytelse, {lng: i18n.language, periodeFra: fra, periodeTil: til})
        let pinTxt = ""
        if(hasPin !== undefined){
          pinTxt = hasPin ? t('p8000:forenkletForespoersel-nopin', {lng: i18n.language}) : ""
        } else {
          pinTxt = harIkkeUtenlandskPIN ? t('p8000:forenkletForespoersel-nopin', {lng: i18n.language}) : ""
        }

        const begrunnelse = txt + " " + pinTxt
        dispatch(updatePSED(`${targetBegrunnelse}`, begrunnelse))
      }
    }
  }


  if(!checked && field){
    dispatch(updatePSED(`${targetOptions}.${value}`, undefined))
    dispatch(updatePSED(`${targetBegrunnelse}`, undefined))
    dispatch(resetValidation(namespace + '-' + value))
  }

  if(checked && !field){
    dispatch(updatePSED(`${targetOptions}.${value}.value`, true))
    dispatch(updatePSED(`${targetOptions}.${value}.doNotGenerateFritekst`, true))
  }

  useEffect(() => {
    if(i18n.language !== PSED?.options?.type?.spraak){
      i18n.changeLanguage(PSED?.options?.type?.spraak)
    }
    setBegrunnelse()
  }, [PSED?.options?.type?.spraak])

  return (
    <VStack>
      <SendFolgendeSEDerEllerDokumenter
        PSED={PSED}
        updatePSED={updatePSED}
        label={label}
        value={options.sed}
        target={target}
      />
      {checked &&
        <Box
          paddingBlock="2 4"
          paddingInline="4 0"
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-subtle"
          background="surface-subtle"
        >
          <VStack gap="4">
            <HStack
              gap="4"
              align="start"
            >
              <TextField
                id={namespace + "-" + value + "-periodeFra"}
                error={!!validation[namespace + "-" + value + "-periodeFra"]?.feilmelding}
                style={{maxWidth: "5rem"}}
                label={t('p8000:form-label-fra')}
                hideLabel={false}
                value={field?.periodeFra}
                onChange={(e) => setProperty('periodeFra', e.target.value)}
                onBlur={() => setBegrunnelse()}
              />
              <TextField
                id={namespace + "-" + value + "-periodeTil"}
                error={!!validation[namespace + "-" + value + "-periodeTil"]?.feilmelding}
                style={{maxWidth: "5rem"}}
                label={t('p8000:form-label-til')}
                hideLabel={false}
                value={field?.periodeTil}
                onChange={(e) => setProperty('periodeTil', e.target.value)}
                onBlur={() => setBegrunnelse()}
              />
            </HStack>
            <Checkbox
              checked={field?.harIkkeUtenlandskPIN ? field?.harIkkeUtenlandskPIN : false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHarIkkeUtenlandskPIN(e.target.checked)}
            >
              {t('p8000:form-label-bruker-har-ikke-utenlandsk-pin')}
            </Checkbox>
          </VStack>

        </Box>
      }
    </VStack>
  )
}
