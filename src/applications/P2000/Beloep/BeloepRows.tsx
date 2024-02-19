import React, {useState} from "react";
import {Beloep} from "../../../declarations/p2000";
import _ from "lodash";
import {BodyLong, Button, Select} from "@navikt/ds-react";
import {
  AlignStartRow,
  Column, AlignEndColumn,
} from "@navikt/hoykontrast";
import {getIdx} from "../../../utils/namespace";
import classNames from "classnames";
//import {hasNamespaceWithErrors} from "../../../utils/validation";
import {RepeatableRowNoHorizontalPadding} from "../../../components/StyledComponents";
import BeloepRow from "./BeloepRow";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {resetValidation, setValidation} from "../../../actions/validation";
import {useDispatch} from "react-redux";
import Input from "../../../components/Forms/Input";
import {Validation} from "../../../declarations/app";
import {useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import useValidation from "../../../hooks/useValidation";
import {validateBeloep, ValidationBeloepProps} from "./validation";
import performValidation from "../../../utils/performValidation";
import CountrySelect from "@navikt/landvelger";
import {Currency} from "@navikt/land-verktoy";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import DateField from "../DateField/DateField";
import {dateToString} from "../../../utils/utils";
import ErrorLabel from "../../../components/Forms/ErrorLabel";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

export interface BeloepProps {
  beloep: Array<Beloep> | null | undefined
  setBeloep: (i: Array<Beloep>, index:number) => void
  parentIndex: number
  parentEditMode: boolean
  parentNamespace: string
}

const BeloepRows: React.FC<BeloepProps> = ({
  beloep,
  setBeloep,
  parentIndex,
  parentEditMode,
  parentNamespace
}: BeloepProps): JSX.Element => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-beloep`

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationBeloepProps>(validateBeloep, namespace)

  const [_editBeloep, _setEditBeloep] = useState<Beloep | undefined>(undefined)
  const [_newBeloep, _setNewBeloep] = useState<Beloep | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)

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
    _setNewForm(false)
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
    setBeloepProperty("beloep", beloep, index)
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

  const renderRow = (beloep: Beloep | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _beloep = index < 0 ? _newBeloep : (inEditMode ? _editBeloep : beloep)

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
            {inEditMode && parentEditMode
              ? (
                <>
                  <AlignStartRow>
                    <Column>
                      <Input
                        error={_v[_namespace + '-beloep']?.feilmelding}
                        namespace={_namespace}
                        id='beloep-beloep'
                        label={t('p2000:form-ytelse-beloep-beloep')}
                        hideLabel={index > 0}
                        onChanged={(e) => setBelop(e, index)}
                        value={_beloep?.beloep ?? ''}
                      />
                    </Column>
                    <Column>
                      <CountrySelect
                        error={_v[_namespace + '-valuta']?.feilmelding}
                        placeholder="Velg valuta"
                        namespace={_namespace}
                        id='beloep-valuta'
                        label={t('p2000:form-ytelse-beloep-valuta')}
                        hideLabel={index > 0}
                        type='currency'
                        sort="noeuFirst"
                        onChanged={(e:any) => setBeloepProperty("valuta", e.target.value, index)}
                        onOptionSelected={(valuta: Currency) => setBeloepProperty("valuta", valuta.value, index)}
                        values={_beloep?.valuta ?? ''}
                      />
                    </Column>
                    <Column>
                      <DateField
                        id='beloep-gjeldendesiden'
                        label={t('p2000:form-ytelse-beloep-beloep-siden')}
                        hideLabel={index > 0}
                        index={index}
                        error={_v[_namespace + '-gjeldendesiden']?.feilmelding}
                        namespace={_namespace}
                        onChanged={(e) => setBeloepProperty("gjeldendesiden", dateToString(e)!, index)}
                        defaultDate={_beloep?.gjeldendesiden}
                      />
                    </Column>
                    <Column>
                      <Select
                        error={_v[_namespace + '-betalingshyppighetytelse']?.feilmelding}
                        id='beloep-betalingshyppighetytelse'
                        label={t('p2000:form-ytelse-beloep-betalingshyppighet')}
                        hideLabel={index > 0}
                        onChange={(e) => setBeloepProperty("betalingshyppighetytelse", e.target.value, index)}
                        value={_beloep?.betalingshyppighetytelse ?? ''}
                      >
                        <option value=''>Velg</option>
                        {betalingshyppighetOptions.map((option) => {
                          return(<option value={option.value}>{option.label}</option>)
                        })}
                      </Select>
                    </Column>
                    <Column>
                      {_beloep?.betalingshyppighetytelse === "99" &&
                        <Input
                          error={_v[_namespace + '-annenbetalingshyppighetytelse']?.feilmelding}
                          namespace={_namespace}
                          id='beloep-annenbetalingshyppighetytelse'
                          label={t('p2000:form-ytelse-beloep-annenbetalingshyppighetytelse')}
                          hideLabel={index > 0}
                          onChanged={(e) => setBeloepProperty("annenbetalingshyppighetytelse", e, index)}
                          value={_beloep?.annenbetalingshyppighetytelse ?? ''}
                        />
                      }
                    </Column>

                  </AlignStartRow>
                  <ErrorLabel error={_v[_namespace + '-beloepArray']?.feilmelding}/>
                </>
              )
              : (
                <BeloepRow beloep={_beloep} index={index}/>
              )
            }
          </Column>
          <AlignEndColumn>
            {parentEditMode &&
              <AddRemovePanel<Beloep>
                item={beloep}
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
      {_.isEmpty(beloep)
        ? (
          <BodyLong>
            Ingen beløp
          </BodyLong>
        )
        : (
          <>
            {beloep?.map(renderRow)}
          </>
        )
      }
      {parentEditMode && _newForm
        ? renderRow(null, -1)
        : parentEditMode && (
          <>
            <Button
              variant='tertiary'
              onClick={() => _setNewForm(true)}
            >
              <PlusCircleIcon fontSize="1.5rem" />&nbsp;
              {t('ui:add-new-x', { x: t('p2000:form-ytelse-beloep')?.toLowerCase() })}
            </Button>
          </>
        )}

    </>
  )
}

export default BeloepRows
