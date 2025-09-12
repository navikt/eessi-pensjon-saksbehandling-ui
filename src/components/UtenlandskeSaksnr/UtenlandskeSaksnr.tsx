import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Box, Button, Heading, HGrid, HStack, Spacer} from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import Input from 'src/components/Forms/Input'
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
import styles from "src/assets/css/common.module.css";

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
  const namespace = `${parentNamespace}-saksnr`
  const target = `${parentTarget}.eessisak`

  const _parentObject: Nav | undefined = parentObject ? parentObject : _.get(PSED, `${parentTarget}`)
  const eessisaks: Array<Eessisak> = _.filter(_parentObject?.eessisak, p => p.land !== 'NO')

  const getSaksnr = (p: Eessisak | null): string => p ? p.land + '-' + p.saksnummer : 'new'

  const [_newEessisak, _setNewEessisak] = useState<Eessisak | undefined>(undefined)
  const [_editEessisak, _setEditEessisak] = useState<Eessisak | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationUtenlandskSaksnrProps>(validateUtenlandskSaksnr, namespace)

  useEffect(() => {
    if(_newForm || _editEessisak){
      dispatch(addEditingItem("utenlandskesaksnr"))
    } else if (!_newForm && !_editEessisak){
      dispatch(deleteEditingItem("utenlandskesaksnr"))
    }
  }, [_newForm, _editEessisak])

  useEffect(() => {
    if(!parentEditMode){
      _setNewForm(false)
      _setEditEessisak(undefined)
      _setEditIndex(undefined)
    }
  }, [parentEditMode])

  const setUtenlandskeSaksnr = (newEessisaks: Array<Eessisak>) => {
    let eessisaks: Array<Eessisak> | undefined = _.cloneDeep(newEessisaks)
    if (_.isNil(eessisaks)) {
      eessisaks = []
    }
    const norskEessisak: Eessisak | undefined = _parentObject ? _.find(_parentObject.eessisak, p => p.land === 'NO') : undefined
    if (!_.isEmpty(norskEessisak)) {
      eessisaks.unshift(norskEessisak!)
    }

    if(setPersonOpplysninger){
      setPersonOpplysninger("pin", eessisaks, parentIndex)
    } else if (updatePSED) {
      dispatch(updatePSED(`${target}`, eessisaks))
    }

    dispatch(resetValidation(namespace))
  }

  const setUtenlandskSaksnr = (newSaksnr: string, index: number) => {
    if (index < 0) {
      _setNewEessisak({
        ..._newEessisak,
        saksnummer: newSaksnr.trim()
      })
      _resetValidation(namespace + '-saksnummer')
      return
    }
    _setEditEessisak({
      ..._editEessisak,
      saksnummer: newSaksnr.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-saksnummer'))
  }

  const setUtenlandskLand = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewEessisak({
        ..._newEessisak,
        land: newLand.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditEessisak({
      ..._editEessisak,
      land: newLand.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-land'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditEessisak(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewEessisak(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (eessisak: Eessisak, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditEessisak(eessisak)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtenlandskSaksnrProps>(
      clonedValidation, namespace, validateUtenlandskSaksnr, {
        eessisak: _editEessisak,
        utenlandskeSaksnr: eessisaks,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editEessisak && !hasErrors) {
      const newEessisaks: Array<Eessisak> = _.cloneDeep(eessisaks) as Array<Eessisak>
      newEessisaks[_editIndex] = _editEessisak
      setUtenlandskeSaksnr(newEessisaks)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedEessisak: Eessisak) => {
    const newUtenlandskeSaksnr: Array<Eessisak> = _.reject(eessisaks, (eessisak: Eessisak) => _.isEqual(removedEessisak, eessisak))
    setUtenlandskeSaksnr(newUtenlandskeSaksnr)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      eessisak: _newEessisak,
      utenlandskeSaksnr: eessisaks,
    })
    if (!!_newEessisak && valid) {
      let newUtenlandskeSaksnr: Array<Eessisak> = _.cloneDeep(eessisaks) as Array<Eessisak>
      if (_.isNil(newUtenlandskeSaksnr)) {
        newUtenlandskeSaksnr = []
      }
      newUtenlandskeSaksnr.push(_newEessisak)
      setUtenlandskeSaksnr(newUtenlandskeSaksnr)
      onCloseNew()
    }
  }

  const renderRow = (eessisak: Eessisak | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _eessisak = index < 0 ? _newEessisak : (inEditMode ? _editEessisak : eessisak)
    return (
      <Box
        id={'repeatablerow-' + _namespace}
        key={getSaksnr(eessisak)}
        className={classNames(styles.repeatableBox, {
          [styles.new]: index < 0,
          [styles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        paddingBlock={inEditMode ? "4 4" : "1 1"}
        padding="4"
      >
        <HGrid
          columns={3}
          gap="4"
          align="start"
        >
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
                hideLabel={index > 0}
                label={t('buc:form-utenlandske-saksnr-land')}
                onOptionSelected={(e: Country) => setUtenlandskLand(e.value, index)}
                values={_eessisak?.land}
              />
              )
            : (
              <FormTextBox
                error={_v[_namespace + '-land']?.feilmelding}
                id={_namespace + '-land'}
                label={index === 0 ? t('buc:form-utenlandske-saksnr-land') : ""}
                padding={0}
              >
                <FlagPanel land={_eessisak?.land}/>
              </FormTextBox>
              )}
          {inEditMode
            ? (
              <Input
                error={_v[_namespace + '-saksnummer']?.feilmelding}
                id='saksnummer'
                label={t('buc:form-utenlandske-saksnr-saksnr')}
                hideLabel={index > 0}
                namespace={_namespace}
                onChanged={(id: string) => setUtenlandskSaksnr(id, index)}
                value={_eessisak?.saksnummer}
              />
              )
            : (
              <FormTextBox
                id={_namespace + '-saksnummer'}
                error={_v[_namespace + '-saksnummer']?.feilmelding}
                label={index === 0 ? t('buc:form-utenlandske-saksnr-saksnr') : ""}
                padding={0}
              >
                <BodyLong>{_eessisak?.saksnummer}</BodyLong>
              </FormTextBox>
              )
          }
          {parentEditMode &&
            <HStack>
              <Spacer/>
              <AddRemovePanel<Eessisak>
                item={eessisak}
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
        </HGrid>
      </Box>
    )
  }

  return (
    <>
      <Heading size="small">{t('buc:form-utenlandske-saksnr')}</Heading>
      {_.isEmpty(eessisaks)
        ? (
          <Box paddingBlock="2">
            <BodyLong>
              <em>{t('message:warning-no-utenlandskesaksnr')}</em>
            </BodyLong>
          </Box>
          )
        : (
          <>
            {eessisaks?.map(renderRow)}
          </>
          )
      }
      {_newForm
        ? renderRow(null, -1)
        : (eessisaks?.length ?? 0) < limit && parentEditMode && (
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
