import {BodyLong, Box, Button, Heading, HGrid, HStack, Spacer} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getIdx} from "src/utils/namespace";
import {RepeatableBox} from "src/components/StyledComponents";
import Input from "../../../components/Forms/Input";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "src/declarations/types";
import {PSED, Validation} from "src/declarations/app";
import useValidation from "../../../hooks/useValidation";
import {validateEpost, ValidationEpostProps} from "./validation";
import {resetValidation, setValidation} from "src/actions/validation";
import performValidation from "../../../utils/performValidation";
import {useAppSelector} from "src/store";
import {State} from "src/declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {hasNamespaceWithErrors} from "src/utils/validation";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Email} from "src/declarations/sed";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface EpostProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Epost: React.FC<EpostProps> = ({
  parentNamespace,
  parentTarget,
  PSED,
  updatePSED
}: EpostProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-person-kontakt-email`
  const target = `${parentTarget}.person.kontakt.email`
  const epostAdresser: Array<Email> | undefined = _.get(PSED, `${target}`)

  const [_newEpost, _setNewEpost] = useState<Email | undefined>(undefined)
  const [_editEpost, _setEditEpost] = useState<Email | undefined>(undefined)

  const [_editEpostIndex, _setEditEpostIndex] = useState<number | undefined>(undefined)
  const [_newEpostForm, _setNewEpostForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationEpostProps>(validateEpost, namespace)

  useEffect(() => {
    if(_newEpostForm || _editEpost){
      dispatch(addEditingItem("epost"))
    } else if (!_newEpostForm && !_editEpost){
      dispatch(deleteEditingItem("epost"))
    }
  }, [_newEpostForm, _editEpost])

  const setEpost = (adresse: string, index: number) => {
    if (index < 0) {
      _setNewEpost({
        ..._newEpost,
        adresse: adresse.trim(),
      })
      return
    }
    _setEditEpost({
      ..._editEpost,
      adresse: adresse.trim(),
    })
  }

  const onAddNewEpost = () => {
    const valid: boolean = _performValidation({
      epost: _newEpost
    })

    if (!!_newEpost && valid) {
      let newEpostadresser: Array<Email> | undefined = _.cloneDeep(epostAdresser)
      if (_.isNil(newEpostadresser)) {
        newEpostadresser = []
      }
      newEpostadresser.push(_newEpost)
      dispatch(updatePSED(`${target}`, newEpostadresser))
      onCloseNewEpost()
    }
  }

  const onCloseNewEpost = () => {
    _setNewEpost(undefined)
    _setNewEpostForm(false)
    _setEditEpostIndex(undefined)
    _resetValidation()
  }

  const onCloseEditEpost = (namespace: string) => {
    _setEditEpost(undefined)
    _setEditEpostIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartEditEpost = (t: Email, index: number) => {
    if (_editEpostIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editEpostIndex)))
    }
    _setEditEpost(t)
    _setEditEpostIndex(index)
  }

  const onSaveEditEpost = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationEpostProps>(
      clonedvalidation, namespace, validateEpost, {
        epost: _editEpost,
        index: _editEpostIndex
      }
    )

    if(!hasErrors) {
      dispatch(updatePSED(`${target}[${_editEpostIndex}]`, _editEpost))
      onCloseEditEpost(namespace + getIdx(_editEpostIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemoveEpost = (removedEpost: Email) => {
    const newEpostadresser: Array<Email> = _.reject(epostAdresser,
      (t: Email) => _.isEqual(removedEpost, t))
    dispatch(updatePSED(`${target}`, newEpostadresser))
  }
  const renderEpost = (epost: Email | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editEpostIndex === index
    const _epost = index < 0 ? _newEpost : (inEditMode ? _editEpost : epost)
    return(
      <RepeatableBox
        key={_namespace}
        id={'repeatablerow-' + _namespace}
        className={classNames({
          new: index < 0,
          error: hasNamespaceWithErrors(_v, _namespace)
        })}
        paddingBlock={inEditMode ? "4 4" : "1 1"}
        paddingInline="4 4"
      >
        <HGrid columns={2} gap="4">
          {inEditMode
            ? (
                <Input
                  error={_v[_namespace + '-adresse']?.feilmelding}
                  namespace={_namespace}
                  id=''
                  label={t('p2000:form-epost-adresse')}
                  onChanged={(e) => setEpost(e, index)}
                  value={(_epost?.adresse)  ?? ''}
                />
            )
            : (
              <FormTextBox
                id={_namespace + '-adresse'}
                error={_v[_namespace + '-adresse']?.feilmelding}
              >
                {_epost?.adresse}
              </FormTextBox>
            )
          }

          <HStack>
            <Spacer/>
            <AddRemovePanel
              item={epost}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveEpost}
              onAddNew={onAddNewEpost}
              onCancelNew={onCloseNewEpost}
              onStartEdit={onStartEditEpost}
              onConfirmEdit={onSaveEditEpost}
              onCancelEdit={() => onCloseEditEpost(_namespace)}
            />
          </HStack>
        </HGrid>
      </RepeatableBox>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-epost')}</Heading>
      {_.isEmpty(epostAdresser)
        ? (
          <Box paddingBlock="2">
            <BodyLong>
              <em>{t('p2000:ingen-x-registrert', {x: 'epost'})}</em >
            </BodyLong>
          </Box>
        )
        : (epostAdresser?.map(renderEpost))
      }
      {_newEpostForm
        ? renderEpost(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewEpostForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
            >
              {t('ui:add-new-x', { x: t('p2000:form-epost')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default Epost
