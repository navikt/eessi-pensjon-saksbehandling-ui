import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Button, Heading, Label} from '@navikt/ds-react'
import Flag from '@navikt/flagg-ikoner'
import {
  AlignEndColumn,
  AlignStartRow,
  Column,
  FlexCenterDiv,
  HorizontalSeparatorDiv,
  PaddedHorizontallyDiv,
  VerticalSeparatorDiv
} from '@navikt/hoykontrast'
import CountryData, { Country } from '@navikt/land-verktoy'
import CountrySelect from '@navikt/landvelger'
import { resetValidation, setValidation } from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import FormText from 'src/components/Forms/FormText'
import { RepeatableRow } from 'src/components/StyledComponents'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'src/store'
import { getIdx } from 'src/utils/namespace'
import performValidation from 'src/utils/performValidation'
import { hasNamespaceWithErrors } from 'src/utils/validation'
import {
  validateStatsborgerskap,
  ValidationStatsborgerskapProps,
} from './validation'
import {Person, Statsborgerskap as P2000Statsborgerskap} from "src/declarations/p2000";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, CountryCodes, Validation} from "src/declarations/app";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface CountryCodeSelector {
  countryCodes: CountryCodes | undefined
}

const mapCounryCodeState = (state: State): CountryCodeSelector => ({
  countryCodes: state.app.countryCodes
})

export interface StatsborgerskapProps {
  limit?: number
  parentNamespace: string
  parentTarget?: string
  parentIndex?: number
  parentEditMode?: boolean
  PSED?: PSED | null | undefined
  updatePSED?: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  setPersonOpplysninger?: any
  person?: Person | undefined
}

const Statsborgerskap: React.FC<StatsborgerskapProps> = ({
  limit = 99,
  parentNamespace,
  parentTarget,
  parentIndex,
  parentEditMode = true,
  PSED,
  updatePSED,
  setPersonOpplysninger,
  person
}: StatsborgerskapProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { validation } = useAppSelector(mapState)
  const { countryCodes } = useAppSelector(mapCounryCodeState)
  const namespace = `${parentNamespace}-statsborgerskap`
  const target = `${parentTarget}.person.statsborgerskap`
  const sedVersion = _.get(PSED, "sedVersion")

  const statsborgerskap: Array<P2000Statsborgerskap> | undefined = person?.statsborgerskap

  const countryData = CountryData.getCountryInstance('nb')

  const [_newStatsborgerskap, _setNewStatsborgerskap] = useState<P2000Statsborgerskap | undefined>(undefined)
  const [_editStatsborgerskap, _setEditStatsborgerskap] = useState<P2000Statsborgerskap | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationStatsborgerskapProps>(validateStatsborgerskap, namespace)

  const countryCodesByVersion = countryCodes ? countryCodes[sedVersion as keyof CountryCodes] : undefined

  const setStatsborgerskap = (newStatsborgerskap: Array<P2000Statsborgerskap>) => {
    let statsborgerskap: Array<P2000Statsborgerskap> | undefined = _.cloneDeep(newStatsborgerskap)
    if (_.isNil(statsborgerskap)) {
      statsborgerskap = []
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
    const inEditMode = index < 0 || _editIndex === index
    const _statsborgerskap = index < 0 ? _newStatsborgerskap : (inEditMode ? _editStatsborgerskap : statsborgerskap)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
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
                <CountrySelect
                  closeMenuOnSelect
                  data-testid={_namespace + '-land'}
                  error={_v[_namespace + '-land']?.feilmelding}
                  flagWave
                  id={_namespace + '-land'}
                  includeList={countryCodesByVersion?.statsborgerskap}
                  hideLabel={index >= 0}
                  label={t('p2000:form-utenlandske-pin-land')}
                  menuPortalTarget={document.body}
                  onOptionSelected={(e: Country) => setStatsborgerskapLand(e.value, index)}
                  values={_statsborgerskap?.land}
                />
                )
              : (
                <FormText
                  error={_validation[_namespace + '-land']?.feilmelding}
                  id={_namespace + '-land'}
                >
                  <FlexCenterDiv>
                    {_statsborgerskap?.land && <Flag size='S' country={_statsborgerskap?.land!} />}
                    <HorizontalSeparatorDiv />
                    {countryData.findByValue(_statsborgerskap?.land)?.label ?? _statsborgerskap?.land}
                  </FlexCenterDiv>
                </FormText>
                )}
          </Column>
            <AlignEndColumn>
              {parentEditMode &&
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
              }
            </AlignEndColumn>
        </AlignStartRow>
        <VerticalSeparatorDiv size='0.5' />
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-person-statsborgerskap')}</Heading>
      <VerticalSeparatorDiv size='0.5' />
      {_.isEmpty(statsborgerskap)
        ? (
          <BodyLong>
            <em>{t('message:warning-no-statsborgerskap')}</em>
          </BodyLong>
          )
        : (
          <>
            <PaddedHorizontallyDiv>
              <AlignStartRow>
                <Column>
                  <Label>
                    {t('p2000:form-person-statsborgerskap-land')}
                  </Label>
                </Column>
                <Column />
              </AlignStartRow>
            </PaddedHorizontallyDiv>
            <VerticalSeparatorDiv size='0.8' />
            {statsborgerskap?.map(renderRow)}
          </>
          )
      }
      <VerticalSeparatorDiv />
      {_newForm
        ? renderRow(null, -1)
        : (
          <>
            {(statsborgerskap?.length ?? 0) < limit && parentEditMode && (
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-person-statsborgerskap')?.toLowerCase() })}
              </Button>
            )}
          </>
          )}
    </>
  )
}

export default Statsborgerskap
