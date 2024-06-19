import {Heading, Radio} from "@navikt/ds-react";
import {VerticalSeparatorDiv, PaddedDiv, AlignStartRow, Column} from "@navikt/hoykontrast";
import React from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "store";
import {setValidation} from "actions/validation";
import useUnmount from "hooks/useUnmount";
import performValidation from "utils/performValidation";
import {validateDiverse, ValidationDiverseProps} from "./validation";
import DateField from "../DateField/DateField";
import {dateToString} from "utils/utils";
import {useTranslation} from "react-i18next";
import {P2000SED, Pensjon} from "declarations/p2000";
import {HorizontalRadioGroup} from "../../../components/StyledComponents";
import Utsettelse from "../Utsettelse/Utsettelse";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Diverse: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-diverse-pensjon`
  const target = 'pensjon'
  const pensjon: Pensjon = _.get(PSED as P2000SED, target)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationDiverseProps>(
      clonedvalidation, namespace, validateDiverse, {

      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setPensjonProperty = (property: string, value: string | undefined) => {
    dispatch(updatePSED(`${target}.${property}`, value))
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
            <DateField
              id={namespace + '-forespurtstartdato'}
              description={t('p2000:form-diverse-pensjon-forespurtstartdato-description')}
              index={0}
              label={t('p2000:form-diverse-pensjon-forespurtstartdato')}
              error={validation[namespace + '-forespurtstartdato']?.feilmelding}
              namespace={namespace}
              onChanged={(v) => setPensjonProperty("forespurtstartdato", dateToString(v))}
              defaultDate={pensjon?.forespurtstartdato ?? ''}
            />
          </Column>
          <Column>
            <HorizontalRadioGroup
              error={validation[namespace + '-angitidligstdato']?.feilmelding}
              id={namespace + "-angitidligstdato"}
              legend={t('p2000:form-diverse-pensjon-angitidligstdato')}
              onChange={(v) => setPensjonProperty("angitidligstdato", v)}
              value={pensjon?.angitidligstdato}
              description={<>&nbsp;</>}
            >
              <Radio value="ja">Ja</Radio>
              <Radio value="nei">Nei</Radio>
            </HorizontalRadioGroup>
          </Column>
        </AlignStartRow>
        <VerticalSeparatorDiv/>
        <Utsettelse PSED={PSED} parentNamespace={namespace} parentTarget={target} updatePSED={updatePSED}/>
        <VerticalSeparatorDiv/>
      </PaddedDiv>
    </>
  )
}

export default Diverse
