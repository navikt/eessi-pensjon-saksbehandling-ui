import {VStack, Heading, Radio, RadioGroup, Box} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {resetValidation, setValidation} from "src/actions/validation";
import {useAppSelector} from "src/store";
import UtenlandskePin from "src/components/UtenlandskePin/UtenlandskePin";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateEktefelle, ValidationEktefelleProps} from "./validation";
import {useTranslation} from "react-i18next";
import PersonOpplysninger from "../PersonOpplysninger/PersonOpplysninger";
import FoedestedFC from "../Foedested/Foedested";
import Statsborgerskap from "../Statsborgerskap/Statsborgerskap";
import {deletePSEDProp} from "src/actions/buc";
import {Ektefelle as P2000Ektefelle} from "src/declarations/sed";


const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Ektefelle: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-ektefelle`
  const target = 'nav.ektefelle'
  const ektefelle:  P2000Ektefelle | undefined  = _.get(PSED, target) as P2000Ektefelle | undefined

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationEktefelleProps>(
      clonedvalidation, namespace, validateEktefelle, {
        ektefelle
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setType = (type: string) => {
    dispatch(updatePSED(`${target}.type`, type))
  }

  const setEktefellePersonalia = (property: string, value: string) => {
    dispatch(updatePSED(`${target}.person.${property}`, value))
    if(validation[namespace + '-person-' + property]){
      dispatch(resetValidation(namespace + '-person-' + property))
    }
  }

  const setEktefelleFoedested = (property: string, value: string) => {
    if(value === undefined){
      dispatch(deletePSEDProp(`${target}.person.foedested.${property}`))
    } else {
      dispatch(updatePSED(`${target}.person.foedested.${property}`, value))
    }
  }

  useEffect(() => {
    if(ektefelle?.person?.foedested && _.isEmpty(ektefelle?.person?.foedested)){
      dispatch(deletePSEDProp(`${target}.person.foedested`))
    }
    if(ektefelle?.person?.pin && _.isEmpty(ektefelle?.person?.pin)){
      dispatch(deletePSEDProp(`${target}.person.pin`))
    }
  }, [ektefelle])

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        <RadioGroup
          error={validation[namespace + '-type']?.feilmelding}
          id={namespace + "-type"}
          legend={t('p2000:form-ektefelle-type')}
          onChange={(e: any) => setType(e)}
          value={ektefelle?.type ?? ''}
        >
          <Radio value="ektefelle">Ektefelle</Radio>
          <Radio value="part_i_et_registrert_partnerskap">Partner i registrert partnerskap</Radio>
          <Radio value="samboer">Samboer</Radio>
        </RadioGroup>
        <Box>
          <PersonOpplysninger setPersonOpplysninger={setEktefellePersonalia} person={ektefelle?.person} parentNamespace={namespace}/>
        </Box>
        <Box>
          <UtenlandskePin
            PSED={PSED}
            parentNamespace={namespace}
            parentTarget={target}
            updatePSED={updatePSED}
          />
        </Box>
        <Box>
          <FoedestedFC setPersonOpplysninger={setEktefelleFoedested} person={ektefelle?.person} parentNamespace={namespace}/>
        </Box>
        <Box>
          <Statsborgerskap parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED} person={ektefelle?.person}/>
        </Box>
      </VStack>
    </Box>
  )
}

export default Ektefelle
