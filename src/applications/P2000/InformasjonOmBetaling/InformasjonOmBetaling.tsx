import React, {JSX, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {Box, Button, Heading, HGrid, Radio, RadioGroup, VStack} from "@navikt/ds-react";
import {State} from "src/declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppSelector} from "src/store";
import _ from "lodash";
import Input from "../../../components/Forms/Input";
import Adresse from "../Adresse/Adresse";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {resetValidation, setValidation} from "src/actions/validation";
import {
  validateBank,
  validateIban,
  validateSwift,
  ValidationBankProps,
  ValidationIbanProps,
  ValidationSwiftProps
} from "./validation";
import {Bank} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})


const InformasjonOmBetaling: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-informasjonombetaling`
  const target = 'nav.bruker.bank'
  const bank: Bank | undefined = _.get(PSED, target) as Bank | undefined

  const [_sepaIkkeSepa, _setSepaIkkeSepa] = useState<string>()

  const setInnehaverRolle = (rolle: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.rolle`, rolle))
  }

  const setInnehaverNavn = (navn: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.navn`, navn))
    if(validation[namespace + '-konto-innehaver-navn']){
      dispatch(resetValidation(namespace + '-konto-innehaver-navn'))
    }
  }

  const setSepaIban = (iban: string) => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationIbanProps>(
      clonedvalidation, namespace + '-konto-sepa-iban', validateIban, {
        iban
      })

    if (!hasErrors){
      dispatch(updatePSED(`${target}.konto.sepa.iban`, iban))
      dispatch(resetValidation(namespace + '-konto-sepa-iban'))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const setSepaSwift = (swift: string) => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationSwiftProps>(
      clonedvalidation, namespace + '-konto-sepa-swift', validateSwift, {
        swift
      })

    if (!hasErrors){
      dispatch(updatePSED(`${target}.konto.sepa.swift`, swift))
      dispatch(resetValidation(namespace + '-konto-sepa-swift'))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const setIkkeSepaSwift = (swift: string) => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationSwiftProps>(
      clonedvalidation, namespace + '-konto-ikkesepa-swift', validateSwift, {
        swift
      })

    if (!hasErrors){
      dispatch(updatePSED(`${target}.konto.ikkesepa.swift`, swift))
      dispatch(resetValidation(namespace + '-konto-ikkesepa-swift'))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const setKontonr = (kontonr: string) => {
    dispatch(updatePSED(`${target}.konto.kontonr`, kontonr))
    if (validation[namespace + '-konto-kontonr']) {
      dispatch(resetValidation(namespace + '-konto-kontonr'))
    }
  }

  const setBankNavn = (navn: string) => {
    dispatch(updatePSED(`${target}.navn`, navn))
    if (validation[namespace + '-bank-navn']) {
      dispatch(resetValidation(namespace + '-bank-navn'))
    }
  }

  const sepaIkkeSepaChange = (e: string) => {
    _setSepaIkkeSepa(e)
    dispatch(resetValidation(namespace + '-konto'))
    dispatch(resetValidation(namespace + '-bank'))

    if(e === "sepa"){
      dispatch(updatePSED(`${target}.konto.sepa`, {}))
      dispatch(updatePSED(`${target}.konto.ikkesepa`, undefined))
      dispatch(updatePSED(`${target}.konto.kontonr`, undefined))
      dispatch(updatePSED(`${target}.navn`, undefined))
      dispatch(updatePSED(`${target}.adresse`, undefined))
    } else {
      dispatch(updatePSED(`${target}.konto.ikkesepa`, {}))
      dispatch(updatePSED(`${target}.konto.sepa`, undefined))
    }
  }

  const resetBankInfo = () => {
    _setSepaIkkeSepa("")
    dispatch(updatePSED(`${target}.konto.ikkesepa`, undefined))
    dispatch(updatePSED(`${target}.konto.sepa`, undefined))
    dispatch(updatePSED(`${target}.konto.kontonr`, undefined))
    dispatch(updatePSED(`${target}.navn`, undefined))
    dispatch(updatePSED(`${target}.adresse`, undefined))
  }

  useEffect(() => {
    if(bank?.konto?.sepa){
      _setSepaIkkeSepa("sepa")
    } else if(bank?.konto?.kontonr || bank?.konto?.ikkesepa){
      _setSepaIkkeSepa("ikkesepa")
    }
  }, [bank])

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationBankProps>(
      clonedvalidation, namespace, validateBank, {
        bank,
        sepaIkkeSepa: _sepaIkkeSepa
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        <HGrid gap="4" columns={2} align="start">
          <RadioGroup
            error={validation[namespace + '-konto-innehaver-rolle']?.feilmelding}
            id='bank-konto-innehaver-rolle'
            legend={t('p2000:form-bank-konto-innehaver-rolle')}
            onChange={(e: any) => setInnehaverRolle(e)}
            value={(bank?.konto?.innehaver?.rolle) ?? ''}

          >
            <Radio value="forsikret_person">Forsikret person</Radio>
            <Radio value="representant_eller_verge">Representant/Verge</Radio>
          </RadioGroup>
        </HGrid>
        <HGrid gap="4" columns={2} align="start">
          <Input
            error={validation[namespace + '-konto-innehaver-navn']?.feilmelding}
            namespace={namespace}
            id='bank-konto-innehaver-navn'
            label={t('p2000:form-bank-konto-innehaver-navn')}
            onChanged={setInnehaverNavn}
            value={(bank?.konto?.innehaver?.navn) ?? ''}
          />
        </HGrid>
        <Heading size='medium'>
          Bankinformasjon <Button size="small" variant="tertiary" onClick={resetBankInfo}>Nullstill</Button>
        </Heading>
        <HGrid gap="4" columns={2} align="start">
          <RadioGroup
            error={validation[namespace + '-konto-sepa-ikkesepa']?.feilmelding}
            id='bank-konto-sepa-ikkesepa'
            legend={t('p2000:form-bank-konto-sepa-ikkesepa')}
            onChange={(e: any) => sepaIkkeSepaChange(e)}
            value={(_sepaIkkeSepa) ?? ''}
          >
            <Radio value="sepa">SEPA-konto</Radio>
            <Radio value="ikkesepa">Ikke SEPA-konto</Radio>
          </RadioGroup>
          {_sepaIkkeSepa === "sepa" &&
            <VStack gap="4">
              <Input
                error={validation[namespace + '-konto-sepa-iban']?.feilmelding}
                namespace={namespace}
                id='bank-konto-sepa-iban'
                label={t('p2000:form-bank-konto-sepa-iban')}
                onChanged={setSepaIban}
                value={(bank?.konto?.sepa?.iban) ?? ''}
              />
              <Input
                error={validation[namespace + '-konto-sepa-swift']?.feilmelding}
                namespace={namespace}
                id='bank-konto-sepa-swift'
                label={t('p2000:form-bank-konto-sepa-swift')}
                onChanged={setSepaSwift}
                value={(bank?.konto?.sepa?.swift) ?? ''}
              />
            </VStack>
          }
          {_sepaIkkeSepa === "ikkesepa" &&
            <VStack gap="4">
              <Input
                error={validation[namespace + '-konto-kontonr']?.feilmelding}
                namespace={namespace}
                id='bank-konto-kontonr'
                label={t('p2000:form-bank-konto-kontonr')}
                onChanged={setKontonr}
                value={(bank?.konto?.kontonr) ?? ''}
              />
              <Input
                error={validation[namespace + '-konto-ikkesepa-swift']?.feilmelding}
                namespace={namespace}
                id='bank-konto-ikkesepa-swift'
                label={t('p2000:form-bank-konto-ikkesepa-swift')}
                onChanged={setIkkeSepaSwift}
                value={(bank?.konto?.ikkesepa?.swift) ?? ''}
              />
            </VStack>
          }
        </HGrid>
        {_sepaIkkeSepa === "ikkesepa" &&
          <>
            <HGrid gap="4" columns={2} align="start">
              <Input
                error={validation[namespace + '-bank-navn']?.feilmelding}
                namespace={namespace}
                id='bank-navn'
                label={t('p2000:form-bank-navn')}
                onChanged={setBankNavn}
                value={(bank?.navn) ?? ''}
              />
            </HGrid>
            <Adresse usePostKode={true} PSED={PSED} updatePSED={updatePSED} parentNamespace={namespace + '-bank'} parentTarget={target}/>
          </>
        }
      </VStack>
    </Box>
  )
}
export default InformasjonOmBetaling
