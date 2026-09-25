import {BodyLong, Box, Button, Heading, HGrid, HStack, Label, Radio, RadioGroup, Select, Spacer, VStack} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {JSX, useEffect, useState} from "react";
import _ from "lodash";
import classNames from "classnames";
import {useTranslation} from "react-i18next";
import {Currency} from "@navikt/land-verktoy";
import {ActionWithPayload} from "@navikt/fetch";
import {useAppDispatch} from "src/store";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import {PSED} from "src/declarations/app";
import {UpdateSedPayload} from "src/declarations/types";
import {Betalingsdetaljer} from "src/declarations/p12000";
import {getIdx} from "src/utils/namespace";
import {formatDate} from "src/utils/utils";
import AddRemovePanel from "src/components/AddRemovePanel/AddRemovePanel";
import CurrencyDropdown from "src/components/CurrencyDropdown/CurrencyDropdown";
import DateField from "src/components/Forms/DateField";
import FormTextBox from "src/components/Forms/FormTextBox";
import Input from "src/components/Forms/Input";
import styles from "src/assets/css/common.module.css";
import panelStyles from "./BetalingsdetaljerPanel.module.css";

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

  const [_newBetalingsdetaljer, _setNewBetalingsdetaljer] = useState<Betalingsdetaljer | undefined>(undefined)
  const [_editBetalingsdetaljer, _setEditBetalingsdetaljer] = useState<Betalingsdetaljer | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)

  useEffect(() => {
    if (_newForm || _editBetalingsdetaljer) {
      dispatch(addEditingItem("betalingsdetaljer"))
    } else {
      dispatch(deleteEditingItem("betalingsdetaljer"))
    }
  }, [_newForm, _editBetalingsdetaljer])

  const setProps = (props: Betalingsdetaljer, index: number) => {
    if (index < 0) {
      _setNewBetalingsdetaljer((prevState) => ({...prevState, ...props}))
      return
    }
    _setEditBetalingsdetaljer((prevState) => ({...prevState, ...props}))
  }

  const setUtbetalingshyppighet = (utbetalingshyppighet: string, index: number) => {
    setProps({
      utbetalingshyppighet,
      ...(utbetalingshyppighet === UTBETALINGSHYPPIGHET_ANNET ? {} : {annenutbetalingshyppighet: undefined})
    }, index)
  }

  const setBasertpaa = (basertpaa: string, index: number) => {
    setProps({
      basertpaa,
      ...(basertpaa === BASERTPAA_BOTID ? {} : {bosattotal: undefined}),
      ...(basertpaa === BASERTPAA_I_ARBEID ? {} : {arbeidstotal: undefined})
    }, index)
  }

  const setItems = (newItems: Array<Betalingsdetaljer>) => {
    dispatch(updatePSED(target, _.isEmpty(newItems) ? undefined : newItems))
  }

  const onCloseNew = () => {
    _setNewBetalingsdetaljer(undefined)
    _setNewForm(false)
  }

  const onAddNew = () => {
    if (_newBetalingsdetaljer) {
      setItems([...items, {..._newBetalingsdetaljer, pensjonstype}])
    }
    onCloseNew()
  }

  const onStartEdit = (betalingsdetaljer: Betalingsdetaljer, index: number) => {
    _setEditBetalingsdetaljer(betalingsdetaljer)
    _setEditIndex(index)
  }

  const onCloseEdit = () => {
    _setEditBetalingsdetaljer(undefined)
    _setEditIndex(undefined)
  }

  const onSaveEdit = () => {
    if (_editIndex !== undefined && _editBetalingsdetaljer) {
      const newItems: Array<Betalingsdetaljer> = _.cloneDeep(items)
      newItems[_editIndex] = {..._editBetalingsdetaljer, pensjonstype}
      setItems(newItems)
    }
    onCloseEdit()
  }

  const onRemove = (index: number) => {
    setItems(items.filter((_item, i: number) => i !== index))
  }

  const renderEditMode = (item: Betalingsdetaljer | undefined, index: number, _namespace: string) => (
    <VStack gap="space-16">
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
  )

  const renderViewMode = (item: Betalingsdetaljer | undefined, _namespace: string) => (
    <HGrid columns={2} gap="space-16" align="start">
      <FormTextBox error={undefined} id={_namespace + '-fradato'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-fradato')}</Label>
        <BodyLong>{formatDate(item?.fradato)}</BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-betaldato'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-betaldato')}</Label>
        <BodyLong>{formatDate(item?.betaldato)}</BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-belop'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-belop')}</Label>
        <BodyLong>{item?.belop}</BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-valuta'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-valuta')}</Label>
        <BodyLong>{item?.valuta}</BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-effektueringsdato'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-effektueringsdato')}</Label>
        <BodyLong>{formatDate(item?.effektueringsdato)}</BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-utbetalingshyppighet'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-utbetalingshyppighet')}</Label>
        <BodyLong>
          {item?.utbetalingshyppighet === UTBETALINGSHYPPIGHET_ANNET
            ? item?.annenutbetalingshyppighet
            : (item?.utbetalingshyppighet ? t('p12000:utbetalingshyppighet-' + item.utbetalingshyppighet) : '')
          }
        </BodyLong>
      </FormTextBox>
      <FormTextBox error={undefined} id={_namespace + '-basertpaa'} padding="space-0">
        <Label>{t('p12000:form-betalingsdetaljer-basertpaa')}</Label>
        <BodyLong>{item?.basertpaa ? t('p12000:basertpaa-' + item.basertpaa) : ''}</BodyLong>
      </FormTextBox>
      {item?.basertpaa === BASERTPAA_BOTID && (
        <FormTextBox error={undefined} id={_namespace + '-bosattotal'} padding="space-0">
          <Label>{t('p12000:form-betalingsdetaljer-bosattotal')}</Label>
          <BodyLong>{item?.bosattotal}</BodyLong>
        </FormTextBox>
      )}
      {item?.basertpaa === BASERTPAA_I_ARBEID && (
        <FormTextBox error={undefined} id={_namespace + '-arbeidstotal'} padding="space-0">
          <Label>{t('p12000:form-betalingsdetaljer-arbeidstotal')}</Label>
          <BodyLong>{item?.arbeidstotal}</BodyLong>
        </FormTextBox>
      )}
    </HGrid>
  )

  const renderRow = (betalingsdetaljer: Betalingsdetaljer | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const inEditMode = index < 0 || _editIndex === index
    const _betalingsdetaljer = index < 0
      ? _newBetalingsdetaljer
      : (inEditMode ? _editBetalingsdetaljer : betalingsdetaljer ?? undefined)

    return (
      <Box
        key={'repeatablerow-' + _namespace}
        id={'repeatablerow-' + _namespace}
        className={classNames(styles.repeatableBox, {
          [styles.new]: index < 0,
          [panelStyles.stripedRow]: index >= 0 && index % 2 === 0
        })}
        padding="space-16"
      >
        <VStack gap="space-16">
          <HStack gap="space-16" align="start" wrap={false}>
            <Heading size="xsmall">{t('p12000:form-betalingsdetaljer')}</Heading>
            <Spacer/>
            <AddRemovePanel<Betalingsdetaljer>
              item={betalingsdetaljer}
              index={index}
              inEditMode={inEditMode}
              alwaysVisible
              onRemove={() => onRemove(index)}
              onAddNew={onAddNew}
              onCancelNew={onCloseNew}
              onStartEdit={onStartEdit}
              onConfirmEdit={onSaveEdit}
              onCancelEdit={onCloseEdit}
            />
          </HStack>
          {inEditMode
            ? renderEditMode(_betalingsdetaljer, index, _namespace)
            : renderViewMode(_betalingsdetaljer, _namespace)
          }
        </VStack>
      </Box>
    )
  }

  return (
    <VStack gap="space-16">
      {_.isEmpty(items) && !_newForm
        ? (<em>{t('p12000:form-betalingsdetaljer-ingen')}</em>)
        : (<VStack gap="space-16">{items.map(renderRow)}</VStack>)
      }
      {_newForm
        ? renderRow(null, -1)
        : (
          <Box>
            <Button
              variant='tertiary'
              data-testid={namespace + '-add'}
              onClick={() => _setNewForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden/>}
            >
              {t('ui:add-new-x', {x: t('p12000:form-betalingsdetaljer')?.toLowerCase()})}
            </Button>
          </Box>
        )
      }
    </VStack>
  )
}

export default BetalingsdetaljerPanel
