import {BodyLong, Box, Button, Heading, HGrid, HStack, Select, Spacer} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {JSX, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getIdx} from "src/utils/namespace";
import Input from "../../../components/Forms/Input";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import useValidation from "../../../hooks/useValidation";
import {validateTelefon, ValidationTelefonProps} from "./validation";
import { resetValidation, setValidation } from 'src/actions/validation'
import performValidation from 'src/utils/performValidation'
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useAppSelector} from "src/store";
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Telefon as P2000Telefon} from "src/declarations/sed";
import styles from "src/assets/css/common.module.css";

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

  useEffect(() => {
    if(_newTelefonForm || _editTelefon){
      dispatch(addEditingItem("telefon"))
    } else if (!_newTelefonForm && !_editTelefon){
      dispatch(deleteEditingItem("telefon"))
    }
  }, [_newTelefonForm, _editTelefon])

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
      <Box
        key={_namespace}
        id={'repeatablerow-' + _namespace}
        className={classNames(styles.repeatableBox, {
          [styles.new]: index < 0,
          [styles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        paddingBlock={inEditMode ? "4 4" : "1 1"}
        paddingInline="4 4"
      >
        <HGrid columns={3} gap="4" align="start">
          {inEditMode
            ? (
              <>
                <Input
                  error={_v[_namespace + '-nummer']?.feilmelding}
                  namespace={_namespace}
                  id=''
                  label={t('p2000:form-telefon-nummer')}
                  onChanged={(e) => setTelefonNummer(e, index)}
                  value={(_telefon?.nummer)  ?? ''}
                />
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
              </>
            )
            : (
              <>
                <FormTextBox
                  id={_namespace + '-nummer'}
                  error={_v[_namespace + '-nummer']?.feilmelding}
                >
                  {_telefon?.nummer}
                </FormTextBox>
                <FormTextBox
                  id={_namespace + '-type'}
                  error={_v[_namespace + '-type']?.feilmelding}
                >
                  {_telefon?.type}
                </FormTextBox>
              </>
            )
          }
          <HStack>
            <Spacer/>
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
          </HStack>
        </HGrid>
      </Box>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-telefon')}</Heading>

        {_.isEmpty(telefonnumre)
          ? (
            <Box paddingBlock="2">
              <BodyLong>
                <em>{t('p2000:ingen-x-registrert', {x: 'telefon'})}</em>
              </BodyLong>
            </Box>
          )
          : (telefonnumre?.map(renderTelefon))
        }
      {_newTelefonForm
        ? renderTelefon(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewTelefonForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
            >
              {t('ui:add-new-x', { x: t('p2000:form-telefon')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default Telefon
