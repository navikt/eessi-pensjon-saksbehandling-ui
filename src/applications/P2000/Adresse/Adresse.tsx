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
  }

  const setPostnummer = (postnummer: string) => {
    const targetField = usePostKode ? "postkode" : "postnummer"
    dispatch(updatePSED(`${target}.${targetField}`, postnummer))
  }

  const setBy = (by: string) => {
    dispatch(updatePSED(`${target}.by`, by))
  }

  const setRegion = (region: string) => {
    dispatch(updatePSED(`${target}.region`, region))
  }

  const setLand = (land: string) => {
    dispatch(updatePSED(`${target}.land`, land))
  }

  return (
    <>
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-adresse-gate']?.feilmelding}
            namespace={namespace}
            id='adresse-gate'
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
            error={validation[namespace + '-adresse-postnummer']?.feilmelding}
            namespace={namespace}
            id='adresse-postnummer'
            label={t('p2000:form-adresse-postnummer')}
            onChanged={setPostnummer}
            value={(adresse?.postnummer) ?? ''}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-adresse-by']?.feilmelding}
            namespace={namespace}
            id='adresse-by'
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
            error={validation[namespace + '-adresse-region']?.feilmelding}
            namespace={namespace}
            id='adresse-region'
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
            error={validation[namespace + '-adresse-land']?.feilmelding}
            id={namespace + '-' + 'adresse-land'}
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
