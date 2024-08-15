import React from "react";
import {AlignStartRow, Column, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "../../../components/Forms/Input";
import CountrySelect from "@navikt/landvelger";
import {Country} from "@navikt/land-verktoy";
import {MainFormSelector} from "../MainForm";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "declarations/types";
import {PSED} from "declarations/app";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "store";
import {useDispatch} from "react-redux";
import {State} from "declarations/reducers";
import {Adresse as P2000Adresse} from "declarations/p2000";
import _ from "lodash";
import {resetValidation} from "../../../actions/validation";

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
  usePostKode = false
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
    <>
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-gate']?.feilmelding}
            namespace={namespace}
            id='gate'
            label={t('p2000:form-adresse-gate')}
            onChanged={setGate}
            value={(adresse?.gate)  ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv/>
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-postnummer']?.feilmelding}
            namespace={namespace}
            id='postnummer'
            label={t('p2000:form-adresse-postnummer')}
            onChanged={setPostnummer}
            value={(usePostKode ? adresse?.postkode: adresse?.postnummer) ?? ''}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-by']?.feilmelding}
            namespace={namespace}
            id='by'
            label="By"
            onChanged={setBy}
            value={(adresse?.by)  ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv/>
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-region']?.feilmelding}
            namespace={namespace}
            id='region'
            label={t('p2000:form-adresse-region')}
            onChanged={setRegion}
            value={(adresse?.region)  ?? ''}
          />
        </Column>
      </AlignStartRow>
      <VerticalSeparatorDiv/>
      <AlignStartRow>
        <Column>
          <CountrySelect
            error={validation[namespace + '-land']?.feilmelding}
            id={namespace + '-land'}
            label={t('p2000:form-adresse-land')}
            flags={true}
            onOptionSelected={(land: Country) => setLand(land.value)}
            values={(adresse?.land) ?? ''}
          />
        </Column>
      </AlignStartRow>
    </>

  )
}

export default Adresse
