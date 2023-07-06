import {Button, Heading, Label, Select} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column, PaddedHorizontallyDiv, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {AddCircle} from "@navikt/ds-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {Sivilstand} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {RepeatableRow} from "../../../components/StyledComponents";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "../../../declarations/types";
import {PSED, Validation} from "declarations/app";
import useValidation from "../../../hooks/useValidation";
import { resetValidation, setValidation } from 'actions/validation'
import performValidation from 'utils/performValidation'
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";
import {validateFamilieStatus, ValidationFamilieStatusProps} from "./validation";
import DateField from "../DateField/DateField";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface FamilieStatusProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const FamilieStatus: React.FC<FamilieStatusProps> = ({
  parentNamespace,
  parentTarget,
  PSED,
  updatePSED
}: FamilieStatusProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-sivilstand`
  const target = `${parentTarget}.sivilstand`
  const sivilstandList: Array<Sivilstand> | undefined = _.get(PSED, `${target}`)

  const [_newSivilstand, _setNewSivilstand] = useState<Sivilstand | undefined>(undefined)
  const [_editSivilstand, _setEditSivilstand] = useState<Sivilstand | undefined>(undefined)

  const [_editSivilstandIndex, _setEditSivilstandIndex] = useState<number | undefined>(undefined)
  const [_newSivilstandForm, _setNewSivilstandForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationFamilieStatusProps>(validateFamilieStatus, namespace)

  const setSivilstandStatus = (status: string, index: number) => {
    if (index < 0) {
      _setNewSivilstand({
        ..._newSivilstand,
        status: status.trim(),
        fradato: _newSivilstand?.fradato!
      })
      return
    }
    _setEditSivilstand({
      ..._editSivilstand,
      status: status.trim(),
      fradato: _editSivilstand?.fradato!
    })
  }

  const setSivilstandFraDato = (fraDato: Date | undefined, index: number) => {
    if(fraDato){
      const year = fraDato?.getFullYear()
      const month = (fraDato?.getMonth() + 1).toString().padStart(2, '0')
      const day = fraDato?.getDate().toString().padStart(2, '0')
      const dateString = year + "-" + month + "-" + day

      if (index < 0) {
        _setNewSivilstand({
          ..._newSivilstand,
          fradato: dateString,
          status: _newSivilstand?.status!
        })
        return
      }
      _setEditSivilstand({
        ..._editSivilstand,
        fradato: dateString,
        status: _editSivilstand?.status!
      })
    }
  }

  const onAddNewSivilstand = () => {
    const valid: boolean = _performValidation({
      sivilstand: _newSivilstand
    })

    if (!!_newSivilstand && valid) {
      let newSivilstandList: Array<Sivilstand> | undefined = _.cloneDeep(sivilstandList)
      if (_.isNil(newSivilstandList)) {
        newSivilstandList = []
      }
      newSivilstandList.push(_newSivilstand)
      dispatch(updatePSED(`${target}`, newSivilstandList))
      onCloseNewSivilstand()
    }
  }

  const onCloseNewSivilstand = () => {
    _setNewSivilstand(undefined)
    _setNewSivilstandForm(false)
    _setEditSivilstandIndex(undefined)
    _resetValidation()
  }

  const onCloseEditSivilstand = (namespace: string) => {
    _setEditSivilstand(undefined)
    _setEditSivilstandIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartEditSivilstand = (s: Sivilstand, index: number) => {
    if (_editSivilstandIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editSivilstandIndex)))
    }
    _setEditSivilstand(s)
    _setEditSivilstandIndex(index)
  }

  const onSaveEditSivilstand = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationFamilieStatusProps>(
      clonedvalidation, namespace, validateFamilieStatus, {
        sivilstand: _editSivilstand,
        index: _editSivilstandIndex
      }
    )
    if(!hasErrors) {
      dispatch(updatePSED(`${target}[${_editSivilstandIndex}]`, _editSivilstand))
      onCloseEditSivilstand(namespace + getIdx(_editSivilstandIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemoveSivilstand = (removedSivilstand: Sivilstand) => {
    const newSivilstandList: Array<Sivilstand> = _.reject(sivilstandList,
      (s: Sivilstand) => _.isEqual(removedSivilstand, s))
    dispatch(updatePSED(`${target}`, newSivilstandList))
  }

  const sivilstandStatusOptions = [
    {value:'enslig', label:'Enslig'},
    {value:'gift', label:'Gift'},
    {value:'samboer', label:'Samboer'},
    {value:'registrert_partnerskap', label:'Registrert partner'},
    {value:'skilt', label:'Skilt'},
    {value:'skilt_fra_registrert_partnerskap', label:'Skilt fra registrert partner'},
    {value:'separert', label:'Separert'},
    {value:'enke_enkemann', label:'Enke/enkemann'}
  ]

  const formatDate = (dateString: String | undefined) => {
    if(dateString) {
      const dateParts = dateString.split("-")
      return dateParts[2] + "." + dateParts[1] + "." + dateParts[0]
    } else {
      return dateString
    }
  }

  const renderSivilstand = (sivilstand: Sivilstand | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editSivilstandIndex === index
    const _sivilstand = index < 0 ? _newSivilstand : (inEditMode ? _editSivilstand : sivilstand)

    return(
      <RepeatableRow>
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Select
                    error={_v[_namespace + '-status']?.feilmelding}
                    id='status'
                    label="Status"
                    onChange={(e) => setSivilstandStatus(e.target.value, index)}
                    value={(_sivilstand?.status)  ?? ''}
                  >
                    <option value=''>Velg</option>
                    {sivilstandStatusOptions.map((option) => {
                      return(<option value={option.value}>{option.label}</option>)
                    })}
                  </Select>
                </Column>
                <Column>
                  <DateField
                    id='fraDato'
                    index={index}
                    label="Fra dato"
                    error={_v[_namespace + '-fradato']?.feilmelding}
                    namespace={_namespace}
                    onChanged={(e) => setSivilstandFraDato(e, index)}
                    defaultDate={_sivilstand?.fradato}
                  />
                </Column>
              </>
            )
            : (
              <>
                <Column>
                  <div>
                    {sivilstandStatusOptions.filter((s) => {
                      return s.value === _sivilstand?.status
                    })[0].label}
                  </div>
                </Column>
                <Column>
                  <div>{formatDate(_sivilstand?.fradato)}</div>
                </Column>
              </>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={sivilstand}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveSivilstand}
              onAddNew={onAddNewSivilstand}
              onCancelNew={onCloseNewSivilstand}
              onStartEdit={onStartEditSivilstand}
              onConfirmEdit={onSaveEditSivilstand}
              onCancelEdit={() => onCloseEditSivilstand(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">Familiestatus</Heading>
      <VerticalSeparatorDiv size='0.5' />
      <>
        <PaddedHorizontallyDiv>
          <AlignStartRow>
            <Column>
              <Label>
                {t('ui:status')}
              </Label>
            </Column>
            <Column>
              <Label>
                {t('ui:fradato')}
              </Label>
            </Column>
            <Column />
          </AlignStartRow>
        </PaddedHorizontallyDiv>
        <VerticalSeparatorDiv size='0.8' />
        {sivilstandList?.map(renderSivilstand)}
      </>
      {_newSivilstandForm
        ? renderSivilstand(null, -1)
        : (
          <Button
            variant='tertiary'
            onClick={() => _setNewSivilstandForm(true)}
          >
            <AddCircle />&nbsp;
            {t('ui:add-new-x', { x: t('buc:form-familiestatus')?.toLowerCase() })}
          </Button>
        )
      }
    </>
  )
}

export default FamilieStatus
