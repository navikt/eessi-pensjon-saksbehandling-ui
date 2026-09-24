import {Box, Button, Heading, HGrid, HStack, Radio, RadioGroup, Select, Spacer, VStack} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {JSX} from "react";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {Currency} from "@navikt/land-verktoy";
import {ActionWithPayload} from "@navikt/fetch";
import {useAppDispatch} from "src/store";
import {PSED} from "src/declarations/app";
import {UpdateSedPayload} from "src/declarations/types";
import {Betalingsdetaljer} from "src/declarations/p12000";
import {getIdx} from "src/utils/namespace";
import AddRemovePanel from "src/components/AddRemovePanel/AddRemovePanel";
import CurrencyDropdown from "src/components/CurrencyDropdown/CurrencyDropdown";
import DateField from "src/components/Forms/DateField";
import Input from "src/components/Forms/Input";
import styles from "src/assets/css/common.module.css";

export const UTBETALINGSHYPPIGHETER = [
  'aarlig', 'kvartalsvis', 'maaned_12_per_aar', 'maaned_13_per_aar', 'maaned_14_per_aar', 'ukentlig', 'annet'
]

export const UTBETALINGSHYPPIGHET_ANNET = 'annet'

export const BASERTPAA_BOTID = '01'
export const BASERTPAA_I_ARBEID = '02'

