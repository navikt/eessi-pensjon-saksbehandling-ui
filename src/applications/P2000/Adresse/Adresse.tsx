import React from "react";
import Input from "../../../components/Forms/Input";
import {Country} from "@navikt/land-verktoy";
import {MainFormSelector} from "../MainForm";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED} from "src/declarations/app";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import {useDispatch} from "react-redux";
import {State} from "src/declarations/reducers";
import _ from "lodash";
import {resetValidation} from "src/actions/validation";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {HGrid, VStack} from "@navikt/ds-react";
import {Adresse as P2000Adresse} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface AdresseProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  usePostKode?: boolean
}

const Adresse: React.FC<AdresseProps> = ({
  PSED,
  parentNamespace,
  parentTarget,
  updatePSED,
  usePostKode = false,
}: AdresseProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-adresse`
  const target = `${parentTarget}.adresse`
  const adresse: P2000Adresse | undefined = _.get(PSED, `${target}`)

  const setGate = (gate: string) => {
    dispatch(updatePSED(`${target}.gate`, gate))
    if (validation[namespace + '-gate']) {
      dispatch(resetValidation(namespace + '-gate'))
    }
  }

  const setPostnummer = (postnummer: string) => {
    const targetField = usePostKode ? "postkode" : "postnummer"
    dispatch(updatePSED(`${target}.${targetField}`, postnummer))
    if (validation[namespace + '-postnummer']) {
      dispatch(resetValidation(namespace + '-postnummer'))
    }
  }

  const setBy = (by: string) => {
    dispatch(updatePSED(`${target}.by`, by))
    if (validation[namespace + '-by']) {
      dispatch(resetValidation(namespace + '-by'))
    }
  }

  const setRegion = (region: string) => {
    dispatch(updatePSED(`${target}.region`, region))
    if (validation[namespace + '-region']) {
      dispatch(resetValidation(namespace + '-region'))
    }
  }

  const setLand = (land: string) => {
    dispatch(updatePSED(`${target}.land`, land))
    if (validation[namespace + '-land']) {
      dispatch(resetValidation(namespace + '-land'))
    }
  }

  return (
    <VStack gap="4">
      <HGrid columns={1} align="start">
        <Input
          error={validation[namespace + '-gate']?.feilmelding}
          namespace={namespace}
          id='gate'
          label={t('p2000:form-adresse-gate')}
          onChanged={setGate}
          value={(adresse?.gate)  ?? ''}
        />
      </HGrid>
      <HGrid columns={2} gap="4" align="start">
        <Input
          error={validation[namespace + '-postnummer']?.feilmelding}
          namespace={namespace}
          id='postnummer'
          label={t('p2000:form-adresse-postnummer')}
          onChanged={setPostnummer}
          value={(usePostKode ? adresse?.postkode: adresse?.postnummer) ?? ''}
        />
        <Input
          error={validation[namespace + '-by']?.feilmelding}
          namespace={namespace}
          id='by'
          label="By"
          onChanged={setBy}
          value={(adresse?.by)  ?? ''}
        />
      </HGrid>
      <HGrid columns={1} align="start">
        <Input
          error={validation[namespace + '-region']?.feilmelding}
          namespace={namespace}
          id='region'
          label={t('p2000:form-adresse-region')}
          onChanged={setRegion}
          value={(adresse?.region)  ?? ''}
        />
      </HGrid>
      <HGrid columns={1} align="start">
        <CountryDropdown
          error={validation[namespace + '-land']?.feilmelding}
          id={namespace + '-land'}
          label={t('p2000:form-adresse-land')}
          flags={true}
          onOptionSelected={(land: Country) => setLand(land?.value)}
          isClearable={true}
          values={(adresse?.land) ?? ''}
          countryCodeListName="verdensLand"
        />
      </HGrid>
    </VStack>
  )
}

export default Adresse
