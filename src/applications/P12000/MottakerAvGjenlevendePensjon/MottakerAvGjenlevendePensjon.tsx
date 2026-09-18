import {Box, Heading, VStack} from "@navikt/ds-react";
import React, {JSX} from "react";
import {MainFormProps, MainFormSelector} from 'src/applications/MainForm'
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {resetValidation, setValidation} from "src/actions/validation";
import {useAppSelector} from "src/store";
import useUnmount from "src/hooks/useUnmount";
import performValidation from "src/utils/performValidation";
import PersonOpplysninger from "src/components/PersonOpplysninger/PersonOpplysninger";
import {validatePerson, ValidationPersonProps} from "src/components/PersonOpplysninger/validation";
import {Gjenlevende, P12000SED} from "src/declarations/p12000";
import {createSelector} from "@reduxjs/toolkit";

const mapState = createSelector(
  (state: State) => state.validation.status,
  (validation): MainFormSelector => ({
    validation,
  })
)

const MANDATORY_IF_ANY_FILLED = ['etternavn', 'fornavn', 'foedselsdato', 'kjoenn']

const MottakerAvGjenlevendePensjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-mottakeravgjenlevendepensjon`
  const target = 'pensjon.gjenlevende'
  const gjenlevende: Gjenlevende | undefined = _.get(PSED as P12000SED, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationPersonProps>(
      clonedvalidation, namespace, validatePerson, {
        person: gjenlevende?.person,
        requiredIfAnyFilled: true
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPersonOpplysninger = (property: string, value: string) => {
    dispatch(updatePSED(`${target}.person.${property}`, value))
    if(validation[namespace + '-person-' + property]){
      dispatch(resetValidation(namespace + '-person-' + property))
    }

    const updatedPerson = {...gjenlevende?.person, [property]: value}
    const stillFilled = MANDATORY_IF_ANY_FILLED.some((p) => !_.isEmpty(_.get(updatedPerson, p)?.trim()))
    if(!stillFilled){
      MANDATORY_IF_ANY_FILLED.forEach((p) => {
        if(validation[namespace + '-person-' + p]){
          dispatch(resetValidation(namespace + '-person-' + p))
        }
      })
    }
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='medium'>
          {label}
        </Heading>
        <Box>
          <PersonOpplysninger
            setPersonOpplysninger={setPersonOpplysninger}
            person={gjenlevende?.person}
            parentNamespace={namespace}
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default MottakerAvGjenlevendePensjon
