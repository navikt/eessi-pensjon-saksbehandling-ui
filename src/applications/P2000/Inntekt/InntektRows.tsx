import React, {useState} from "react";
import {Inntekt} from "../../../declarations/p2000";
import _ from "lodash";
import {BodyLong, Label} from "@navikt/ds-react";
import {
  VerticalSeparatorDiv,
  AlignStartRow,
  Column, AlignEndColumn,
} from "@navikt/hoykontrast";
import {getIdx} from "../../../utils/namespace";
import classNames from "classnames";
//import {hasNamespaceWithErrors} from "../../../utils/validation";
import {RepeatableRow} from "../../../components/StyledComponents";
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
  const { validation } = useAppSelector(mapState)
  const namespace = `${parentNamespace}-inntekt`

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationInntektProps>(validateInntekt, namespace)

  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_editInntekt, _setEditInntekt] = useState<Inntekt | undefined>(undefined)
  const [_newInntekt, _setNewInntekt] = useState<Inntekt | undefined>(undefined)

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
    //_setNewForm(false)
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

  const renderRow = (inntekt: Inntekt, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _inntekt = index < 0 ? _newInntekt : (inEditMode ? _editInntekt : inntekt)

    return (
      <RepeatableRow
        id={'repeatablerow-' + _namespace}
        key={index}
        className={classNames({
          new: index < 0,
        })}
      >
        <AlignStartRow>
          <Column>
            {index <= 0 &&
              <AlignStartRow>
                <Column>
                  <Label>Beløp</Label>
                </Column>
                <Column>
                  <Label>Valuta</Label>
                </Column>
                <Column>
                  <Label>Utbetalt siden</Label>
                </Column>
                <Column>
                  <Label>Hyppighet</Label>
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
                      label="Beløp"
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("beloep", e, index)}
                      value={_inntekt?.beloep ?? ''}
                    />
                  </Column>
                  <Column>
                    <Input
                      error={_v[namespace + '-valuta']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-valuta'
                      label="Valuta"
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("valuta", e, index)}
                      value={_inntekt?.valuta ?? ''}
                    />
                  </Column>
                  <Column>
                    <Input
                      error={_v[namespace + '-beloeputbetaltsiden']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-beloeputbetaltsiden'
                      label="Utbetalt siden"
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("beloeputbetaltsiden", e, index)}
                      value={_inntekt?.beloeputbetaltsiden ?? ''}
                    />
                  </Column>
                  <Column>
                    <Input
                      error={_v[namespace + '-betalingshyppighetinntekt']?.feilmelding}
                      namespace={namespace}
                      id='inntekt-betalingshyppighetinntekt'
                      label="Hyppighet"
                      hideLabel={true}
                      onChanged={(e) => setInntektProperty("betalingshyppighetinntekt", e, index)}
                      value={_inntekt?.betalingshyppighetinntekt ?? ''}
                    />
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
                onRemove={()=>{}}
                onAddNew={onAddNew}
                onCancelNew={onCloseNew}
                onStartEdit={onStartEdit}
                onConfirmEdit={onSaveEdit}
                onCancelEdit={() => onCloseEdit(_namespace)}
              />
            }
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
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
    </>
  )
}

export default InntektRows
