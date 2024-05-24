import {Heading, Radio, RadioGroup} from "@navikt/ds-react";
import {VerticalSeparatorDiv, PaddedDiv, AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {Ektefelle as P2000Ektefelle} from "declarations/p2000";
import _ from "lodash";
import {State} from "declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "store";
import {setValidation} from "actions/validation";
import UtenlandskePin from "../UtenlandskePin/UtenlandskePin";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateEktefelle, ValidationEktefelleProps} from "./validation";
import {useTranslation} from "react-i18next";
import PersonOpplysninger from "../PersonOpplysninger/PersonOpplysninger";
import Foedested from "../Foedested/Foedested";


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
  const ektefelle:  P2000Ektefelle | undefined = _.get(PSED, target)

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
  }

  const setEktefelleFoedested = (property: string, value: string) => {
    dispatch(updatePSED(`${target}.person.foedested.${property}`, value))
  }


  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <RadioGroup
              error={validation[namespace + '-type']?.feilmelding}
              id={namespace + "-type"}
              legend={t('p2000:form-ektefelle-type')}
              onChange={(e: any) => setType(e)}
              value={ektefelle?.type}
            >
              <Radio value="01">Ektefelle</Radio>
              <Radio value="02">Partner i registrert partnerskap</Radio>
              <Radio value="03">Samboer</Radio>
            </RadioGroup>
          </Column>
        </AlignStartRow>
        <PersonOpplysninger setPersonOpplysninger={setEktefellePersonalia} person={ektefelle?.person} parentNamespace={namespace}/>
        <VerticalSeparatorDiv/>
        <UtenlandskePin
          PSED={PSED}
          parentNamespace={namespace}
          parentTarget={target}
          updatePSED={updatePSED}
        />
        <VerticalSeparatorDiv/>
        <Foedested setPersonOpplysninger={setEktefelleFoedested} person={ektefelle?.person} parentNamespace={namespace}/>
        <VerticalSeparatorDiv/>
      </PaddedDiv>
    </>
  )
}

export default Ektefelle
