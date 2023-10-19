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
import Input from "../../../components/Forms/Input";
import DateField from "../DateField/DateField";
import {dateToString} from "../../../utils/utils";
import {HorizontalRadioGroup} from "../../../components/StyledComponents";

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

  const setEtternavn = (etternavn: string) => {
    dispatch(updatePSED(`${target}.person.etternavn`, etternavn))
  }

  const setFornavn = (fornavn: string) => {
    dispatch(updatePSED(`${target}.person.fornavn`, fornavn))
  }

  const setFoedselsDato = (foedselsdato: Date | undefined) => {
    if(foedselsdato){
      const dateString = dateToString(foedselsdato)
      dispatch(updatePSED(`${target}.person.foedselsdato`, dateString))
    }
  }

  const setKjoenn = (kjoenn: string) => {
    dispatch(updatePSED(`${target}.person.kjoenn`, kjoenn))
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
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-person-etternavn']?.feilmelding}
              namespace={namespace}
              id='person-etternavn'
              label={t('p2000:form-person-etternavn')}
              onChanged={setEtternavn}
              value={(ektefelle?.person?.etternavn) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-person-fornavn']?.feilmelding}
              namespace={namespace}
              id='person-fornavn'
              label={t('p2000:form-person-fornavn')}
              onChanged={setFornavn}
              value={(ektefelle?.person?.fornavn)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <DateField
              id='person-foedselsdato'
              index={0}
              label={t('p2000:form-person-foedselsdato')}
              error={validation[namespace + '-person-foedselsdato']?.feilmelding}
              namespace={namespace}
              onChanged={(e) => setFoedselsDato(e)}
              defaultDate={ektefelle?.person.foedselsdato}
            />
          </Column>
          <Column>
            <HorizontalRadioGroup
              error={validation[namespace + '-person-kjoenn']?.feilmelding}
              id={namespace + "-person-kjoenn"}
              legend={t('p2000:form-person-kjoenn')}
              onChange={(e: any) => setKjoenn(e)}
              value={ektefelle?.person.kjoenn}
            >
              <Radio value="M">Mann</Radio>
              <Radio value="K">Kvinne</Radio>
              <Radio value="">Ukjent</Radio>
            </HorizontalRadioGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <UtenlandskePin
          PSED={PSED}
          parentNamespace={namespace}
          parentTarget={target}
          updatePSED={updatePSED}
        />
        <VerticalSeparatorDiv/>
      </PaddedDiv>
    </>
  )
}

export default Ektefelle
