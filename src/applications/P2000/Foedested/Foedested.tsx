import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import React from "react";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import {AlignStartRow, Column, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import Input from "src/components/Forms/Input";
import {Person} from "src/declarations/p2000";
import {Heading} from "@navikt/ds-react";
import {Country, CountryFilter} from "@navikt/land-verktoy";
import CountrySelect from "@navikt/landvelger";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface FoedestedProps {
  parentNamespace: string
  parentIndex?: number
  person: Person | undefined,
  setPersonOpplysninger: any
}

const Foedested: React.FC<FoedestedProps> = ({
  parentNamespace,
  parentIndex,
  person,
  setPersonOpplysninger
}: FoedestedProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-person-foedested`

  return(
    <>
      <Heading size="small">{t('p2000:form-person-foedested')}</Heading>
      <VerticalSeparatorDiv size='0.5' />
      <AlignStartRow>
        <Column>
          <Input
            error={validation[namespace + '-by']?.feilmelding}
            namespace={namespace}
            id='person-foedested-by'
            label={t('p2000:form-person-foedested-by')}
            onChanged={(v) => setPersonOpplysninger("by", v, parentIndex)}
            value={(person?.foedested?.by) ?? ''}
          />
        </Column>
        <Column>
          <Input
            error={validation[namespace + '-region']?.feilmelding}
            namespace={namespace}
            id='person-foedested-region'
            label={t('p2000:form-person-foedested-region')}
            onChanged={(v) => setPersonOpplysninger("region", v, parentIndex)}
            value={(person?.foedested?.region)  ?? ''}
          />
        </Column>
        <Column>
          <CountrySelect
            error={validation[namespace + '-land']?.feilmelding}
            id="person-foedested-land"
            includeList={CountryFilter.STANDARD({})}
            label={t('p2000:form-person-foedested-land')}
            menuPortalTarget={document.body}
            onOptionSelected={(v: Country) => setPersonOpplysninger("land", v.value, parentIndex)}
            values={(person?.foedested?.land)  ?? ''}
          />
        </Column>
      </AlignStartRow>
    </>
  )
}

export default Foedested
