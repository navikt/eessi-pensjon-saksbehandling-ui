import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Box, Button, Heading, HGrid, HStack, Spacer} from '@navikt/ds-react'
import { Country } from '@navikt/land-verktoy'
import { resetValidation, setValidation } from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'src/store'
import { getIdx } from 'src/utils/namespace'
import performValidation from 'src/utils/performValidation'
import { hasNamespaceWithErrors } from 'src/utils/validation'
import {
  validateStatsborgerskap,
  ValidationStatsborgerskapProps,
} from './validation'
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import FlagPanel from "src/components/FlagPanel/FlagPanel";
import CountryDropdown from "src/components/CountryDropdown/CountryDropdown";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Person, Statsborgerskap as P2000Statsborgerskap} from "src/declarations/sed";
import styles from "src/assets/css/common.module.css";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface StatsborgerskapProps {
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

const Statsborgerskap: React.FC<StatsborgerskapProps> = ({
  limit = 99,
  PSED,
  parentNamespace,
  parentTarget,
  parentIndex,
  parentEditMode = true,
  updatePSED,
  setPersonOpplysninger,
  person
}: StatsborgerskapProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-statsborgerskap`
  const target = `${parentTarget}.person.statsborgerskap`

  const _person:  Person | undefined = person ? person : _.get(PSED, `${parentTarget}.person`)
  const statsborgerskap: Array<P2000Statsborgerskap> | undefined = _person?.statsborgerskap

  const [_newStatsborgerskap, _setNewStatsborgerskap] = useState<P2000Statsborgerskap | undefined>(undefined)
  const [_editStatsborgerskap, _setEditStatsborgerskap] = useState<P2000Statsborgerskap | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationStatsborgerskapProps>(validateStatsborgerskap, namespace)

  useEffect(() => {
    if(_newForm || _editStatsborgerskap){
      dispatch(addEditingItem("statsborgerskap"))
    } else if (!_newForm && !_editStatsborgerskap){
      dispatch(deleteEditingItem("statsborgerskap"))
    }
  }, [_newForm, _editStatsborgerskap])

  useEffect(() => {
    if(!parentEditMode){
      _setNewForm(false)
      _setEditStatsborgerskap(undefined)
      _setEditIndex(undefined)
    }
  }, [parentEditMode])

  const setStatsborgerskap = (newStatsborgerskap: Array<P2000Statsborgerskap>) => {
    let statsborgerskap: Array<P2000Statsborgerskap> | undefined = _.cloneDeep(newStatsborgerskap)

    if(statsborgerskap && statsborgerskap.length === 0){
      statsborgerskap = undefined
    }

    if(setPersonOpplysninger){
      setPersonOpplysninger("statsborgerskap", statsborgerskap, parentIndex)
    } else if (updatePSED) {
      dispatch(updatePSED(`${target}`, statsborgerskap))
    }

    dispatch(resetValidation(namespace))
  }

  const setStatsborgerskapLand = (newLand: string, index: number) => {
    if (index < 0) {
      _setNewStatsborgerskap({
        ..._newStatsborgerskap,
        land: newLand.trim()
      })
      _resetValidation(namespace + '-land')
      return
    }
    _setEditStatsborgerskap({
      ..._editStatsborgerskap,
      land: newLand.trim()
    })
    dispatch(resetValidation(namespace + getIdx(index) + '-land'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditStatsborgerskap(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewStatsborgerskap(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (statsborgerskap: P2000Statsborgerskap, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditStatsborgerskap(statsborgerskap)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationStatsborgerskapProps>(
      clonedValidation, namespace, validateStatsborgerskap, {
        statsborgerskap: _editStatsborgerskap,
        statsborgerskapArray: statsborgerskap,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editStatsborgerskap && !hasErrors) {
      const newStatsborgerskap: Array<P2000Statsborgerskap> = _.cloneDeep(statsborgerskap) as Array<P2000Statsborgerskap>
      newStatsborgerskap[_editIndex] = _editStatsborgerskap
      setStatsborgerskap(newStatsborgerskap)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedStatsborgerskap: P2000Statsborgerskap) => {
    const newStatsborgerskap: Array<P2000Statsborgerskap> = _.reject(statsborgerskap, (statsborgerskap: P2000Statsborgerskap) => _.isEqual(removedStatsborgerskap, statsborgerskap))
    setStatsborgerskap(newStatsborgerskap)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      statsborgerskap: _newStatsborgerskap,
      statsborgerskapArray: statsborgerskap
    })
    if (!!_newStatsborgerskap && valid) {
      let newStatsborgerskap: Array<P2000Statsborgerskap> = _.cloneDeep(statsborgerskap) as Array<P2000Statsborgerskap>
      if (_.isNil(newStatsborgerskap)) {
        newStatsborgerskap = []
      }
      newStatsborgerskap.push(_newStatsborgerskap)
      setStatsborgerskap(newStatsborgerskap)
      onCloseNew()
    }
  }

  const renderRow = (statsborgerskap: P2000Statsborgerskap | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = (index < 0 || _editIndex === index) && parentEditMode
    const _statsborgerskap = index < 0 ? _newStatsborgerskap : (inEditMode ? _editStatsborgerskap : statsborgerskap)
    return (
      <Box
        key={'repeatablerow-' + _namespace + index}
        id={'repeatablerow-' + _namespace}
        className={classNames(styles.repeatableBox, {
          [styles.new]: index < 0 && parentEditMode,
          [styles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        paddingBlock={inEditMode ? "4 4" : "1 1"}
        paddingInline="4 4"
      >
        <HGrid columns={2}>
          {inEditMode
            ? (
              <CountryDropdown
                closeMenuOnSelect
                data-testid={_namespace + '-land'}
                error={_v[_namespace + '-land']?.feilmelding}
                flagWave
                id={_namespace + '-land'}
                countryCodeListName="statsborgerskap"
                hideLabel={index >= 0}
                label={t('buc:form-utenlandske-pin-land')}
                onOptionSelected={(e: Country) => setStatsborgerskapLand(e.value, index)}
                values={_statsborgerskap?.land}
              />
              )
            : (
              <FormTextBox
                error={_validation[_namespace + '-land']?.feilmelding}
                id={_namespace + '-land'}
                label={index === 0 ? t('p2000:form-person-statsborgerskap-land') : ""}
                padding={0}
              >
                <FlagPanel land={_statsborgerskap?.land}/>
              </FormTextBox>
              )
          }
          {parentEditMode &&
            <HStack>
              <Spacer/>
              <AddRemovePanel<P2000Statsborgerskap>
                item={statsborgerskap}
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
      <Heading size="small">{t('p2000:form-person-statsborgerskap')}</Heading>
      {_.isEmpty(statsborgerskap)
        ? (
          <Box paddingBlock="2">
            <BodyLong>
              <em>{t('message:warning-no-statsborgerskap')}</em>
            </BodyLong>
          </Box>
          )
        : (
          <>
            {statsborgerskap?.map(renderRow)}
          </>
          )
      }
      {_newForm
        ? renderRow(null, -1)
        : (statsborgerskap?.length ?? 0) < limit && parentEditMode && (
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
            >
              {t('ui:add-new-x', { x: t('p2000:form-person-statsborgerskap')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default Statsborgerskap
