import React, {Fragment, useState} from "react";
import {Inntekt} from "src/declarations/p2000";
import _ from "lodash";
import {Select, Table} from "@navikt/ds-react";
import {getIdx} from "src/utils/namespace";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {resetValidation, setValidation} from "src/actions/validation";
import {useDispatch} from "react-redux";
import Input from "../../../components/Forms/Input";
import {Validation} from "src/declarations/app";
import {useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import useValidation from "../../../hooks/useValidation";
import {validateInntekt, ValidationInntektProps} from "./validation";
import performValidation from "../../../utils/performValidation";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import {useTranslation} from "react-i18next";
import DateField from "../DateField/DateField";
import {formatDate, removeWhiteSpaceAndReplaceCommas, replacePeriodsWithCommas} from "src/utils/utils";
import styles from './InntektRows.module.css'

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

export interface InntektProps {
  inntekt: Array<Inntekt> | null | undefined
  setInntekt: (i: Array<Inntekt>, index:number) => void
  parentIndex: number
  parentEditMode: boolean
  parentNamespace: string
  newInntektForm: boolean
  setNewInntektForm: (b:boolean) => void
}

const InntektRows: React.FC<InntektProps> = ({
  inntekt,
  setInntekt,
  parentIndex,
  parentEditMode,
  parentNamespace,
  newInntektForm,
  setNewInntektForm
}: InntektProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-inntekt`

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationInntektProps>(validateInntekt, namespace)

  const [_editInntekt, _setEditInntekt] = useState<Inntekt | undefined>(undefined)
  const [_newInntekt, _setNewInntekt] = useState<Inntekt | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)

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
        inntekt: _editInntekt,
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
    setNewInntektForm(false)
    _resetValidation()
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      inntekt: _newInntekt
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

  const setBelop = (beloep: string, index: number) => {
    setInntektProperty("beloep", removeWhiteSpaceAndReplaceCommas(beloep), index)
    const i = index < 0 ? _newInntekt : _editInntekt
    if(parseFloat(beloep) > 0){
      if(!i?.valuta || i?.valuta === "") {
        setInntektProperty("valuta", "NOK", index)
      }
      if(!i?.betalingshyppighetinntekt || i?.betalingshyppighetinntekt === ""){
        setInntektProperty("betalingshyppighetinntekt", "03", index)
      }

    }
  }

  const setInntektProperty = (property: string, value: string, index: number) => {
    if (index < 0) {
      _setNewInntekt((prevState) => {
        return {
          ...prevState,
          [property]: value
        }
      })
    }
    _setEditInntekt((prevState) => {
      return {
        ...prevState,
        [property]: value
      }
    })
  }

  const onRemove = (removedInntekt: Inntekt) => {
    const newInntekt: Array<Inntekt> = _.reject(inntekt,
      (i: Inntekt) => _.isEqual(removedInntekt, i))
    setInntekt(newInntekt, parentIndex)
  }

  const betalingshyppighetOptions = [
    {value:'01', label: t('p2000:form-betalingshyppighet-aarlig')},
    {value:'02', label: t('p2000:form-betalingshyppighet-kvartalsvis')},
    {value:'03', label: t('p2000:form-betalingshyppighet-maanedlig-12')},
    {value:'04', label: t('p2000:form-betalingshyppighet-maanedlig-13')},
    {value:'05', label: t('p2000:form-betalingshyppighet-maanedlig-14')},
    {value:'06', label: t('p2000:form-betalingshyppighet-ukentlig')},
    {value:'99', label: t('p2000:form-betalingshyppighet-annet')}
  ]

  const betalingshyppighetMap:any = {
    '01': t('p2000:form-betalingshyppighet-aarlig'),
    '02': t('p2000:form-betalingshyppighet-kvartalsvis'),
    '03': t('p2000:form-betalingshyppighet-maanedlig-12'),
    '04': t('p2000:form-betalingshyppighet-maanedlig-13'),
    '05': t('p2000:form-betalingshyppighet-maanedlig-14'),
    '06': t('p2000:form-betalingshyppighet-ukentlig'),
    '99': t('p2000:form-betalingshyppighet-annet')
  }

  const renderRow = (inntekt: Inntekt | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _inntekt = index < 0 ? _newInntekt : (inEditMode ? _editInntekt : inntekt)
    return (
      <Fragment key={_namespace}>
        {inEditMode && parentEditMode
          ? (
              <Table.Row>
                <Table.DataCell
                  className={styles.topAlignedCell}
                  width={"10%"}
                >
                  <Input
                    error={_v[_namespace + '-beloep']?.feilmelding}
                    namespace={_namespace}
                    id='inntekt-beloep'
                    label={t('p2000:form-arbeidsforhold-inntekt-belop')}
                    hideLabel={true}
                    onChanged={(e) => setBelop(e, index)}
                    value={replacePeriodsWithCommas(_inntekt?.beloep ?? '')}
                  />
                </Table.DataCell>
                <Table.DataCell
                  className={styles.topAlignedCell}
                  width={"20%"}
                >
                  <CountrySelect
                    error={_v[_namespace + '-valuta']?.feilmelding}
                    placeholder="Velg valuta"
                    namespace={_namespace}
                    id='inntekt-valuta'
                    label={t('p2000:form-arbeidsforhold-inntekt-valuta')}
                    hideLabel={true}
                    type='currency'
                    sort="noeuFirst"
                    onChanged={(e:any) => setInntektProperty("valuta", e.target.value, index)}
                    onOptionSelected={(valuta: Currency) => setInntektProperty("valuta", valuta.value, index)}
                    values={_inntekt?.valuta ?? ''}
                  />
                </Table.DataCell>
                <Table.DataCell
                  className={styles.topAlignedCell}
                  width={"20%"}
                >
                  <DateField
                    id='beloeputbetaltsiden'
                    label={t('p2000:form-arbeidsforhold-inntekt-belop-siden')}
                    hideLabel={true}
                    index={index}
                    error={_v[_namespace + '-beloeputbetaltsiden']?.feilmelding}
                    namespace={_namespace}
                    onChanged={(e) => setInntektProperty("beloeputbetaltsiden", e!, index)}
                    dateValue={_inntekt?.beloeputbetaltsiden ?? ''}
                  />
                </Table.DataCell>
                <Table.DataCell
                  className={styles.topAlignedCell}
                  width={"20%"}
                >
                  <Select
                    error={_v[_namespace + '-betalingshyppighetinntekt']?.feilmelding}
                    id='inntekt-betalingshyppighetinntekt'
                    label={t('p2000:form-arbeidsforhold-inntekt-betalingshyppighet')}
                    hideLabel={true}
                    onChange={(e) => setInntektProperty("betalingshyppighetinntekt", e.target.value, index)}
                    value={_inntekt?.betalingshyppighetinntekt ?? ''}
                  >
                    <option  value=''>Velg</option>
                    {betalingshyppighetOptions.map((option) => {
                      return(<option key={option.value} value={option.value}>{option.label}</option>)
                    })}
                  </Select>
                </Table.DataCell>
                <Table.DataCell
                  className={styles.topAlignedCell}
                  width={"20%"}
                >
                  <AddRemovePanel<Inntekt>
                    noMargin={true}
                    item={inntekt}
                    index={index}
                    inEditMode={inEditMode}
                    onRemove={onRemove}
                    onAddNew={onAddNew}
                    onCancelNew={onCloseNew}
                    onStartEdit={onStartEdit}
                    onConfirmEdit={onSaveEdit}
                    onCancelEdit={() => onCloseEdit(_namespace)}
                    alwaysVisible={true}
                  />
                </Table.DataCell>
              </Table.Row>
            )
          : (
            <Table.Row>
              <Table.DataCell width={"10%"}>
                {replacePeriodsWithCommas(inntekt?.beloep)}
              </Table.DataCell>
              <Table.DataCell width={"10%"}>
                {inntekt?.valuta}
              </Table.DataCell>
              <Table.DataCell width={"20%"}>
                {formatDate(inntekt?.beloeputbetaltsiden as string)}
              </Table.DataCell>
              <Table.DataCell width={"40%"}>
                {inntekt?.betalingshyppighetinntekt ? betalingshyppighetMap[inntekt?.betalingshyppighetinntekt] : ''}
              </Table.DataCell>
              <Table.DataCell width={"20%"}>
                {parentEditMode &&
                  <AddRemovePanel<Inntekt>
                    noMargin={true}
                    item={inntekt}
                    index={index}
                    inEditMode={inEditMode}
                    onRemove={onRemove}
                    onAddNew={onAddNew}
                    onCancelNew={onCloseNew}
                    onStartEdit={onStartEdit}
                    onConfirmEdit={onSaveEdit}
                    onCancelEdit={() => onCloseEdit(_namespace)}
                    alwaysVisible={true}
                  />
                }
              </Table.DataCell>
            </Table.Row>
          )
        }
      </Fragment>
    )
  }

  return (
    <>
      {_.isEmpty(inntekt) && !newInntektForm
        ? (
          <Table.Row>
            <Table.DataCell colSpan={5}>
              Ingen inntekter
            </Table.DataCell>
          </Table.Row>
        )
        : (
          <>
            {inntekt?.map(renderRow)}
          </>
        )
      }
      {parentEditMode && newInntektForm && renderRow(null, -1)}
    </>
  )
}

export default InntektRows
