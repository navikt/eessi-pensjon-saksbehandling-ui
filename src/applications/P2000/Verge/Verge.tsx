import React from "react";
import {useDispatch} from "react-redux";
import {Verge as P2000Verge} from "../../../declarations/p2000";
import Input from "../../../components/Forms/Input";
import _ from "lodash";
import {AlignStartRow, Column, VerticalSeparatorDiv, PaddedDiv} from '@navikt/hoykontrast'
import {Heading} from "@navikt/ds-react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import CountrySelect from "@navikt/landvelger";
import Telefon from "../Telefon/Telefon";
import Epost from "../Epost/Epost";
import {State} from "../../../declarations/reducers";
import {useAppSelector} from "../../../store";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {validateVerge, ValidationVergeProps} from "./validation";
import {setValidation} from "../../../actions/validation";
import {Country} from "@navikt/land-verktoy";
import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Verge: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const dispatch = useDispatch()
  const {t} = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-verge`
  const target = 'nav.verge'
  const verge: P2000Verge | undefined = _.get(PSED, target)

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

  const setLand = (land: string) => {
    dispatch(updatePSED(`${target}.adresse.land`, land))
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
              label={t('p2000:form-person-etternavn')}
              onChanged={setEtternavn}
              value={(verge?.person?.etternavn) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-person-fornavn']?.feilmelding}
              namespace={namespace}
              id='person-fornavn'
              label={t('p2000:form-person-fornavn')}
              onChanged={setFornavn}
              value={(verge?.person?.fornavn)  ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-vergemaal-mandat']?.feilmelding}
              namespace={namespace}
              id='vergemaal-mandat'
              label={t('p2000:form-verge-vergemaal-mandat')}
              onChanged={setVergemaalMandat}
              value={(verge?.vergemaal?.mandat)  ?? ''}
            />
          </Column>
          <Column></Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Heading size="small">{t('p2000-form-adresse')}</Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-adresse-gate']?.feilmelding}
              namespace={namespace}
              id='adresse-gate'
              label={t('p2000:form-adresse-gate')}
              onChanged={setGate}
              value={(verge?.adresse?.gate)  ?? ''}
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
              value={(verge?.adresse?.postnummer) ?? ''}
            />
          </Column>
          <Column>
            <Input
              error={validation[namespace + '-adresse-by']?.feilmelding}
              namespace={namespace}
              id='adresse-by'
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
              error={validation[namespace + '-adresse-region']?.feilmelding}
              namespace={namespace}
              id='adresse-region'
              label={t('p2000:form-adresse-region')}
              onChanged={setRegion}
              value={(verge?.adresse?.region)  ?? ''}
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
              values={(verge?.adresse?.land) ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Telefon PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/>
        <VerticalSeparatorDiv/>
        <Epost PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/>
      </PaddedDiv>
    </>
  )
}

export default Verge
