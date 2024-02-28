import {BodyLong, Button, Heading, Label, Select} from "@navikt/ds-react";
import {
  VerticalSeparatorDiv,
  PaddedDiv,
  AlignStartRow,
  Column,
  AlignEndColumn,
  PileDiv
} from "@navikt/hoykontrast";
import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "store";
import {resetValidation, setValidation} from "actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {Arbeidsforhold, Inntekt} from "../../../declarations/p2000";
import {
  validateArbeidsforhold,
  validateYrkesaktivitet,
  ValidationArbeidsforholdProps,
  ValidationYrkesaktivitetProps
} from "./validation";
import {getIdx} from "../../../utils/namespace";
import {Validation} from "../../../declarations/app";
import {RepeatableRow} from "../../../components/StyledComponents";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "../../../utils/validation";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import useValidation from "../../../hooks/useValidation";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import InntektRows from "../Inntekt/InntektRows";
//import useValidation from "../../../hooks/useValidation";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Yrkesaktivitet: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-yrkesaktivitet`
  const target = 'pensjon.bruker.arbeidsforhold'
  const arbeidsforholdArray:  Array<Arbeidsforhold> | undefined = _.get(PSED, target)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationArbeidsforholdProps>(validateArbeidsforhold, namespace)

  const [_newArbeidsforhold, _setNewArbeidsforhold] = useState<Arbeidsforhold | undefined>(undefined)
  const [_editArbeidsforhold, _setEditArbeidsforhold] = useState<Arbeidsforhold | undefined>(undefined)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)


  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYrkesaktivitetProps>(
      clonedvalidation, namespace, validateYrkesaktivitet, {
        arbeidsforholdArray: arbeidsforholdArray
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  const setArbeidsforhold = (newArbeidsforholdArray: Array<Arbeidsforhold>) => {
    let arbeidsforholdArray: Array<Arbeidsforhold> | undefined = _.cloneDeep(newArbeidsforholdArray)
    if (_.isNil(arbeidsforholdArray)) {
      arbeidsforholdArray = []
    }
    dispatch(updatePSED(`${target}`, arbeidsforholdArray))
    dispatch(resetValidation(namespace))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditArbeidsforhold(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewArbeidsforhold(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (arbeidsforhold: Arbeidsforhold, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditArbeidsforhold(arbeidsforhold)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationArbeidsforholdProps>(
      clonedValidation, namespace, validateArbeidsforhold, {
        arbeidsforhold: _editArbeidsforhold,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editArbeidsforhold && !hasErrors) {
      const newArbeidsforholdArray: Array<Arbeidsforhold> = _.cloneDeep(arbeidsforholdArray) as Array<Arbeidsforhold>
      newArbeidsforholdArray[_editIndex] = _editArbeidsforhold
      setArbeidsforhold(newArbeidsforholdArray)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedArbeidsforhold: Arbeidsforhold) => {
    const newArbeidsforhold: Array<Arbeidsforhold> = _.reject(arbeidsforholdArray,
      (a: Arbeidsforhold) => _.isEqual(removedArbeidsforhold, a))
    dispatch(updatePSED(`${target}`, newArbeidsforhold))
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      arbeidsforhold: _newArbeidsforhold,
    })
    if (!!_newArbeidsforhold && valid) {
      let newArbeidsforholdArray: Array<Arbeidsforhold> = _.cloneDeep(arbeidsforholdArray) as Array<Arbeidsforhold>
      if (_.isNil(newArbeidsforholdArray)) {
        newArbeidsforholdArray = []
      }
      newArbeidsforholdArray.push(_newArbeidsforhold)
      setArbeidsforhold(newArbeidsforholdArray)
      onCloseNew()
    }
  }

  const yrkeOptions = [
    {value:'forsikrede_har_fortsatt_inntektsgivende_arbeid', label: t('p2000:form-yrke-type-forsikrede_har_fortsatt_inntektsgivende_arbeid')},
    {value:'forsikrede_driver_fortsatt_selvstendig_naerigsvirksomhet', label: t('p2000:form-yrke-type-forsikrede_driver_fortsatt_selvstendig_naerigsvirksomhet')},
    {value:'forsikrede_har_ikke_lenger_inntektsgivendwe_arbeid', label: t('p2000:form-yrke-type-forsikrede_har_ikke_lenger_inntektsgivendwe_arbeid')},
    {value:'forsikrede_driver_ikke_lenger_selvstendig_naerigsvirksomhet', label: t('p2000:form-yrke-type-forsikrede_driver_ikke_lenger_selvstendig_naerigsvirksomhet')},
    {value:'forsikrede_skal_pensjonere_seg_fra_inntektsgivende_arbeid', label: t('p2000:form-yrke-type-forsikrede_skal_pensjonere_seg_fra_inntektsgivende_arbeid')},
    {value:'forsikrede_skal_pensjonere_seg_fra_selvstendig_naerigsvirksomhet', label: t('p2000:form-yrke-type-forsikrede_skal_pensjonere_seg_fra_selvstendig_naerigsvirksomhet')},
    {value:'forsikrede_skal_starte_inntektsgivende_arbeid', label: t('p2000:form-yrke-type-forsikrede_skal_starte_inntektsgivende_arbeid')},
    {value:'forsikrede_skal_starte_selvstendig_naerigsvirksomhet', label: t('p2000:form-yrke-type-forsikrede_skal_starte_selvstendig_naerigsvirksomhet')}
  ]

  const getYrkeLabel = (yrke:string | undefined | null) => {
    const selectedYrke = yrkeOptions.find((y) => y.value === yrke)
    return selectedYrke ? selectedYrke.label : yrke
  }

  const setYrkeType = (yrke: string, index: number) => {
    if (index < 0) {
      _setNewArbeidsforhold({
        ..._newArbeidsforhold,
        type: yrke
      })
      return
    }
    _setEditArbeidsforhold({
      ..._editArbeidsforhold,
      type: yrke
    })
  }

  const setInntekt = (inntekt: Array<Inntekt>, index: number) => {
    if (index < 0) {
      _setNewArbeidsforhold({
        ..._newArbeidsforhold,
        inntekt: inntekt
      })
      return
    }
    _setEditArbeidsforhold({
      ..._editArbeidsforhold,
      inntekt: inntekt
    })
  }

  const renderRow = (arbeidsforhold: Arbeidsforhold | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _arbeidsforhold = index < 0 ? _newArbeidsforhold : (inEditMode ? _editArbeidsforhold : arbeidsforhold)
    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={index}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
      >
        <VerticalSeparatorDiv size='0.5' />
        <AlignStartRow>
          <Column flex="2">
            {inEditMode
              ?
              (
                <PileDiv>
                  <Select
                    error={_v[_namespace + '-yrkesaktivitet']?.feilmelding}
                    id='yrkesaktivitet'
                    label="Yrkesaktivitet"
                    onChange={(e) => setYrkeType(e.target.value, index)}
                    value={(_arbeidsforhold?.type)  ?? ''}
                  >
                    <option value=''>Velg</option>
                    {yrkeOptions.map((option) => {
                      return(<option value={option.value}>{option.label}</option>)
                    })}
                  </Select>
                </PileDiv>
              )
              :
              (
                <>
                  <Label>
                    {t('p2000:yrkesaktivitet')}
                  </Label>
                  <BodyLong>
                    {getYrkeLabel(_arbeidsforhold?.type)}
                  </BodyLong>
                </>
              )
            }
          </Column>
          <AlignEndColumn>
            <AddRemovePanel<Arbeidsforhold>
              item={arbeidsforhold}
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
          </AlignEndColumn>
        </AlignStartRow>
        <AlignStartRow>
          <Column flex="2">
            {inEditMode
              ? (
                <InntektRows parentEditMode={true} setInntekt={setInntekt} parentIndex={index} inntekt={_arbeidsforhold?.inntekt} parentNamespace={_namespace}/>
              )
              : (
                <InntektRows parentEditMode={false} setInntekt={setInntekt} parentIndex={index} inntekt={_arbeidsforhold?.inntekt} parentNamespace={_namespace}/>
              )
            }
          </Column>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        {_.isEmpty(arbeidsforholdArray)
          ? (
            <BodyLong>
              {t('p2000:ingen-arbeidsforhold')}
            </BodyLong>
          )
          : (
            <>
              {arbeidsforholdArray?.map(renderRow)}
            </>
          )
        }
        <VerticalSeparatorDiv />
        {_newForm
          ? renderRow(null, -1)
          : (
            <AlignEndColumn>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-arbeidsforhold')?.toLowerCase() })}
              </Button>
            </AlignEndColumn>
          )}

      </PaddedDiv>
    </>
  )
}

export default Yrkesaktivitet
