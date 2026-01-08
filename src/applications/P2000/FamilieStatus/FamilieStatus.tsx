import {BodyLong, Box, Button, Heading, HGrid, HStack, Select, Spacer} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {JSX, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getIdx} from "src/utils/namespace";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import useValidation from "../../../hooks/useValidation";
import { resetValidation, setValidation } from 'src/actions/validation'
import performValidation from 'src/utils/performValidation'
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useAppSelector} from "src/store";
import {useTranslation} from "react-i18next";
import {validateFamilieStatus, ValidationFamilieStatusProps} from "./validation";
import DateField from "../DateField/DateField";
import {formatDate} from "src/utils/utils";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";
import ErrorLabel from "src/components/Forms/ErrorLabel";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Sivilstand} from "src/declarations/sed";
import styles from "src/assets/css/common.module.css";

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
  const target = `${parentTarget}.person.sivilstand`
  const sivilstandList: Array<Sivilstand> | undefined = _.get(PSED, `${target}`)

  const [_newSivilstand, _setNewSivilstand] = useState<Sivilstand | undefined>(undefined)
  const [_editSivilstand, _setEditSivilstand] = useState<Sivilstand | undefined>(undefined)

  const [_editSivilstandIndex, _setEditSivilstandIndex] = useState<number | undefined>(undefined)
  const [_newSivilstandForm, _setNewSivilstandForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationFamilieStatusProps>(validateFamilieStatus, namespace)

  useEffect(() => {
    if(_newSivilstandForm || _editSivilstand){
      dispatch(addEditingItem("sivilstand"))
    } else if (!_newSivilstandForm && !_editSivilstand){
      dispatch(deleteEditingItem("sivilstand"))
    }
  }, [_newSivilstandForm, _editSivilstand])

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

  const setSivilstandFraDato = (fraDato: string | undefined, index: number) => {
    if(fraDato){
      const dateString = fraDato

      if (index < 0) {
        _setNewSivilstand({
          ..._newSivilstand,
          fradato: dateString!,
          status: _newSivilstand?.status!
        })
        return
      }
      _setEditSivilstand({
        ..._editSivilstand,
        fradato: dateString!,
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
    {value:'enslig', label: t('p2000:form-familiestatus-sivilstand-enslig')},
    {value:'gift', label: t('p2000:form-familiestatus-sivilstand-gift')},
    {value:'samboer', label: t('p2000:form-familiestatus-sivilstand-samboer')},
    {value:'registrert_partnerskap', label: t('p2000:form-familiestatus-sivilstand-registrert_partnerskap')},
    {value:'skilt', label: t('p2000:form-familiestatus-sivilstand-skilt')},
    {value:'skilt_fra_registrert_partnerskap', label: t('p2000:form-familiestatus-sivilstand-separert')},
    {value:'separert', label: t('p2000:form-familiestatus-sivilstand-skilt_fra_registrert_partnerskap')},
    {value:'enke_enkemann', label: t('p2000:form-familiestatus-sivilstand-enke_enkemann')}
  ]

  const renderSivilstand = (sivilstand: Sivilstand | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editSivilstandIndex === index
    const _sivilstand = index < 0 ? _newSivilstand : (inEditMode ? _editSivilstand : sivilstand)

    return(
      <Box
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
                <Select
                  error={_v[_namespace + '-status']?.feilmelding}
                  id='status'
                  label={t('p2000:form-familiestatus-status')}
                  onChange={(e) => setSivilstandStatus(e.target.value, index)}
                  value={(_sivilstand?.status)  ?? ''}
                >
                  <option value=''>Velg</option>
                  {sivilstandStatusOptions.map((option) => {
                    return(<option key={option.value} value={option.value}>{option.label}</option>)
                  })}
                </Select>
                <DateField
                  id='fraDato'
                  index={index}
                  label={t('p2000:form-familiestatus-fradato')}
                  error={_v[_namespace + '-fradato']?.feilmelding}
                  namespace={_namespace}
                  onChanged={(e) => setSivilstandFraDato(e, index)}
                  dateValue={_sivilstand?.fradato ?? ''}
                />
              </>
            )
            : (
              <>
                <FormTextBox
                  id={_namespace + '-status'}
                  error={_v[_namespace + '-status']?.feilmelding}
                  label={index === 0 ? t('p2000:form-familiestatus-status') : ""}
                  padding={0}
                >
                  <BodyLong>
                    {sivilstandStatusOptions.filter((s) => {
                      return s.value === _sivilstand?.status
                    })[0]?.label}
                  </BodyLong>
                  <ErrorLabel error={_v[_namespace + '-status']?.feilmelding}/>
                </FormTextBox>
                <FormTextBox
                  id={_namespace + '-fradato'}
                  error={_v[_namespace + '-fradato']?.feilmelding}
                  label={index === 0 ? t('p2000:form-familiestatus-fradato') : ""}
                  padding={0}
                >
                  <BodyLong>
                    {formatDate(_sivilstand?.fradato)}
                  </BodyLong>
                  <ErrorLabel error={_v[_namespace + '-fradato']?.feilmelding}/>
                </FormTextBox>
              </>
            )
          }
          <HStack>
            <Spacer/>
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
          </HStack>
        </HGrid>
      </Box>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-familiestatus')}</Heading>
      {_.isEmpty(sivilstandList)
        ? (
          <Box paddingBlock="2">
            <BodyLong>
              <em>{t('message:warning-no-familiestatus')}</em>
            </BodyLong>
          </Box>
        )
        : (
          <>
            {sivilstandList?.map(renderSivilstand)}
          </>
        )
      }
      {_newSivilstandForm
        ? renderSivilstand(null, -1)
        : (
          <Button
            variant='tertiary'
            onClick={() => _setNewSivilstandForm(true)}
            iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
          >
            {t('ui:add-new-x', { x: t('p2000:form-familiestatus')?.toLowerCase() })}
          </Button>
        )
      }
    </>
  )
}

export default FamilieStatus
