import React from "react";
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

  console.log(validation, t)

  const setInnehaverRolle = (rolle: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.rolle`, rolle))
  }

  const setInnehaverNavn = (navn: string) => {
    dispatch(updatePSED(`${target}.konto.innehaver.navn`, navn))
  }

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
      </PaddedDiv>
    </>
  )
}
export default InformasjonOmBetaling
