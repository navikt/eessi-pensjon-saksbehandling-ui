import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {SendFolgendeSEDer} from "src/applications/P8000/components/SendFolgendeSEDer";
import {Box, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {P8000Field} from "src/declarations/p8000";
import {useTranslation} from "react-i18next";
import i18n from "i18next";

export const SendFolgendeSEDerWithBegrunnelse: React.FC<P8000FieldComponentProps> = ({
  label, PSED, updatePSED, options, value, namespace
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const target = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const targetBegrunnelse = "pensjon.anmodning.seder[0].begrunnelse"
  const targetOptions = "options.ofteEtterspurtInformasjon"
  const sendFolgendeSEDer: Array<string> = _.get(PSED, target)

  const field: P8000Field = _.get(PSED, `${targetOptions}.${value}`)

  let checked= !!_.find(sendFolgendeSEDer, (sed) => sed === options.sed.toLowerCase())

  const setBegrunnelse = (propValue: string) => {
    dispatch(updatePSED(`${targetOptions}.${value}.begrunnelseForKravet`, propValue))
    if(propValue === "sammenligning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-sammenligning')))
    } else if (propValue === "endelig_beregning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-endelig-beregning')))
    }
  }

  if(!checked && field){
    dispatch(updatePSED(`${targetOptions}.${value}`, undefined))
    dispatch(updatePSED(`${targetBegrunnelse}`, undefined))
  }

  useEffect(() => {
    if(i18n.language !== PSED?.options?.type?.spraak){
      i18n.changeLanguage(PSED?.options?.type?.spraak)
    }
    if(field && field.begrunnelseForKravet && field.begrunnelseForKravet === "sammenligning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-sammenligning')))
    } else if (field && field.begrunnelseForKravet && field.begrunnelseForKravet === "endelig_beregning"){
      dispatch(updatePSED(`${targetBegrunnelse}`, t('p8000:P5000-begrunnelse-endelig-beregning')))
    }
  }, [PSED?.options?.type?.spraak])

  return (
    <VStack>
      <SendFolgendeSEDer
        PSED={PSED}
        updatePSED={updatePSED}
        label={label}
        value={options.sed}
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
          <RadioGroup
            legend={options.radioLabel}
            value={field?.begrunnelseForKravet ?? ''}
            error={false}
            id={namespace + '-' + value + '-begrunnelseForKravet'}
            name={namespace + '-' + value + '-begrunnelseForKravet'}
            onChange={setBegrunnelse}
          >
            <HStack gap="4">
              <Radio value='sammenligning'>
                Sammenligning
              </Radio>
              <Radio value='endelig_beregning'>
                Endelig beregning
              </Radio>
            </HStack>
          </RadioGroup>

        </Box>
      }
    </VStack>
  )
}
