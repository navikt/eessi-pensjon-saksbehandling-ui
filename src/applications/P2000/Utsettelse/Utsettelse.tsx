import {BodyLong, Button, Heading, Label} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column} from "@navikt/hoykontrast";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getIdx} from "src/utils/namespace";
import {RepeatableRow} from "src/components/StyledComponents";
import AddRemovePanel from "src/components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {CountryCodeLists, PSED, Validation} from "src/declarations/app";
import useValidation from "src/hooks/useValidation";

import { resetValidation, setValidation } from 'src/actions/validation'
import performValidation from 'src/utils/performValidation'
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useAppSelector} from "src/store";
import {useTranslation} from "react-i18next";
import {Utsettelse as P2000UUtsettelse} from "src/declarations/p2000";
import {validateUtsettelse, ValidationUtsettelseProps} from "./validation";
import {Country} from "@navikt/land-verktoy";
import CountrySelect from "@navikt/landvelger";
import Input from "../../../components/Forms/Input";
import DateField from "../DateField/DateField";
import {dateToString, formatDate} from "src/utils/utils";
import FormText from "../../../components/Forms/FormText";
import FlagPanel from "src/components/FlagPanel/FlagPanel";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface UtsettelseProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
  countryCodes?: CountryCodeLists
}

const Utsettelse: React.FC<UtsettelseProps> = ({
  parentNamespace,
  parentTarget,
  PSED,
  updatePSED,
  countryCodes
}: UtsettelseProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-utsettelse`
  const target = `${parentTarget}.utsettelse`
  const utsettelseArray: Array<P2000UUtsettelse> | undefined = _.get(PSED, `${target}`)

  const [_newUtsettelse, _setNewUtsettelse] = useState<P2000UUtsettelse | undefined>(undefined)
  const [_editUtsettelse, _setEditUtsettelse] = useState<P2000UUtsettelse | undefined>(undefined)

  const [_editUtsettelseIndex, _setEditUtsettelseIndex] = useState<number | undefined>(undefined)
  const [_newUtsettelseForm, _setNewUtsettelseForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationUtsettelseProps>(validateUtsettelse, namespace)

  const setUtsettelseProp = (prop: string, value: string, index: number) => {
    if (index < 0) {
      _setNewUtsettelse({
        ..._newUtsettelse,
        [prop]: value
      })
      return
    }
    _setEditUtsettelse({
      ..._editUtsettelse,
      [prop]: value
    })
  }

  const onAddNewUtsettelse = () => {
    const valid: boolean = _performValidation({
      utsettelse: _newUtsettelse
    })

    if (!!_newUtsettelse && valid) {
      let newUtsettelseArray: Array<any> | undefined = _.cloneDeep(utsettelseArray)
      if (_.isNil(newUtsettelseArray)) {
        newUtsettelseArray = []
      }
      newUtsettelseArray.push(_newUtsettelse)
      dispatch(updatePSED(`${target}`, newUtsettelseArray))
      onCloseNewUtsettelse()
    }
  }

  const onCloseNewUtsettelse = () => {
    _setNewUtsettelse(undefined)
    _setNewUtsettelseForm(false)
    _setEditUtsettelseIndex(undefined)
    _resetValidation()
  }

  const onCloseEditUtsettelse = (namespace: string) => {
    _setEditUtsettelse(undefined)
    _setEditUtsettelseIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartEditUtsettelse = (u: any, index: number) => {
    if (_editUtsettelseIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editUtsettelseIndex)))
    }
    _setEditUtsettelse(u)
    _setEditUtsettelseIndex(index)
  }

  const onSaveEditUtsettelse = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationUtsettelseProps>(
      clonedvalidation, namespace, validateUtsettelse, {
        utsettelse: _editUtsettelse,
        index: _editUtsettelseIndex
      }
    )
    if(!hasErrors) {
      dispatch(updatePSED(`${target}[${_editUtsettelseIndex}]`, _editUtsettelse))
      onCloseEditUtsettelse(namespace + getIdx(_editUtsettelseIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemoveUtsettelse = (removedUtsettelse: any) => {
    const newUtsettelseArray: Array<any> = _.reject(utsettelseArray,
      (u: any) => _.isEqual(removedUtsettelse, u))
    dispatch(updatePSED(`${target}`, newUtsettelseArray))
  }
  const renderUtsettelse = (utsettelse: any | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editUtsettelseIndex === index
    const _utsettelse = index < 0 ? _newUtsettelse : (inEditMode ? _editUtsettelse : utsettelse)

    return(
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <CountrySelect
                    closeMenuOnSelect
                    error={_v[_namespace + '-land']?.feilmelding}
                    flagWave
                    id={_namespace + '-land'}
                    includeList={countryCodes?.euEftaLand}
                    label={t('p2000:form-diverse-utsettelse-land')}
                    hideLabel={index>0}
                    menuPortalTarget={document.body}
                    onOptionSelected={(e: Country) => setUtsettelseProp('land', e.value, index)}
                    values={_utsettelse?.land}
                  />
                </Column>
                <Column>
                  <Input
                    error={_v[_namespace + '-institusjonsnavn']?.feilmelding}
                    namespace={_namespace}
                    id={'institusjonsnavn'}
                    label={t('p2000:form-diverse-utsettelse-institusjonsnavn')}
                    hideLabel={index>0}
                    onChanged={(e) => setUtsettelseProp('institusjonsnavn', e, index)}
                    value={_utsettelse?.institusjonsnavn}
                  />
                </Column>
                <Column>
                  <DateField
                    error={_v[_namespace + '-tildato']?.feilmelding}
                    namespace={_namespace}
                    id={'tildato'}
                    index={index}
                    label={t('p2000:form-diverse-utsettelse-tildato')}
                    hideLabel={index>0}
                    onChanged={(e) => setUtsettelseProp("tildato", dateToString(e)!, index)}
                    defaultDate={_utsettelse?.tildato}
                  />
                </Column>
              </>
            )
            : (
              <>
                <Column>
                  <FormText
                    error={validation[_namespace + '-land']?.feilmelding}
                    id={_namespace + '-land'}
                  >
                    <Label hidden={index>0}>
                      {t('p2000:form-diverse-utsettelse-land')}
                    </Label>
                    <FlagPanel land={_utsettelse?.land}/>
                  </FormText>
                </Column>
                <Column>
                  <FormText
                    error={validation[_namespace + '-institusjonsnavn']?.feilmelding}
                    id={_namespace + '-institusjonsnavn'}
                  >
                    <Label hidden={index>0}>
                      {t('p2000:form-diverse-utsettelse-institusjonsnavn')}
                    </Label>
                    <BodyLong>{_utsettelse?.institusjonsnavn}</BodyLong>
                  </FormText>
                </Column>
                <Column>
                  <FormText
                    error={validation[_namespace + '-tildato']?.feilmelding}
                    id={_namespace + '-tildato'}
                  >
                    <Label hidden={index>0}>
                      {t('p2000:form-diverse-utsettelse-tildato')}
                    </Label>
                    <BodyLong>{formatDate(_utsettelse?.tildato)}</BodyLong>
                  </FormText>
                </Column>
              </>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={utsettelse}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveUtsettelse}
              onAddNew={onAddNewUtsettelse}
              onCancelNew={onCloseNewUtsettelse}
              onStartEdit={onStartEditUtsettelse}
              onConfirmEdit={onSaveEditUtsettelse}
              onCancelEdit={() => onCloseEditUtsettelse(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="xsmall">{t('p2000:form-diverse-utsettelse')}</Heading>
      <AlignStartRow>
        {_.isEmpty(utsettelseArray)
          ? (
            <Column>
              <em>{t('message:warning-no-utsettelse')}</em>
            </Column>
          )
          : (
            <Column>
              {utsettelseArray?.map(renderUtsettelse)}
            </Column>
          )
        }
      </AlignStartRow>
      {_newUtsettelseForm
        ? renderUtsettelse(null, -1)
        : (
          <Button
            variant='tertiary'
            onClick={() => _setNewUtsettelseForm(true)}
            iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
          >
            {t('ui:add-new-x', { x: t('p2000:form-diverse-utsettelse')?.toLowerCase() })}
          </Button>
        )
      }
    </>
  )
}

export default Utsettelse
