import React from "react";
import {useDispatch} from "react-redux";
import {updateSed} from "../../actions/buc";
import {P2000SED, Verge as P2000Verge} from "../../declarations/p2000";
import Input from "../../components/Forms/Input";
import _ from "lodash";
import {AlignStartRow, Column, VerticalSeparatorDiv} from '@navikt/hoykontrast'
import {Heading, Panel} from "@navikt/ds-react";

export interface VergeProps {
  sed?: P2000SED,
}

const Verge: React.FC<VergeProps> = ({sed}: VergeProps): JSX.Element => {
  const dispatch = useDispatch()
  const namespace = 'verge'
  const target = 'nav.verge'
  const verge: P2000Verge | undefined = _.get(sed, target)

  const error = null

  const setEtternavn = (etternavn: string) => {
    dispatch(updateSed(`${target}.person.etternavn`, etternavn))
  }

  const setFornavn = (fornavn: string) => {
    dispatch(updateSed(`${target}.person.fornavn`, fornavn))
  }

  const setVergemaalMandat = (mandat: string) => {
    dispatch(updateSed(`${target}.vergemaal.mandat`, mandat))
  }

  const setGate = (gate: string) => {
    dispatch(updateSed(`${target}.adresse.gate`, gate))
  }

  const setPostnummer = (postnummer: string) => {
    dispatch(updateSed(`${target}.adresse.postnummer`, postnummer))
  }

  const setBy = (by: string) => {
    dispatch(updateSed(`${target}.adresse.by`, by))
  }

  const setRegion = (region: string) => {
    dispatch(updateSed(`${target}.adresse.region`, region))
  }

  return (
    <>
      <Panel border>
        <Heading size="medium">Informasjon om representant/verge</Heading>
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
      </Panel>
      <VerticalSeparatorDiv/>
      <Panel border>
        <Heading size="medium">Adresse</Heading>
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
      </Panel>
    </>
  )
}

export default Verge
