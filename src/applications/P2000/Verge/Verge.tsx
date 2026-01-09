import React, {JSX} from "react";
import {useDispatch} from "react-redux";
import Input from "../../../components/Forms/Input";
import _ from "lodash";
import {Box, Heading, HGrid, VStack} from "@navikt/ds-react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import Telefon from "../Telefon/Telefon";
import Epost from "../Epost/Epost";
import {State} from "src/declarations/reducers";
import {useAppSelector} from "src/store";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateVerge, ValidationVergeProps} from "./validation";
import {resetValidation, setValidation} from "src/actions/validation";
import {useTranslation} from "react-i18next";
import Adresse from "../Adresse/Adresse";
import TextArea from "../../../components/Forms/TextArea";
import {Verge as P2000Verge} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Verge: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED,
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-verge`
  const target = 'nav.verge'
  const verge: P2000Verge | undefined = _.get(PSED, target) as P2000Verge | undefined

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationVergeProps>(
      clonedvalidation, namespace, validateVerge, {
        verge
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setEtternavn = (etternavn: string) => {
    dispatch(updatePSED(`${target}.person.etternavn`, etternavn))
    if(validation[namespace + '-person-etternavn']){
      dispatch(resetValidation(namespace + '-person-etternavn'))
    }
  }

  const setFornavn = (fornavn: string) => {
    dispatch(updatePSED(`${target}.person.fornavn`, fornavn))
    if(validation[namespace + '-person-fornavn']){
      dispatch(resetValidation(namespace + '-person-fornavn'))
    }
  }

  const setVergemaalMandat = (mandat: string) => {
    dispatch(updatePSED(`${target}.vergemaal.mandat`, mandat))
    if(validation[namespace + '-vergemaal-mandat']){
      dispatch(resetValidation(namespace + '-vergemaal-mandat'))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        <Heading size='small'>
          Informasjon om representant/verge
        </Heading>
        <HGrid gap="4" columns={2} align="start">
          <Input
            error={validation[namespace + '-person-etternavn']?.feilmelding}
            namespace={namespace}
            id='person-etternavn'
            label={t('p2000:form-person-etternavn')}
            onChanged={setEtternavn}
            value={(verge?.person?.etternavn) ?? ''}
          />
          <Input
            error={validation[namespace + '-person-fornavn']?.feilmelding}
            namespace={namespace}
            id='person-fornavn'
            label={t('p2000:form-person-fornavn')}
            onChanged={setFornavn}
            value={(verge?.person?.fornavn)  ?? ''}
          />
        </HGrid>
        <TextArea
          error={validation[namespace + '-vergemaal-mandat']?.feilmelding}
          namespace={namespace}
          id='vergemaal-mandat'
          label={t('p2000:form-verge-vergemaal-mandat')}
          onChanged={setVergemaalMandat}
          value={(verge?.vergemaal?.mandat)  ?? ''}
          maxLength={255}
        />
        <Heading size="small">{t('p2000:form-adresse')}</Heading>
        <Adresse PSED={PSED} updatePSED={updatePSED} parentNamespace={namespace} parentTarget={target}/>
        <Box><Telefon PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
        <Box><Epost PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
      </VStack>
    </Box>
  )
}

export default Verge
