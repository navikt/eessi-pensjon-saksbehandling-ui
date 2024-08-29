import {Heading} from "@navikt/ds-react";
import {VerticalSeparatorDiv, PaddedDiv} from "@navikt/hoykontrast";
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {Person} from "src/declarations/p2000";
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {setValidation} from "src/actions/validation";
import UtenlandskePin from "../UtenlandskePin/UtenlandskePin";
import FamilieStatus from "../FamilieStatus/FamilieStatus";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateForsikretPerson, ValidationForsikretPersonProps} from "./validation";
import Telefon from "../Telefon/Telefon";
import Epost from "../Epost/Epost";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const ForsikretPerson: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED,
  countryCodes
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-forsikretperson`
  const target = 'nav.bruker'
  const forsikretPerson:  Person | undefined = _.get(PSED, target + '.person')

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationForsikretPersonProps>(
      clonedvalidation, namespace, validateForsikretPerson, {
        forsikretPerson
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        <UtenlandskePin
          PSED={PSED}
          parentNamespace={namespace}
          parentTarget={target}
          updatePSED={updatePSED}
          countryCodes={countryCodes}
        />
        <VerticalSeparatorDiv/>
        <FamilieStatus
          PSED={PSED}
          parentNamespace={namespace}
          parentTarget={target}
          updatePSED={updatePSED}
        />
        <VerticalSeparatorDiv/>
        <Telefon PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/>
        <VerticalSeparatorDiv/>
        <Epost PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/>
      </PaddedDiv>
    </>
  )
}

export default ForsikretPerson
