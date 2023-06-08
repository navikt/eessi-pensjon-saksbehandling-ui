import React from "react";
import {useDispatch} from "react-redux";
import {Verge as P2000Verge} from "../../declarations/p2000";
import Input from "../../components/Forms/Input";
import _ from "lodash";
import {AlignStartRow, Column, VerticalSeparatorDiv, PaddedDiv} from '@navikt/hoykontrast'
import {Heading} from "@navikt/ds-react";
import {MainFormProps} from "./MainForm";
import CountrySelect from "@navikt/landvelger";

const Verge: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-verge`
  const target = 'nav.verge'
  const verge: P2000Verge | undefined = _.get(PSED, target)

  const error = null

  const setEtternavn = (etternavn: string) => {
    dispatch(updatePSED(`${target}.person.etternavn`, etternavn))
  }

  const setFornavn = (fornavn: string) => {
    dispatch(updatePSED(`${target}.person.fornavn`, fornavn))
  }

  const setVergemaalMandat = (mandat: string) => {
    dispatch(updatePSED(`${target}.vergemaal.mandat`, mandat))
  }

  const setGate = (gate: string) => {
    dispatch(updatePSED(`${target}.adresse.gate`, gate))
  }

  const setPostnummer = (postnummer: string) => {
    dispatch(updatePSED(`${target}.adresse.postnummer`, postnummer))
  }

  const setBy = (by: string) => {
    dispatch(updatePSED(`${target}.adresse.by`, by))
  }

  const setRegion = (region: string) => {
    dispatch(updatePSED(`${target}.adresse.region`, region))
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        <Heading size='small'>
          Informasjon om representant/verge
        </Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Etternavn"
              onChanged={setEtternavn}
              value={(verge?.person?.etternavn) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Fornavn"
              onChanged={setFornavn}
              value={(verge?.person?.fornavn)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Årsak til vergemål, representasjon"
              onChanged={setVergemaalMandat}
              value={(verge?.vergemaal?.mandat)  ?? ''}
            />
          </Column>
          <Column></Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Heading size="small">Adresse</Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Gate"
              onChanged={setGate}
              value={(verge?.adresse?.gate)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Postnummer"
              onChanged={setPostnummer}
              value={(verge?.adresse?.postnummer) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="By"
              onChanged={setBy}
              value={(verge?.adresse?.by)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={error}
              namespace={namespace}
              id=''
              label="Region"
              onChanged={setRegion}
              value={(verge?.adresse?.region)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <CountrySelect
              label='Land'
              ariaLabel='Land'
              flags={false}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>

          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
      </PaddedDiv>
    </>
  )
}

export default Verge
