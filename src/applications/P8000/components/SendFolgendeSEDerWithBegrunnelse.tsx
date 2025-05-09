import React from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {P8000FieldComponentProps} from "src/applications/P8000/P8000";
import {SendFolgendeSEDer} from "src/applications/P8000/components/SendFolgendeSEDer";
import {Box, HStack, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {P8000Field} from "src/declarations/p8000";

export const SendFolgendeSEDerWithRadio: React.FC<P8000FieldComponentProps> = ({
  label, PSED, updatePSED, options, value
}: P8000FieldComponentProps): JSX.Element => {
  const dispatch = useDispatch()
  const target = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const sendFolgendeSEDer: Array<string> = _.get(PSED, target)

  const field: P8000Field = _.get(PSED, `options.ofteEtterspurtInformasjon.${value}`)
  console.log(field)

  const checked= !!_.find(sendFolgendeSEDer, (sed) => sed === options.sed.toLowerCase())

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
            value={field?.begrunnelseForKravet}
            error={false}
            id={""}
            name={""}
            onChange={()=> {}}
          >
            <HStack gap="4">
              <Radio value='sammenligning'>
                Sammeligning
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
