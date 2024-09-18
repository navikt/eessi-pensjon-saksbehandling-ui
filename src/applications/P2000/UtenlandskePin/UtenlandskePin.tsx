import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Button, Heading, Label} from '@navikt/ds-react'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import FormText from 'src/components/Forms/FormText'
import Input from 'src/components/Forms/Input'
import { RepeatableRow } from 'src/components/StyledComponents'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'src/store'
import { getIdx } from 'src/utils/namespace'
import performValidation from 'src/utils/performValidation'
import { hasNamespaceWithErrors } from 'src/utils/validation'
import {validateUtenlandskPIN, ValidationUtenlandskPINProps} from './validation'
import {Person, PIN} from "src/declarations/p2000";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import FlagPanel from "src/components/FlagPanel/FlagPanel";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface UtenlandskPinProps {
  limit?: number
  PSED?: PSED | null | undefined
  parentNamespace: string
  parentTarget?: string
  parentIndex?: number
  parentEditMode?: boolean
  updatePSED?: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  setPersonOpplysninger?: any
  person?: Person | undefined
}

const UtenlandskePin: React.FC<UtenlandskPinProps> = ({
  limit = 99,
  parentNamespace,
  parentTarget,
  parentIndex,
  parentEditMode = true,
  PSED,
  updatePSED,
  setPersonOpplysninger,
  person,
}: UtenlandskPinProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-pin`
  const target = `${parentTarget}.person.pin`

  const _person:  Person | undefined = person ? person : _.get(PSED, `${parentTarget}.person`)
  const utenlandskePINs: Array<PIN> = _.filter(_person?.pin, p => p.land !== 'NO')

  const getId = (p: PIN | null): string => p ? p.land + '-' + p.identifikator : 'new'

  const [_newPin, _setNewPin] = useState<PIN | undefined>(undefined)
  const [_editPin, _setEditPin] = useState<PIN | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationUtenlandskPINProps>(validateUtenlandskPIN, namespace)

  const setUtenlandskePin = (newPins: Array<PIN>) => {
    let pins: Array<PIN> | undefined = _.cloneDeep(newPins)
    if (_.isNil(pins)) {
      pins = []
    }
    const norskPin: PIN | undefined = _person ? _.find(_person.pin, p => p.land === 'NO') : undefined
    if (!_.isEmpty(norskPin)) {
      pins.unshift(norskPin!)
    }

    if(setPersonOpplysninger){
      setPersonOpplysninger("pin", pins, parentIndex)
    } else if (updatePSED) {
      dispatch(updatePSED(`${target}`, pins))
    }

    dispatch(resetValidation(namespace))
  }

  const setUtenlandskeIdentifikator = (newIdentifikator: string, index: number) => {
    if (index < 0) {
      _setNewPin({
        ..._newPin,
        identifikator: newIdentifikator.trim()
      })
      _resetValidation(namespace + '-identifikator')
      return
    }
    _setEditPin({
      ..._editPin,
      identifikator: newIdentifikator.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-identifikator'))
  }

  const setUtenlandskeLand = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewPin({
        ..._newPin,
        land: newLand.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditPin({
      ..._editPin,
      land: newLand.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-land'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditPin(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewPin(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (pin: PIN, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPin(pin)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtenlandskPINProps>(
      clonedValidation, namespace, validateUtenlandskPIN, {
        pin: _editPin,
        utenlandskePINs: utenlandskePINs,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editPin && !hasErrors) {
      const newPins: Array<PIN> = _.cloneDeep(utenlandskePINs) as Array<PIN>
      newPins[_editIndex] = _editPin
      setUtenlandskePin(newPins)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPin: PIN) => {
    const newUtenlandskePins: Array<PIN> = _.reject(utenlandskePINs, (pin: PIN) => _.isEqual(removedPin, pin))
    setUtenlandskePin(newUtenlandskePins)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      pin: _newPin,
      utenlandskePINs: utenlandskePINs,
    })
    if (!!_newPin && valid) {
      let newUtenlandskePins: Array<PIN> = _.cloneDeep(utenlandskePINs) as Array<PIN>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins.push(_newPin)
      setUtenlandskePin(newUtenlandskePins)
      onCloseNew()
    }
  }

  const renderRow = (pin: PIN | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pin = index < 0 ? _newPin : (inEditMode ? _editPin : pin)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={getId(pin)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column>
            {inEditMode
              ? (
                <CountryDropdown
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  id={_namespace + '-land'}
                  countryCodeListName="euEftaLand"
                  excludeNorway={true}
                  hideLabel={index >= 0}
                  label={t('p2000:form-utenlandske-pin-land')}
                  onOptionSelected={(e: Country) => setUtenlandskeLand(e.value, index)}
                  values={_pin?.land}
                />
                )
              : (
                <FormText
                  error={_validation[_namespace + '-land']?.feilmelding}
                  id={_namespace + '-land'}
                >
                  <FlagPanel land={_pin?.land}/>
                </FormText>
                )}
          </Column>
          <Column>
            {inEditMode
              ? (
                <Input
                  error={_v[_namespace + '-identifikator']?.feilmelding}
                  id='identifikator'
                  label={t('p2000:form-utenlandske-pin-pin')}
                  hideLabel={index >= 0}
                  namespace={_namespace}
                  onChanged={(id: string) => setUtenlandskeIdentifikator(id, index)}
                  value={_pin?.identifikator}
                />
                )
              : (
                <FormText
                  id={_namespace + '-identifikator'}
                  error={_v[_namespace + '-identifikator']?.feilmelding}
                >
                  <BodyLong>{_pin?.identifikator}</BodyLong>
                </FormText>
                )}
          </Column>
            <AlignEndColumn>
              {parentEditMode &&
                <AddRemovePanel<PIN>
                  item={pin}
                  marginTop={index < 0}
                  index={index}
                  inEditMode={inEditMode}
                  onRemove={onRemove}
                  onAddNew={onAddNew}
                  onCancelNew={onCloseNew}
                  onStartEdit={onStartEdit}
                  onConfirmEdit={onSaveEdit}
                  onCancelEdit={() => onCloseEdit(_namespace)}
                />
              }
            </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-utenlandske-pin')}</Heading>
      <VerticalSeparatorDiv size='0.5' />
      {_.isEmpty(utenlandskePINs)
        ? (
          <BodyLong>
            <em>{t('message:warning-no-utenlandskepin')}</em>
          </BodyLong>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('p2000:form-utenlandske-pin-land')}
                  </Label>
                </Column>
                <Column>
                  <Label>
                    {t('p2000:form-utenlandske-pin-pin')}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {utenlandskePINs?.map(renderRow)}
          </>
          )
      }
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {(utenlandskePINs?.length ?? 0) < limit && parentEditMode && (
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-utenlandske-pin')?.toLowerCase() })}
              </Button>
            )}
          </>
          )}
    </>
  )
}

export default UtenlandskePin
