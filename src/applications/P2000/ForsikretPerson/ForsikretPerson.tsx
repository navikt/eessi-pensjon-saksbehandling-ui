import {Heading} from "@navikt/ds-react";
import {VerticalSeparatorDiv, PaddedDiv} from "@navikt/hoykontrast";
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {Person} from "declarations/p2000";
import _ from "lodash";
import {State} from "declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "store";
import {setValidation} from "actions/validation";
import UtenlandskePin from "../UtenlandskePin/UtenlandskePin";
import FamilieStatus from "../FamilieStatus/FamilieStatus";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateForsikretPerson, ValidationForsikretPersonProps} from "./validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
  bucMode: state.buc.bucMode
})

const ForsikretPerson: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const { validation, bucMode } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-forsikretperson`
  const target = 'nav.bruker.person'
  const forsikretPerson:  Person | undefined = _.get(PSED, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationForsikretPersonProps>(
      clonedvalidation, namespace, validateForsikretPerson, {
        forsikretPerson
      }, true
    )
    if(bucMode === parentNamespace){
      dispatch(setValidation(clonedvalidation))
    }
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
        />
        <FamilieStatus
          PSED={PSED}
          parentNamespace={namespace}
          parentTarget={target}
          updatePSED={updatePSED}
        />
      </PaddedDiv>
    </>
  )
}

export default ForsikretPerson
