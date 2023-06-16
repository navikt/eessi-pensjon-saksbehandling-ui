import React from "react";
import {useDispatch} from "react-redux";
import {Verge as P2000Verge} from "../../../declarations/p2000";
import Input from "../../../components/Forms/Input";
import _ from "lodash";
import {AlignStartRow, Column, VerticalSeparatorDiv, PaddedDiv} from '@navikt/hoykontrast'
import {Heading} from "@navikt/ds-react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import CountrySelect from "@navikt/landvelger";
import Telefon from "./Telefon";
import Epost from "./Epost";
import {State} from "../../../declarations/reducers";
import {useAppSelector} from "../../../store";


const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const Verge: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
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
              error={validation[namespace + '-person-etternavn']?.feilmelding}
              namespace={namespace}
              id='person-etternavn'
              label="Etternavn"
              onChanged={setEtternavn}
              value={(verge?.person?.etternavn) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-person-fornavn']?.feilmelding}
              namespace={namespace}
              id='person-fornavn'
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
              id=''
              label='Land'
              ariaLabel='Land'
              flags={true}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Telefon PSED={PSED} parentNamespace={namespace} updatePSED={updatePSED}/>
        <VerticalSeparatorDiv/>
        <Epost PSED={PSED} parentNamespace={namespace} updatePSED={updatePSED}/>
      </PaddedDiv>
    </>
  )
}

export default Verge
