import {Button, Heading, Select} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column} from "@navikt/hoykontrast";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {Telefon as P2000Telefon} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";
import {RepeatableRow} from "../../../components/StyledComponents";
import Input from "../../../components/Forms/Input";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "../../../declarations/types";
import {PSED, Validation} from "declarations/app";
import useValidation from "../../../hooks/useValidation";
import {validateTelefon, ValidationTelefonProps} from "./validation";
import { resetValidation, setValidation } from 'actions/validation'
import performValidation from 'utils/performValidation'
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useAppSelector} from "../../../store";
import {useTranslation} from "react-i18next";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface TelefonProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Telefon: React.FC<TelefonProps> = ({
  parentNamespace,
  parentTarget,
  PSED,
  updatePSED
}: TelefonProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-person-kontakt-telefon`
  const target = `${parentTarget}.person.kontakt.telefon`
  const telefonnumre: Array<P2000Telefon> | undefined = _.get(PSED, `${target}`)

  const [_newTelefon, _setNewTelefon] = useState<P2000Telefon | undefined>(undefined)
  const [_editTelefon, _setEditTelefon] = useState<P2000Telefon | undefined>(undefined)

  const [_editTelefonIndex, _setEditTelefonIndex] = useState<number | undefined>(undefined)
  const [_newTelefonForm, _setNewTelefonForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationTelefonProps>(validateTelefon, namespace)

  const setTelefonNummer = (nummer: string, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        nummer: nummer.trim(),
        type: _newTelefon?.type!
      })
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      nummer: nummer.trim(),
      type: _editTelefon?.type!
    })
  }

  const setTelefonType = (type: string, index: number) => {
    if (index < 0) {
      _setNewTelefon({
        ..._newTelefon,
        type: type.trim(),
        nummer: _newTelefon?.nummer!
      })
      return
    }
    _setEditTelefon({
      ..._editTelefon,
      type: type.trim(),
      nummer: _editTelefon?.nummer!
    })
  }

  const onAddNewTelefon = () => {
    const valid: boolean = _performValidation({
      telefon: _newTelefon
    })

    if (!!_newTelefon && valid) {
      let newTelefonnumre: Array<P2000Telefon> | undefined = _.cloneDeep(telefonnumre)
      if (_.isNil(newTelefonnumre)) {
        newTelefonnumre = []
      }
      newTelefonnumre.push(_newTelefon)
      dispatch(updatePSED(`${target}`, newTelefonnumre))
      onCloseNewTelefon()
    }
  }

  const onCloseNewTelefon = () => {
    _setNewTelefon(undefined)
    _setNewTelefonForm(false)
    _setEditTelefonIndex(undefined)
    _resetValidation()
  }

  const onCloseEditTelefon = (namespace: string) => {
    _setEditTelefon(undefined)
    _setEditTelefonIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartEditTelefon = (t: P2000Telefon, index: number) => {
    if (_editTelefonIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editTelefonIndex)))
    }
    _setEditTelefon(t)
    _setEditTelefonIndex(index)
  }

  const onSaveEditTelefon = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationTelefonProps>(
      clonedvalidation, namespace, validateTelefon, {
        telefon: _editTelefon,
        index: _editTelefonIndex
      }
    )
    if(!hasErrors) {
      dispatch(updatePSED(`${target}[${_editTelefonIndex}]`, _editTelefon))
      onCloseEditTelefon(namespace + getIdx(_editTelefonIndex))
    } else {
        dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemoveTelefon = (removedTelefon: P2000Telefon) => {
    const newTelefonnumre: Array<P2000Telefon> = _.reject(telefonnumre,
      (t: P2000Telefon) => _.isEqual(removedTelefon, t))
    dispatch(updatePSED(`${target}`, newTelefonnumre))
  }
  const renderTelefon = (telefon: P2000Telefon | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editTelefonIndex === index
    const _telefon = index < 0 ? _newTelefon : (inEditMode ? _editTelefon : telefon)
    return(
      <RepeatableRow>
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Input
                    error={_v[_namespace + '-nummer']?.feilmelding}
                    namespace={_namespace}
                    id=''
                    label={t('p2000:form-telefon-nummer')}
                    onChanged={(e) => setTelefonNummer(e, index)}
                    value={(_telefon?.nummer)  ?? ''}
                  />
                </Column>
                <Column>
                  <Select
                    error={_v[_namespace + '-type']?.feilmelding}
                    label={t('p2000:form-telefon-type')}
                    onChange={(e) => setTelefonType(e.target.value, index)}
                    value={(_telefon?.type)  ?? ''}
                  >
                    <option value=''></option>
                    <option value='mobil'>{t('p2000:form-telefon-type-mobil')}</option>
                    <option value='hjem'>{t('p2000:form-telefon-type-hjem')}</option>
                    <option value='arbeid'>{t('p2000:form-telefon-type-arbeid')}</option>
                  </Select>
                </Column>
              </>
            )
            : (
              <Column>
                <div>{_telefon?.nummer} ({_telefon?.type})</div>
              </Column>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={telefon}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveTelefon}
              onAddNew={onAddNewTelefon}
              onCancelNew={onCloseNewTelefon}
              onStartEdit={onStartEditTelefon}
              onConfirmEdit={onSaveEditTelefon}
              onCancelEdit={() => onCloseEditTelefon(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-telefon')}</Heading>
      <AlignStartRow>
        <Column>
          {telefonnumre?.map(renderTelefon)}
        </Column>
      </AlignStartRow>
      {_newTelefonForm
        ? renderTelefon(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewTelefonForm(true)}
            >
              <PlusCircleIcon />&nbsp;
              {t('ui:add-new-x', { x: t('p2000:form-telefon')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default Telefon
