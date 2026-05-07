import React, {JSX, useState} from "react";
import {Beloep, Inntekt} from "src/declarations/p2000";
import _ from "lodash";
import {BodyLong, HGrid, Label, Select, VStack} from "@navikt/ds-react";
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
import {validateBeloep, ValidationBeloepProps} from "./validation";
import performValidation from "../../../utils/performValidation";
import {Currency} from "@navikt/land-verktoy";
import {useTranslation} from "react-i18next";
import DateField from "../DateField/DateField";
import {formatDate, removeWhiteSpaceAndReplaceCommas, replacePeriodsWithCommas} from "src/utils/utils";
import styles from './BeloepRows.module.css'
import CurrencyDropdown from "src/components/CurrencyDropdown/CurrencyDropdown";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const beloepColumns = "minmax(0, 2fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 3fr) minmax(0, 2fr) 15rem"

export interface BeloepProps {
  beloep: Array<Beloep> | null | undefined
  setBeloep: (i: Array<Beloep>, index:number) => void
  parentIndex: number
  parentEditMode: boolean
  parentNamespace: string
  newBeloepForm: boolean
  setNewBeloepForm: (b:boolean) => void
}

const BeloepRows: React.FC<BeloepProps> = ({
  beloep,
  setBeloep,
  parentIndex,
  parentEditMode,
  parentNamespace,
  newBeloepForm,
  setNewBeloepForm
}: BeloepProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-beloep`

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationBeloepProps>(validateBeloep, namespace)

  const [_editBeloep, _setEditBeloep] = useState<Beloep | undefined>(undefined)
  const [_newBeloep, _setNewBeloep] = useState<Beloep | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)

  const onStartEdit = (beloep: Beloep, index: number) => {
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditBeloep(beloep)
    _setEditIndex(index)
  }

  const onCloseEdit = (namespace: string) => {
    _setEditBeloep(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationBeloepProps>(
      clonedValidation, namespace, validateBeloep, {
        beloepArray: beloep,
        beloep: _editBeloep,
        index: _editIndex,
      })
    if (_editIndex !== undefined && !!_editBeloep && !hasErrors) {
      const newBeloepArray: Array<Beloep> = _.cloneDeep(beloep) as Array<Beloep>
      newBeloepArray[_editIndex] = _editBeloep
      setBeloep(newBeloepArray, parentIndex)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onCloseNew = () => {
    _setNewBeloep(undefined)
    setNewBeloepForm(false)
    _resetValidation()
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      beloepArray: beloep,
      beloep: _newBeloep
    })
    if (!!_newBeloep && valid) {
      let newBeloepArray: Array<Beloep> = _.cloneDeep(beloep) as Array<Beloep>
      if (_.isNil(newBeloepArray)) {
        newBeloepArray = []
      }
      newBeloepArray.push(_newBeloep)
      setBeloep(newBeloepArray, parentIndex)
      onCloseNew()
    }
  }

  const setBelop = (beloep: string, index: number) => {
    setBeloepProperty("beloep", removeWhiteSpaceAndReplaceCommas(beloep), index)
    const i = index < 0 ? _newBeloep : _editBeloep
    if(parseFloat(beloep) > 0){
      if(!i?.valuta || i?.valuta === "") {
        setBeloepProperty("valuta", "NOK", index)
      }
      if(!i?.betalingshyppighetytelse || i?.betalingshyppighetytelse === ""){
        setBeloepProperty("betalingshyppighetytelse", "03", index)
      }

    }
  }

  const setBeloepProperty = (property: string, value: string, index: number) => {
    if (index < 0) {
      _setNewBeloep((prevState) => {
        return {
          ...prevState,
          [property]: value
        }
      })
    }
    _setEditBeloep((prevState) => {
      return {
        ...prevState,
        [property]: value
      }
    })
  }

  const onRemove = (removedBeloep: Beloep) => {
    const newBeloep: Array<Beloep> = _.reject(beloep,
      (b: Beloep) => _.isEqual(removedBeloep, b))
    setBeloep(newBeloep, parentIndex)
  }

  const betalingshyppighetOptions = [
    {value:'01', label: t('p2000:form-betalingshyppighet-aarlig')},
    {value:'02', label: t('p2000:form-betalingshyppighet-kvartalsvis')},
    {value:'03', label: t('p2000:form-betalingshyppighet-maanedlig-12')},
    {value:'04', label: t('p2000:form-betalingshyppighet-maanedlig-13')},
    {value:'05', label: t('p2000:form-betalingshyppighet-maanedlig-14')},
    {value:'06', label: t('p2000:form-betalingshyppighet-ukentlig')},
    {value:'99', label: t('p2000:form-betalingshyppighet-annet-ytelse')}
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

  const renderRow = (beloep: Beloep | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _beloep = index < 0 ? _newBeloep : (inEditMode ? _editBeloep : beloep)

    if (inEditMode && parentEditMode) {
      return (
        <div key={_namespace} className={styles.beloepRow}>
          <HGrid columns={beloepColumns} gap="space-16" align="start">
            <Input
              error={_v[_namespace + '-beloep']?.feilmelding}
              namespace={_namespace}
              id='beloep-beloep'
              label={t('p2000:form-ytelse-beloep-beloep')}
              hideLabel={true}
              onChanged={(e) => setBelop(e, index)}
              value={replacePeriodsWithCommas(_beloep?.beloep ?? '')}
            />
            <CurrencyDropdown
              error={_v[_namespace + '-valuta']?.feilmelding}
              placeholder="Velg valuta"
              id={_namespace + '-valuta'}
              label={t('p2000:form-ytelse-beloep-valuta')}
              hideLabel={true}
              sort="noeuFirst"
              onOptionSelected={(valuta: Currency) => setBeloepProperty("valuta", valuta.value, index)}
              currencyCodeListName="verdensValuta"
              values={_beloep?.valuta ?? ''}
              includeHistoricCurrencies={true}
            />
            <DateField
              id='gjeldendesiden'
              label={t('p2000:form-ytelse-beloep-beloep-siden')}
              hideLabel={true}
              index={index}
              error={_v[_namespace + '-gjeldendesiden']?.feilmelding}
              namespace={_namespace}
              onChanged={(e) => setBeloepProperty("gjeldendesiden", e!, index)}
              dateValue={_beloep?.gjeldendesiden ?? ''}
            />
            <Select
              error={_v[_namespace + '-betalingshyppighetytelse']?.feilmelding}
              id='beloep-betalingshyppighetytelse'
              label={t('p2000:form-ytelse-beloep-betalingshyppighet')}
              hideLabel={true}
              onChange={(e) => setBeloepProperty("betalingshyppighetytelse", e.target.value, index)}
              value={_beloep?.betalingshyppighetytelse ?? ''}
            >
              <option value=''>Velg</option>
              {betalingshyppighetOptions.map((option) => {
                return(<option key={option.value} value={option.value}>{option.label}</option>)
              })}
            </Select>
            <div>
              {_beloep?.betalingshyppighetytelse === "99" &&
                <Input
                  error={_v[_namespace + '-annenbetalingshyppighetytelse']?.feilmelding}
                  namespace={_namespace}
                  id='beloep-annenbetalingshyppighetytelse'
                  label={t('p2000:form-ytelse-beloep-annenbetalingshyppighetytelse')}
                  hideLabel={true}
                  onChanged={(e) => setBeloepProperty("annenbetalingshyppighetytelse", e, index)}
                  value={_beloep?.annenbetalingshyppighetytelse ?? ''}
                />
              }
            </div>
            <div className={styles.actionsCell}>
              <AddRemovePanel<Inntekt>
                item={beloep}
                noMargin={true}
                index={index}
                inEditMode={inEditMode}
                onRemove={onRemove}
                onAddNew={onAddNew}
                onCancelNew={onCloseNew}
                onStartEdit={onStartEdit}
                onConfirmEdit={onSaveEdit}
                onCancelEdit={() => onCloseEdit(_namespace)}
              />
            </div>
          </HGrid>
        </div>
      )
    }

    return (
      <div key={_namespace} className={styles.beloepRow}>
        <HGrid columns={beloepColumns} gap="space-16" align="center">
          <BodyLong>
            {replacePeriodsWithCommas(beloep?.beloep)}
          </BodyLong>
          <BodyLong>
            {beloep?.valuta}
          </BodyLong>
          <BodyLong>
            {formatDate(beloep?.gjeldendesiden as string)}
          </BodyLong>
          <BodyLong style={{gridColumn: "span 2"}}>
            {beloep?.betalingshyppighetytelse ?
              beloep?.betalingshyppighetytelse === "99" ?
                beloep?.annenbetalingshyppighetytelse :
                betalingshyppighetMap[beloep?.betalingshyppighetytelse]
              : ''
            }
          </BodyLong>
          <div className={styles.actionsCell}>
            {parentEditMode &&
              <AddRemovePanel<Inntekt>
                noMargin={true}
                item={beloep}
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
          </div>
        </HGrid>
      </div>
    )
  }

  return (
    <VStack>
      <HGrid columns={beloepColumns} gap="space-16" className={styles.headerRow}>
        <Label>Beløp</Label>
        <Label>Valuta</Label>
        <Label>Beløp siden</Label>
        <Label style={{gridColumn: "span 2"}}>Betalingshyppighet</Label>
        <div />
      </HGrid>
      {_.isEmpty(beloep) && !newBeloepForm
        ? (
          <BodyLong>
            <em>Ingen beløp</em>
          </BodyLong>
        )
        : (
          <>
            {beloep?.map(renderRow)}
          </>
        )
      }
      {parentEditMode && newBeloepForm && renderRow(null, -1)}
    </VStack>
  )
}

export default BeloepRows
