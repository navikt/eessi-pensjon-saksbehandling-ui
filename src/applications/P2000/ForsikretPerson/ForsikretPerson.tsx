import {Box, Heading, HGrid, VStack} from "@navikt/ds-react";
import React, {JSX} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {setValidation} from "src/actions/validation";
import UtenlandskePin from "src/components/UtenlandskePin/UtenlandskePin";
import FamilieStatus from "../FamilieStatus/FamilieStatus";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateForsikretPerson, ValidationForsikretPersonProps} from "./validation";
import Telefon from "../Telefon/Telefon";
import Epost from "../Epost/Epost";
import Statsborgerskap from "src/applications/P2000/Statsborgerskap/Statsborgerskap";
import Input from "src/components/Forms/Input";
import {useTranslation} from "react-i18next";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {Country} from "@navikt/land-verktoy";
import {Person} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const ForsikretPerson: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED,
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
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

  const setPersonProperty = (property: string, value: string | undefined) => {
    dispatch(updatePSED(`${target}.person.${property}`, value))
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-etternavnvedfoedsel']?.feilmelding}
            namespace={namespace + '-etternavnvedfoedsel'}
            id='etternavnvedfoedsel'
            label={t('p2000:form-person-etternavnvedfoedsel')}
            onChanged={(v) => setPersonProperty("etternavnvedfoedsel", v !== "" ? v : undefined)}
            value={(forsikretPerson?.etternavnvedfoedsel) ?? ''}
          />
        </HGrid>
        <HGrid columns={3}>
          <Input
            error={validation[namespace + '-foedested-by']?.feilmelding}
            namespace={namespace + '-foedested-by'}
            id='foedested-by'
            label={t('p2000:form-person-foedested')}
            onChanged={(v) => setPersonProperty("foedested.by", v !== "" ? v : undefined)}
            value={(forsikretPerson?.foedested?.by) ?? ''}
          />
        </HGrid>
        <HGrid columns={3}>
          <CountryDropdown
            error={validation[namespace + '-foedested-land']?.feilmelding}
            id="land"
            countryCodeListName="verdensLandHistorisk"
            label={t('p2000:form-person-foedested-land')}
            onOptionSelected={(v: Country) => setPersonProperty("foedested.land", v?.value)}
            isClearable={true}
            values={(forsikretPerson?.foedested?.land)  ?? ''}
          />
        </HGrid>
        <Box>
          <Statsborgerskap
            PSED={PSED}
            parentNamespace={namespace}
            parentTarget={target}
            updatePSED={updatePSED}
          />
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
          <FamilieStatus
            PSED={PSED}
            parentNamespace={namespace}
            parentTarget={target}
            updatePSED={updatePSED}
          />
        </Box>
        <Box><Telefon PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
        <Box><Epost PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/></Box>
      </VStack>
    </Box>
  )
}

export default ForsikretPerson
