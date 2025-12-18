import {BodyLong, Box, Button, Heading, HStack, Label, Select, Spacer, Table, VStack} from "@navikt/ds-react";
import React, {Fragment, JSX, useEffect, useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import _ from "lodash";
import {State} from "src/declarations/reducers";
import {useDispatch} from "react-redux";
import {useAppSelector} from "src/store";
import {resetValidation, setValidation} from "src/actions/validation";
import useUnmount from "../../../hooks/useUnmount";
import performValidation from "../../../utils/performValidation";
import {Arbeidsforhold, Inntekt} from "src/declarations/p2000";
import {
  validateArbeidsforhold,
  validateYrkesaktivitet,
  ValidationArbeidsforholdProps,
  ValidationYrkesaktivitetProps
} from "./validation";
import {getIdx} from "src/utils/namespace";
import {Validation} from "src/declarations/app";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import useValidation from "../../../hooks/useValidation";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import InntektRows from "../Inntekt/InntektRows";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import styles from "src/assets/css/common.module.css";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
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
  const [_newInntektForm, _setNewInntektForm] = useState<boolean>(false)



  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationYrkesaktivitetProps>(
      clonedvalidation, namespace, validateYrkesaktivitet, {
        arbeidsforholdArray: arbeidsforholdArray
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    if(_newForm || _editArbeidsforhold){
      dispatch(addEditingItem("arbeidsforhold"))
    } else if (!_newForm && !_editArbeidsforhold){
      dispatch(deleteEditingItem("arbeidsforhold"))
    }
  }, [_newForm, _editArbeidsforhold])

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
    _setNewInntektForm(false)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewArbeidsforhold(undefined)
    _setNewForm(false)
    _setNewInntektForm(false)
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
    _setNewInntektForm(false)
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
      <Fragment key={_namespace}>
        <Box
          id={'repeatablerow-' + _namespace}
          key={index}
          className={classNames(styles.repeatableBox, {
            [styles.new]: index < 0,
            [styles.error]: hasNamespaceWithErrors(_v, _namespace),
            [styles.withBorder]: true
          })}
          padding="4"
        >
          <VStack gap="4">
            <HStack>
              {inEditMode
                ?
                (
                  <Select
                    error={_v[_namespace + '-yrkesaktivitet']?.feilmelding}
                    id={_namespace + '-yrkesaktivitet'}
                    label="Yrkesaktivitet"
                    onChange={(e) => setYrkeType(e.target.value, index)}
                    value={(_arbeidsforhold?.type)  ?? ''}
                  >
                    <option value=''>Velg</option>
                    {yrkeOptions.map((option) => {
                      return(<option key={option.value} value={option.value}>{option.label}</option>)
                    })}
                  </Select>
                )
                :
                (
                  <FormTextBox
                    error={_v[_namespace + '-yrkesaktivitet']?.feilmelding}
                    id={_namespace + '-yrkesaktivitet'}
                  >
                    <Label>
                      {t('p2000:yrkesaktivitet')}
                    </Label>
                    <BodyLong>
                      {getYrkeLabel(_arbeidsforhold?.type)}
                    </BodyLong>
                  </FormTextBox>
                )
              }
              <Spacer/>
              <Box>
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
              </Box>
            </HStack>

            <Table zebraStripes={true}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Valuta</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Beløp siden</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Betalingshyppighet</Table.HeaderCell>
                  <Table.HeaderCell scope="col"></Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {inEditMode
                  ? (
                    <InntektRows parentEditMode={true} newInntektForm={_newInntektForm} setNewInntektForm={_setNewInntektForm} setInntekt={setInntekt} parentIndex={index} inntekt={_arbeidsforhold?.inntekt} parentNamespace={_namespace}/>
                  )
                  : (
                    <InntektRows parentEditMode={false} newInntektForm={false} setNewInntektForm={_setNewInntektForm} setInntekt={setInntekt} parentIndex={index} inntekt={_arbeidsforhold?.inntekt} parentNamespace={_namespace}/>
                  )
                }
              </Table.Body>
            </Table>
            {inEditMode && !_newInntektForm &&
              <Box>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewInntektForm(true)}
                  iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
                >
                  {t('ui:add-new-x', { x: t('p2000:form-arbeidsforhold-inntekt')?.toLowerCase() })}
                </Button>
              </Box>
            }
          </VStack>
        </Box>
      </Fragment>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        {_.isEmpty(arbeidsforholdArray)
          ? (
            <BodyLong>
              <em>{t('p2000:ingen-x-registrert', {x: 'arbeidsforhold'})}</em>
            </BodyLong>
          )
          : (
            <>
              {arbeidsforholdArray?.map(renderRow)}
            </>
          )
        }
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-arbeidsforhold')?.toLowerCase() })}
              </Button>
            </Box>
          )}

      </VStack>
    </Box>
  )
}

export default Yrkesaktivitet
