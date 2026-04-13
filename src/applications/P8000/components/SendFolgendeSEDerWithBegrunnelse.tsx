import React, {JSX, useEffect} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {SendFolgendeSEDerEllerDokumenter} from "src/applications/P8000/components/SendFolgendeSEDerEllerDokumenter";
import {Box, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {P8000Field} from "src/declarations/p8000";
import {useTranslation} from "react-i18next";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "src/applications/P2000/MainForm";
import {useAppSelector} from "src/store";
import {resetValidation} from "src/actions/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

export const SendFolgendeSEDerWithBegrunnelse: React.FC<P8000FieldComponentProps> = ({
  label, PSED, updatePSED, options, value, namespace, variantType
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const {t, i18n} = useTranslation()
  const target = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const targetBegrunnelse = "pensjon.anmodning.seder[0].begrunnelse"
  const targetOptions = "options.ofteEtterspurtInformasjon"
  const sendFolgendeSEDer: Array<string> | undefined = _.get(PSED, target) as Array<string> | undefined
  const { validation } = useAppSelector(mapState)

  const field: P8000Field = _.get(PSED, `${targetOptions}.${value}`)

  let checked= !!_.find(sendFolgendeSEDer, (sed) => sed === options.sed.toLowerCase())

  const spraak = PSED?.options?.type?.spraak ?? i18n.language ?? 'nb'

  const setBegrunnelse = (propValue: string) => {
    dispatch(updatePSED(`${targetOptions}.${value}.begrunnelseForKravet`, propValue))
    if(propValue === "sammenlegging"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-sammenlegging', { lng: spraak })))
    } else if (propValue === "endelig_beregning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-endelig-beregning', { lng: spraak })))
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
    if(field && field.begrunnelseForKravet && field.begrunnelseForKravet === "sammenlegging"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-sammenlegging', { lng: spraak })))
    } else if (field && field.begrunnelseForKravet && field.begrunnelseForKravet === "endelig_beregning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-endelig-beregning', { lng: spraak })))
    }
  }, [PSED?.options?.type?.spraak])

  return (
    <VStack>
      <SendFolgendeSEDerEllerDokumenter
        PSED={PSED}
        updatePSED={updatePSED}
        label={label}
        value={options.sed}
        target={target}
        variantType={variantType}
      />
      {checked &&
        <Box
          paddingBlock="space-8 space-16"
          paddingInline="space-16 space-0"
          borderWidth="1"
          borderRadius="4"
          borderColor="neutral-subtle"
          background="neutral-soft"
        >
          <RadioGroup
            legend={options.radioLabel}
            value={field?.begrunnelseForKravet ?? ''}
            error={validation[namespace + "-" + value + "-begrunnelseForKravet"]?.feilmelding}
            id={namespace + '-' + value + '-begrunnelseForKravet'}
            name={namespace + '-' + value + '-begrunnelseForKravet'}
            onChange={setBegrunnelse}
          >
            <HStack gap="space-16">
              <Radio value='sammenlegging'>
                {t('p8000:form-label-sammenlegging')}
              </Radio>
              <Radio value='endelig_beregning'>
                {t('p8000:form-label-endelig-beregning')}
              </Radio>
            </HStack>
          </RadioGroup>

        </Box>
      }
    </VStack>
  );
}
