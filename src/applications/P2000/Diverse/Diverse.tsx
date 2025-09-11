import {Box, Checkbox, CheckboxGroup, Heading, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {setValidation} from "src/actions/validation";
import useUnmount from "src/hooks/useUnmount";
import performValidation from "src/utils/performValidation";
import {validateDiverse, ValidationDiverseProps} from "./validation";
import DateField from "../DateField/DateField";
import {useTranslation} from "react-i18next";
import {P2000SED, P2000Pensjon} from "src/declarations/p2000";
import {TopAlignedGrid} from "src/components/StyledComponents";
import Utsettelse from "../Utsettelse/Utsettelse";
import Institusjon from "../Institusjon/Institusjon";
import TextArea from "../../../components/Forms/TextArea";
import {Nav} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Diverse: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-diverse-pensjon`
  const target = 'pensjon'
  const pensjon: P2000Pensjon = _.get(PSED as P2000SED, target)
  const nav: Nav = _.get(PSED as P2000SED, "nav")


  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationDiverseProps>(
      clonedvalidation, namespace, validateDiverse, {
        pensjon
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPensjonProperty = (property: string, value: string | undefined) => {
    dispatch(updatePSED(`${target}.${property}`, value))
  }

  const setNavProperty  = (property: string, value: string | undefined)=>{
    dispatch(updatePSED(`nav.${property}`, value))
  }

  const setPensjonArrayProperty = (prop: string, value: string[]) => {
    if(value && value.some(v => v!=="")){
      const filteredValue = value.filter(v => v!=="")
      dispatch(updatePSED(`${target}.${prop}`, filteredValue))
    } else {
      dispatch(updatePSED(`${target}.${prop}`, null))
    }

    if(prop === 'vedlegg' && value && value.some(v => v!== 'annet')){
      dispatch(updatePSED(`${target}.vedleggandre`, null))
    }
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        <TopAlignedGrid columns={2} gap="4">
          <DateField
            id={namespace + '-kravDato'}
            index={0}
            label={t('p2000:form-diverse-pensjon-kravdato')}
            error={validation[namespace + '-kravDato']?.feilmelding}
            namespace={namespace}
            onChanged={(v) => setNavProperty("krav.dato", v)}
            dateValue={nav?.krav?.dato ?? ''}
          />
        </TopAlignedGrid>
        <TopAlignedGrid columns={2} gap="4">
          <DateField
            id={namespace + '-forespurtstartdato'}
            description={t('p2000:form-diverse-pensjon-forespurtstartdato-description')}
            index={0}
            label={t('p2000:form-diverse-pensjon-forespurtstartdato')}
            error={validation[namespace + '-forespurtstartdato']?.feilmelding}
            namespace={namespace}
            onChanged={(v) => setPensjonProperty("forespurtstartdato", v)}
            dateValue={pensjon?.forespurtstartdato ?? ''}
          />
          <RadioGroup className={"horizontalRadioGroup"}
            error={validation[namespace + '-angitidligstdato']?.feilmelding}
            id={namespace + "-angitidligstdato"}
            legend={t('p2000:form-diverse-pensjon-angitidligstdato')}
            onChange={(v) => setPensjonProperty("angitidligstdato", v)}
            value={pensjon?.angitidligstdato}
            description={<>&nbsp;</>}
          >
            <Radio value="ja">Ja</Radio>
            <Radio value="nei">Nei</Radio>
          </RadioGroup>
        </TopAlignedGrid>
        <Box><Utsettelse PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
        <TopAlignedGrid columns={2} gap="4">
          <CheckboxGroup
            legend={t('p2000:form-diverse-pensjon-mottaker')}
            error={validation[namespace + '-mottaker']?.feilmelding}
            id={namespace + "-mottaker"}
            value={pensjon?.mottaker ? pensjon?.mottaker : [""]}
            onChange={(v) => setPensjonArrayProperty('mottaker', v)}
          >
            <Checkbox value="forsikret_person">Forsikret person</Checkbox>
            <Checkbox value="representant_eller_verge">Representant/verge</Checkbox>
          </CheckboxGroup>
          <CheckboxGroup
            error={validation[namespace + '-trekkgrunnlag']?.feilmelding}
            id={namespace + "-trekkgrunnlag"}
            legend={t('p2000:form-diverse-pensjon-trekkgrunnlag')}
            value={pensjon?.trekkgrunnlag ? pensjon?.trekkgrunnlag : [""]}
            onChange={(v) => setPensjonArrayProperty('trekkgrunnlag', v)}
          >
            <Checkbox value="987_2009_Art_72_1">987/2009: Art. 72 (1)</Checkbox>
            <Checkbox value="987_2009_Art_72_2">987/2009: Art. 72 (2)</Checkbox>
            <Checkbox value="987_2009_Art_72_3">987/2009: Art. 72 (3)</Checkbox>
          </CheckboxGroup>
        </TopAlignedGrid>
        <Box><Institusjon PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
        <CheckboxGroup
          legend={t('p2000:form-diverse-pensjon-vedlegg')}
          error={validation[namespace + '-vedlegg']?.feilmelding}
          id={namespace + "-vedlegg"}
          value={pensjon?.vedlegg ? pensjon?.vedlegg : [""]}
          onChange={(v) => setPensjonArrayProperty('vedlegg', v)}
        >
          <Checkbox value="medisinsk_dokumentasjon">Medisinsk dokumentasjon</Checkbox>
          <Checkbox value="utførlig_medisinsk_rapport">Utførlig medisinsk rapport</Checkbox>
          <Checkbox value="arbeidsattester">Arbeidsattester</Checkbox>
          <Checkbox value="annet">Annet</Checkbox>
        </CheckboxGroup>
        {pensjon?.vedlegg?.some(v => v==="annet") &&
          <TextArea
            error={validation[namespace + '-vedleggandre']?.feilmelding}
            namespace={namespace}
            id='vedleggandre'
            label={t('p2000:form-diverse-pensjon-vedleggandre')}
            onChanged={(v) => setPensjonProperty('vedleggandre', v)}
            value={pensjon?.vedleggandre ?? ''}
            maxLength={255}
          />
        }
        <TextArea
          error={validation[namespace + '-etterspurtedokumenter']?.feilmelding}
          namespace={namespace}
          id='etterspurtedokumenter'
          label={t('p2000:form-diverse-pensjon-etterspurtedokumenter')}
          onChanged={(v) => setPensjonProperty('etterspurtedokumenter', v)}
          value={pensjon?.etterspurtedokumenter ?? ''}
          maxLength={255}
        />
        <TextArea
          error={validation[namespace + '-ytterligeinformasjon']?.feilmelding}
          namespace={namespace}
          id='ytterligeinformasjon'
          label={t('p2000:form-diverse-pensjon-ytterligeinformasjon')}
          onChanged={(v) => setPensjonProperty('ytterligeinformasjon', v)}
          value={pensjon?.ytterligeinformasjon ?? ''}
          maxLength={500}
        />
      </VStack>
    </Box>
  )
}

export default Diverse
