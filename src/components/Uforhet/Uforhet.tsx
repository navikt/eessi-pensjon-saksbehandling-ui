import {Box, Heading, HGrid, VStack} from "@navikt/ds-react";
import React, {JSX} from "react";
import {MainFormProps, MainFormSelector} from 'src/applications/MainForm'
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {setValidation} from "src/actions/validation";
import useUnmount from "../../hooks/useUnmount";
import performValidation from "../../utils/performValidation";
import {useTranslation} from "react-i18next";
import {Uforhet} from "src/declarations/p2200";
import Input from "src/components/Forms/Input";
import {validateUforhet, ValidationUforhetProps} from "src/components/Uforhet/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Uforhet: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED,
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-uforhet`
  const target = 'nav.bruker'
  const uforhet:  Uforhet | undefined = _.get(PSED, target + '.uforhet')

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationUforhetProps>(
      clonedvalidation, namespace, validateUforhet, {
        uforhet
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setUforhetProperty = (property: string, value: string | undefined) => {
    dispatch(updatePSED(`${target}.uforhet.${property}`, value))
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size='medium'>
          {label}
        </Heading>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-arbeidsUlykke']?.feilmelding}
            namespace={namespace + '-arbeidsUlykke'}
            id='arbeidsUlykke'
            label={t('p2200:form-uforhet-arbeidsUlykke')}
            onChanged={(v) => setUforhetProperty("arbeidsUlykke", v !== "" ? v : undefined)}
            value={(uforhet?.arbeidsUlykke) ?? ''}
          />
        </HGrid>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-militartjenesteUlykke']?.feilmelding}
            namespace={namespace + '-militartjenesteUlykke'}
            id='militartjenesteUlykke'
            label={t('p2200:form-uforhet-militartjenesteUlykke')}
            onChanged={(v) => setUforhetProperty("militartjenesteUlykke", v !== "" ? v : undefined)}
            value={(uforhet?.militartjenesteUlykke) ?? ''}
          />
        </HGrid>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-bevisstforsaketSoker']?.feilmelding}
            namespace={namespace + '-bevisstforsaketSoker'}
            id='bevisstforsaketSoker'
            label={t('p2200:form-uforhet-bevisstforsaketSoker')}
            onChanged={(v) => setUforhetProperty("bevisstforsaketSoker", v !== "" ? v : undefined)}
            value={(uforhet?.bevisstforsaketSoker) ?? ''}
          />
        </HGrid>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-ansvarligTredjepart']?.feilmelding}
            namespace={namespace + '-ansvarligTredjepart'}
            id='ansvarligTredjepart'
            label={t('p2200:form-uforhet-ansvarligTredjepart')}
            onChanged={(v) => setUforhetProperty("ansvarligTredjepart", v !== "" ? v : undefined)}
            value={(uforhet?.ansvarligTredjepart) ?? ''}
          />
        </HGrid>
      </VStack>
    </Box>
  );
}

export default Uforhet
