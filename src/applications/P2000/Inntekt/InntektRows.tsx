import React, {useState} from "react";
import {Inntekt} from "../../../declarations/p2000";
import _ from "lodash";
import {BodyLong, Button, Label, Select} from "@navikt/ds-react";
import {
  VerticalSeparatorDiv,
  AlignStartRow,
  Column, AlignEndColumn,
} from "@navikt/hoykontrast";
import {getIdx} from "../../../utils/namespace";
import classNames from "classnames";
//import {hasNamespaceWithErrors} from "../../../utils/validation";
import {RepeatableRowNoHorizontalPadding} from "../../../components/StyledComponents";
import InntektRow from "./InntektRow";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {resetValidation, setValidation} from "../../../actions/validation";
import {useDispatch} from "react-redux";
import Input from "../../../components/Forms/Input";
import {Validation} from "../../../declarations/app";
import {useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import useValidation from "../../../hooks/useValidation";
import {validateInntekt, ValidationInntektProps} from "./validation";
import performValidation from "../../../utils/performValidation";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import {AddCircle} from "@navikt/ds-icons";
import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

export interface InntektProps {
  inntekt: Array<Inntekt> | null | undefined
  setInntekt: (i: Array<Inntekt>, index:number) => void
  parentIndex: number
  parentEditMode: boolean
  parentNamespace: string
}

const InntektRows: React.FC<InntektProps> = ({
  inntekt,
  setInntekt,
  parentIndex,
  parentEditMode,
  parentNamespace
}: InntektProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-inntekt`

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationInntektProps>(validateInntekt, namespace)

  const [_editInntekt, _setEditInntekt] = useState<Inntekt | undefined>(undefined)
  const [_newInntekt, _setNewInntekt] = useState<Inntekt | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)

  const onStartEdit = (inntekt: Inntekt, index: number) => {
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditInntekt(inntekt)
    _setEditIndex(index)
  }

  const onCloseEdit = (namespace: string) => {
    _setEditInntekt(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationInntektProps>(
      clonedValidation, namespace, validateInntekt, {
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editInntekt && !hasErrors) {
      const newInntektArray: Array<Inntekt> = _.cloneDeep(inntekt) as Array<Inntekt>
      newInntektArray[_editIndex] = _editInntekt
      setInntekt(newInntektArray, parentIndex)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onCloseNew = () => {
    _setNewInntekt(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
    })
    if (!!_newInntekt && valid) {
      let newInntektArray: Array<Inntekt> = _.cloneDeep(inntekt) as Array<Inntekt>
      if (_.isNil(newInntektArray)) {
        newInntektArray = []
      }
      newInntektArray.push(_newInntekt)
      setInntekt(newInntektArray, parentIndex)
      onCloseNew()
    }
  }

  const setInntektProperty = (property: string, value: string, index: number) => {
    if (index < 0) {
      _setNewInntekt({
        ..._newInntekt,
        [property]: value
      })
      return
    }
    _setEditInntekt({
      ..._editInntekt,
      [property]: value
    })
  }

  const onRemove = (removedInntekt: Inntekt) => {
    const newInntekt: Array<Inntekt> = _.reject(inntekt,
      (i: Inntekt) => _.isEqual(removedInntekt, i))
    setInntekt(newInntekt, parentIndex)
  }

  const betalingshyppighetOptions = [
    {value:'01', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-aarlig')},
    {value:'02', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-kvartalsvis')},
    {value:'03', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-maanedlig-12')},
    {value:'04', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-maanedlig-13')},
    {value:'05', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-maanedlig-14')},
    {value:'06', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-ukentlig')},
    {value:'99', label: t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet-annet')}
  ]

  const renderRow = (inntekt: Inntekt | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _inntekt = index < 0 ? _newInntekt : (inEditMode ? _editInntekt : inntekt)

    return (
      <RepeatableRowNoHorizontalPadding
        id={'repeatablerow-' + _namespace}
        key={index}
        className={classNames({
          new: index < 0,
        })}
      >
        <AlignStartRow>
          <Column flex="2">
            {index <= 0 &&
              <AlignStartRow>
                <Column>
                  <Label>{t('p2000:form-arbeidsforhold-inntekt-belop')}</Label>
                </Column>
                <Column>
                  <Label>{t('p2000:form-arbeidsforhold-inntekt-valuta')}</Label>
                </Column>
                <Column>
                  <Label>{t('p2000:form-arbeidsforhold-inntekt-belop-siden')}</Label>
                </Column>
                <Column>
                  <Label>{t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet')}</Label>
                </Column>
              </AlignStartRow>
            }
            {inEditMode && parentEditMode
              ? (
                <AlignStartRow>
                  <Column>
                    <Input
                      error={_v[namespace + '-beloep']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-beloep'
                      label={t('p2000:form-arbeidsforhold-inntekt-belop')}
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("beloep", e, index)}
                      value={_inntekt?.beloep ?? ''}
                    />
                  </Column>
                  <Column>
                    <CountrySelect
                      error={_v[namespace + '-valuta']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-valuta'
                      label={t('p2000:form-arbeidsforhold-inntekt-valuta')}
                      hideLabel={true}
                      type='currency'
                      sort="noeuFirst"
                      onChanged={(e:any) => setInntektProperty("valuta", e.target.value, index)}
                      onOptionSelected={(valuta: Currency) => setInntektProperty("valuta", valuta.value, index)}
                      values={_inntekt?.valuta ?? ''}
                    />
                  </Column>
                  <Column>
                    <Input
                      error={_v[namespace + '-beloeputbetaltsiden']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-beloeputbetaltsiden'
                      label={t('p2000:form-arbeidsforhold-inntekt-belop-siden')}
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("beloeputbetaltsiden", e, index)}
                      value={_inntekt?.beloeputbetaltsiden ?? ''}
                    />
                  </Column>
                  <Column>
                    <Select
                      error={_v[namespace + '-betalingshyppighetinntekt']?.feilmelding}
                      id='inntekt-betalingshyppighetinntekt'
                      label={t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet')}
                      hideLabel={true}
                      onChange={(e) => setInntektProperty("betalingshyppighetinntekt", e.target.value, index)}
                      value={_inntekt?.betalingshyppighetinntekt ?? ''}
                    >
                      <option value=''>Velg</option>
                      {betalingshyppighetOptions.map((option) => {
                        return(<option value={option.value}>{option.label}</option>)
                      })}
                    </Select>
                  </Column>
                </AlignStartRow>
              )
              : (
                <InntektRow inntekt={_inntekt}/>
              )
            }
          </Column>
          <AlignEndColumn>
            {parentEditMode &&
              <AddRemovePanel<Inntekt>
                item={inntekt}
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
      </RepeatableRowNoHorizontalPadding>
    )
  }

  return (
    <>
      {_.isEmpty(inntekt)
        ? (
          <BodyLong>
            Ingen inntekter
          </BodyLong>
        )
        : (
          <>
            {inntekt?.map(renderRow)}
          </>
        )
      }
      <VerticalSeparatorDiv />

      {parentEditMode && _newForm
        ? renderRow(null, -1)
        : parentEditMode && (
          <>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <AddCircle />&nbsp;
              {t('ui:add-new-x', { x: t('p2000:form-arbeidsforhold-inntekt')?.toLowerCase() })}
            </Button>
          </>
        )}

    </>
  )
}

export default InntektRows
