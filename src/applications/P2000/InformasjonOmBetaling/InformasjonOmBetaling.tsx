import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {Heading, Radio, RadioGroup} from "@navikt/ds-react";
import {AlignStartRow, VerticalSeparatorDiv, PaddedDiv, Column} from "@navikt/hoykontrast";
import {State} from "../../../declarations/reducers";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useAppSelector} from "../../../store";
import {Bank} from "../../../declarations/p2000";
import _ from "lodash";
import Input from "../../../components/Forms/Input";

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
  const namespace = `${parentNamespace}-bruker-bank`
  const target = 'nav.bruker.bank'
  const bank: Bank | undefined = _.get(PSED, target)

  const [_sepaIkkeSepa, _setSepaIkkeSepa] = useState<string>()

  console.log(validation, t)

  const setInnehaverRolle = (rolle: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.rolle`, rolle))
  }

  const setInnehaverNavn = (navn: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.navn`, navn))
  }

  const setSepaIban = (iban: string) => {
    dispatch(updatePSED(`${target}.konto.sepa.iban`, iban))
  }

  const setSepaSwift = (swift: string) => {
    dispatch(updatePSED(`${target}.konto.sepa.swift`, swift))
  }

  const setIkkeSepaSwift = (swift: string) => {
    dispatch(updatePSED(`${target}.konto.ikkesepa.swift`, swift))
  }

  const setKontonr = (kontonr: string) => {
    dispatch(updatePSED(`${target}.konto.kontonr`, kontonr))
  }

  const sepaIkkeSepaChange = (e: string) => {
    _setSepaIkkeSepa(e)
    if(e === "sepa"){
      dispatch(updatePSED(`${target}.konto.ikkesepa.swift`, undefined))
      dispatch(updatePSED(`${target}.konto.kontonr`, undefined))
    } else {
      dispatch(updatePSED(`${target}.konto.sepa.iban`, undefined))
      dispatch(updatePSED(`${target}.konto.sepa.swift`, undefined))
    }
  }

  useEffect(() => {
    if(bank?.konto?.sepa?.iban || bank?.konto?.sepa?.swift){
      _setSepaIkkeSepa("sepa")
    } else if(bank?.konto?.kontonr ||bank?.konto?.ikkesepa?.swift){
      _setSepaIkkeSepa("ikkesepa")
    }
  }, [bank])

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
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

          </Column>
        </AlignStartRow>
        <AlignStartRow>
          <Column>
            <Input
              error={validation[namespace + '-konto-innehaver-navn']?.feilmelding}
              namespace={namespace}
              id='bank-konto-innehaver-navn'
              label={t('p2000:form-bank-konto-innehaver-navn')}
              onChanged={setInnehaverNavn}
              value={(bank?.konto?.innehaver?.navn) ?? ''}
            />
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Heading size='medium'>
          Bankinformasjon
        </Heading>
        <VerticalSeparatorDiv/>
        <AlignStartRow>
          <Column>
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
          </Column>
          {_sepaIkkeSepa === "sepa" &&
            <Column>
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
            </Column>
          }
          {_sepaIkkeSepa === "ikkesepa" &&
            <Column>
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
            </Column>
          }

        </AlignStartRow>
      </PaddedDiv>
    </>
  )
}
export default InformasjonOmBetaling