export interface BetalingsdetaljerPanelProps {
  parentNamespace: string
  target: string
  pensjonstype: string | undefined
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const BetalingsdetaljerPanel: React.FC<BetalingsdetaljerPanelProps> = ({
  parentNamespace,
  target,
  pensjonstype,
  PSED,
  updatePSED
}: BetalingsdetaljerPanelProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-betalingsdetaljer`
  const items: Array<Betalingsdetaljer> = _.get(PSED, target) ?? []

  const setProps = (props: Betalingsdetaljer, index: number) => {
    const newItems: Array<Betalingsdetaljer> = _.cloneDeep(items)
    newItems[index] = {...newItems[index], ...props, pensjonstype}
    dispatch(updatePSED(target, newItems))
  }

  const setUtbetalingshyppighet = (utbetalingshyppighet: string, index: number) => {
    setProps({
      utbetalingshyppighet,
      annenutbetalingshyppighet: utbetalingshyppighet === UTBETALINGSHYPPIGHET_ANNET
        ? items[index]?.annenutbetalingshyppighet
        : undefined
    }, index)
  }

  const setBasertpaa = (basertpaa: string, index: number) => {
    setProps({
      basertpaa,
      bosattotal: basertpaa === BASERTPAA_BOTID ? items[index]?.bosattotal : undefined,
      arbeidstotal: basertpaa === BASERTPAA_I_ARBEID ? items[index]?.arbeidstotal : undefined
    }, index)
  }

  const onAddNew = () => {
    dispatch(updatePSED(target, [...items, {pensjonstype}]))
  }

  const onRemove = (index: number) => {
    const newItems: Array<Betalingsdetaljer> = items.filter((_item, i: number) => i !== index)
    dispatch(updatePSED(target, _.isEmpty(newItems) ? undefined : newItems))
  }

  const renderRow = (item: Betalingsdetaljer, index: number) => {
    const _namespace = namespace + getIdx(index)

    return (
      <Box
        key={'repeatablerow-' + _namespace}
        id={'repeatablerow-' + _namespace}
        className={styles.repeatableBox}
        padding="space-16"
      >
        <VStack gap="space-16">
          <HStack gap="space-16" align="start" wrap={false}>
            <Heading size="xsmall">{t('p12000:form-betalingsdetaljer')}</Heading>
            <Spacer/>
            <AddRemovePanel<Betalingsdetaljer>
              item={item}
              index={index}
              allowEdit={false}
              alwaysVisible
              onRemove={() => onRemove(index)}
            />
          </HStack>
          <HGrid columns={2} gap="space-16" align="start">
            <DateField
              error={undefined}
              namespace={_namespace}
              id='fradato'
              index={index}
              label={t('p12000:form-betalingsdetaljer-fradato')}
              onChanged={(v: string) => setProps({fradato: v}, index)}
              dateValue={item?.fradato ?? ''}
            />
            <DateField
              error={undefined}
              namespace={_namespace}
              id='betaldato'
              index={index}
              label={t('p12000:form-betalingsdetaljer-betaldato')}
              onChanged={(v: string) => setProps({betaldato: v}, index)}
              dateValue={item?.betaldato ?? ''}
            />
          </HGrid>
          <Heading size="xsmall">{t('p12000:form-betalingsdetaljer-belop')}</Heading>
          <HGrid columns={2} gap="space-16" align="start">
            <Input
              error={undefined}
              namespace={_namespace}
              id='belop'
              label={t('p12000:form-betalingsdetaljer-belop')}
              onChanged={(v: string) => setProps({belop: v}, index)}
              value={item?.belop ?? ''}
            />
            <CurrencyDropdown
              error={undefined}
              id={_namespace + '-valuta'}
              label={t('p12000:form-betalingsdetaljer-valuta')}
              placeholder={t('p12000:form-betalingsdetaljer-valuta-placeholder')}
              sort="noeuFirst"
              currencyCodeListName="verdensValuta"
              includeHistoricCurrencies
              onOptionSelected={(valuta: Currency) => setProps({valuta: valuta.value}, index)}
              values={item?.valuta ?? ''}
            />
            <DateField
              error={undefined}
              namespace={_namespace}
              id='effektueringsdato'
              index={index}
              label={t('p12000:form-betalingsdetaljer-effektueringsdato')}
              onChanged={(v: string) => setProps({effektueringsdato: v}, index)}
              dateValue={item?.effektueringsdato ?? ''}
            />
            <Select
              error={undefined}
              data-testid={_namespace + '-utbetalingshyppighet'}
              id={_namespace + '-utbetalingshyppighet'}
              label={t('p12000:form-betalingsdetaljer-utbetalingshyppighet')}
              onChange={(e) => setUtbetalingshyppighet(e.target.value, index)}
              value={item?.utbetalingshyppighet ?? ''}
            >
              <option value=''>{t('ui:choose')}</option>
              {UTBETALINGSHYPPIGHETER.map((hyppighet: string) => (
                <option key={hyppighet} value={hyppighet}>
                  {t('p12000:utbetalingshyppighet-' + hyppighet)}
                </option>
              ))}
            </Select>
            {item?.utbetalingshyppighet === UTBETALINGSHYPPIGHET_ANNET && (
              <Input
                error={undefined}
                namespace={_namespace}
                id='annenutbetalingshyppighet'
                label={t('p12000:form-betalingsdetaljer-annenutbetalingshyppighet')}
                onChanged={(v: string) => setProps({annenutbetalingshyppighet: v}, index)}
                value={item?.annenutbetalingshyppighet ?? ''}
              />
            )}
          </HGrid>
          <RadioGroup
            value={item?.basertpaa ?? ''}
            data-testid={_namespace + '-basertpaa'}
            id={_namespace + '-basertpaa'}
            legend={t('p12000:form-betalingsdetaljer-basertpaa')}
            onChange={(v: string) => setBasertpaa(v, index)}
          >
            <HStack gap="space-16">
              <Radio value={BASERTPAA_BOTID}>{t('p12000:basertpaa-' + BASERTPAA_BOTID)}</Radio>
              <Radio value={BASERTPAA_I_ARBEID}>{t('p12000:basertpaa-' + BASERTPAA_I_ARBEID)}</Radio>
            </HStack>
          </RadioGroup>
          {item?.basertpaa === BASERTPAA_BOTID && (
            <Input
              error={undefined}
              namespace={_namespace}
              id='bosattotal'
              label={t('p12000:form-betalingsdetaljer-bosattotal')}
              onChanged={(v: string) => setProps({bosattotal: v}, index)}
              value={item?.bosattotal ?? ''}
            />
          )}
          {item?.basertpaa === BASERTPAA_I_ARBEID && (
            <Input
              error={undefined}
              namespace={_namespace}
              id='arbeidstotal'
              label={t('p12000:form-betalingsdetaljer-arbeidstotal')}
              onChanged={(v: string) => setProps({arbeidstotal: v}, index)}
              value={item?.arbeidstotal ?? ''}
            />
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <VStack gap="space-16">
      {_.isEmpty(items)
        ? (<em>{t('p12000:form-betalingsdetaljer-ingen')}</em>)
        : (<VStack gap="space-16">{items.map(renderRow)}</VStack>)
      }
      <Box>
        <Button
          variant='tertiary'
          data-testid={namespace + '-add'}
          onClick={onAddNew}
          iconPosition="left" icon={<PlusCircleIcon aria-hidden/>}
        >
          {t('ui:add-new-x', {x: t('p12000:form-betalingsdetaljer')?.toLowerCase()})}
        </Button>
      </Box>
    </VStack>
  )
}

export default BetalingsdetaljerPanel
