import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Box, Button, Heading, HGrid, HStack, Label, Spacer} from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import Input from 'src/components/Forms/Input'
import {RepeatableBox, TopAlignedGrid} from 'src/components/StyledComponents'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'src/store'
import { getIdx } from 'src/utils/namespace'
import performValidation from 'src/utils/performValidation'
import { hasNamespaceWithErrors } from 'src/utils/validation'
import {validateUtenlandskSaksnr, ValidationUtenlandskSaksnrProps} from './validation'
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import FlagPanel from "src/components/FlagPanel/FlagPanel";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Nav, Eessisak} from "src/declarations/sed";

export interface MainFormSelector {
  validation: Validation
  editingItems?: any
}

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface UtenlandskeSaksnrProps {
  limit?: number
  PSED?: PSED | null | undefined
  parentNamespace: string
  parentTarget?: string
  parentIndex?: number
  parentEditMode?: boolean
  updatePSED?: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  setPersonOpplysninger?: any
  parentObject?: Nav | undefined
}

const UtenlandskeSaksnr: React.FC<UtenlandskeSaksnrProps> = ({
  limit = 99,
  parentNamespace,
  parentTarget,
  parentIndex,
  parentEditMode = true,
  PSED,
  updatePSED,
  setPersonOpplysninger,
  parentObject
}: UtenlandskeSaksnrProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-pin`
  const target = `${parentTarget}.eessisak`

  const _parentObject: Nav | undefined = parentObject ? parentObject : _.get(PSED, `${parentTarget}`)
  const utenlandskePINs: Array<Eessisak> = _.filter(_parentObject?.eessisak, p => p.land !== 'NO')

  const getId = (p: Eessisak | null): string => p ? p.land + '-' + p.saksnummer : 'new'

  const [_newPin, _setNewPin] = useState<Eessisak | undefined>(undefined)
  const [_editPin, _setEditPin] = useState<Eessisak | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationUtenlandskSaksnrProps>(validateUtenlandskSaksnr, namespace)

  useEffect(() => {
    if(_newForm || _editPin){
      dispatch(addEditingItem("utenlandskepin"))
    } else if (!_newForm && !_editPin){
      dispatch(deleteEditingItem("utenlandskepin"))
    }
  }, [_newForm, _editPin])

  useEffect(() => {
    if(!parentEditMode){
      _setNewForm(false)
      _setEditPin(undefined)
      _setEditIndex(undefined)
    }
  }, [parentEditMode])

  const setUtenlandskePin = (newPins: Array<Eessisak>) => {
    let pins: Array<Eessisak> | undefined = _.cloneDeep(newPins)
    if (_.isNil(pins)) {
      pins = []
    }
    const norskPin: Eessisak | undefined = _parentObject ? _.find(_parentObject.eessisak, p => p.land === 'NO') : undefined
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
        saksnummer: newIdentifikator.trim()
      })
      _resetValidation(namespace + '-identifikator')
      return
    }
    _setEditPin({
      ..._editPin,
      saksnummer: newIdentifikator.trim()
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

  const onStartEdit = (pin: Eessisak, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditPin(pin)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtenlandskSaksnrProps>(
      clonedValidation, namespace, validateUtenlandskSaksnr, {
        pin: _editPin,
        utenlandskePINs: utenlandskePINs,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editPin && !hasErrors) {
      const newPins: Array<Eessisak> = _.cloneDeep(utenlandskePINs) as Array<Eessisak>
      newPins[_editIndex] = _editPin
      setUtenlandskePin(newPins)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedPin: Eessisak) => {
    const newUtenlandskePins: Array<Eessisak> = _.reject(utenlandskePINs, (pin: Eessisak) => _.isEqual(removedPin, pin))
    setUtenlandskePin(newUtenlandskePins)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      pin: _newPin,
      utenlandskePINs: utenlandskePINs,
    })
    if (!!_newPin && valid) {
      let newUtenlandskePins: Array<Eessisak> = _.cloneDeep(utenlandskePINs) as Array<Eessisak>
      if (_.isNil(newUtenlandskePins)) {
        newUtenlandskePins = []
      }
      newUtenlandskePins.push(_newPin)
      setUtenlandskePin(newUtenlandskePins)
      onCloseNew()
    }
  }

  const renderRow = (pin: Eessisak | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _pin = index < 0 ? _newPin : (inEditMode ? _editPin : pin)
    return (
      <RepeatableBox
        id={'repeatablerow-' + _namespace}
        key={getId(pin)}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="4"
      >
        <TopAlignedGrid columns={3} gap="4">
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
                label={t('buc:form-utenlandske-saksnr-land')}
                onOptionSelected={(e: Country) => setUtenlandskeLand(e.value, index)}
                values={_pin?.land}
              />
              )
            : (
              <FormTextBox
                error={_v[_namespace + '-land']?.feilmelding}
                id={_namespace + '-land'}
              >
                <FlagPanel land={_pin?.land}/>
              </FormTextBox>
              )}
          {inEditMode
            ? (
              <Input
                error={_v[_namespace + '-identifikator']?.feilmelding}
                id='identifikator'
                label={t('buc:form-utenlandske-saksnr-saksnr')}
                hideLabel={index >= 0}
                namespace={_namespace}
                onChanged={(id: string) => setUtenlandskeIdentifikator(id, index)}
                value={_pin?.saksnummer}
              />
              )
            : (
              <FormTextBox
                id={_namespace + '-identifikator'}
                error={_v[_namespace + '-identifikator']?.feilmelding}
              >
                <BodyLong>{_pin?.saksnummer}</BodyLong>
              </FormTextBox>
              )
          }
          {parentEditMode &&
            <HStack>
              <Spacer/>
              <AddRemovePanel<Eessisak>
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
            </HStack>
          }
        </TopAlignedGrid>
      </RepeatableBox>
    )
  }

  return (
    <>
      <Heading size="small">{t('buc:form-utenlandske-saksnr')}</Heading>
      {_.isEmpty(utenlandskePINs)
        ? (
          <Box paddingBlock="2">
            <BodyLong>
              <em>{t('message:warning-no-utenlandskesaksnr')}</em>
            </BodyLong>
          </Box>
          )
        : (
          <>
            <Box paddingBlock="2" paddingInline="4">
              <HGrid columns={3} gap="4">
                <Label>
                  {t('buc:form-utenlandske-saksnr-land')}
                </Label>
                <Label>
                  {t('buc:form-utenlandske-saksnr-saksnr')}
                </Label>
                <Spacer/>
              </HGrid>
            </Box>
            {utenlandskePINs?.map(renderRow)}
          </>
          )
      }
      {_newForm
        ? renderRow(null, -1)
        : (utenlandskePINs?.length ?? 0) < limit && parentEditMode && (
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
            >
              {t('ui:add-new-x', { x: t('buc:form-utenlandske-saksnr')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default UtenlandskeSaksnr
