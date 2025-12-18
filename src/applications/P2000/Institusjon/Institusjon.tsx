import {Box, Button, Heading, HGrid, HStack, Spacer} from "@navikt/ds-react";
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
import {validateInstitusjon, ValidationInstitusjonProps} from "./validation";
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
import styles from "src/assets/css/common.module.css";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface InstitusjonProps {
  PSED: PSED | null | undefined
  parentNamespace: string
  parentTarget: string
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Institusjon: React.FC<InstitusjonProps> = ({
  parentNamespace,
  parentTarget,
  PSED,
  updatePSED
}: InstitusjonProps): JSX.Element => {
  const { t } = useTranslation()
  const { validation } = useAppSelector(mapState)
  const dispatch = useDispatch()
  const namespace = `${parentNamespace}-institusjonennaaikkesoektompensjon`
  const target = `${parentTarget}.institusjonennaaikkesoektompensjon`
  const institusjoner: Array<string> | undefined = _.get(PSED, `${target}`)

  const [_newInstitusjon, _setNewInstitusjon] = useState<string | undefined>(undefined)
  const [_editInstitusjon, _setEditInstitusjon] = useState<string | undefined>(undefined)

  const [_editInstitusjonIndex, _setEditInstitusjonIndex] = useState<number | undefined>(undefined)
  const [_newInstitusjonForm, _setNewInstitusjonForm] = useState<boolean>(false)

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationInstitusjonProps>(validateInstitusjon, namespace)

  useEffect(() => {
    if(_newInstitusjonForm || _editInstitusjon){
      dispatch(addEditingItem("institusjon"))
    } else if (!_newInstitusjonForm && !_editInstitusjon){
      dispatch(deleteEditingItem("institusjon"))
    }
  }, [_newInstitusjonForm, _editInstitusjon])

  const setInstitusjon = (institusjon: string, index: number) => {
    if (index < 0) {
      _setNewInstitusjon(institusjon)
      return
    }
    _setEditInstitusjon(institusjon)
  }

  const onAddNewInstitusjon = () => {
    const valid: boolean = _performValidation({
      institusjon: _newInstitusjon
    })

    if (!!_newInstitusjon && valid) {
      let newInstitusjoner: Array<string> | undefined = _.cloneDeep(institusjoner)
      if (_.isNil(newInstitusjoner)) {
        newInstitusjoner = []
      }
      newInstitusjoner.push(_newInstitusjon)
      dispatch(updatePSED(`${target}`, newInstitusjoner))
      onCloseNewInstitusjon()
    }
  }

  const onCloseNewInstitusjon = () => {
    _setNewInstitusjon(undefined)
    _setNewInstitusjonForm(false)
    _setEditInstitusjonIndex(undefined)
    _resetValidation()
  }

  const onCloseEditInstitusjon = (namespace: string) => {
    _setEditInstitusjon(undefined)
    _setEditInstitusjonIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onStartEditInstitusjon = (i: string, index: number) => {
    if (_editInstitusjonIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editInstitusjonIndex)))
    }
    _setEditInstitusjon(i)
    _setEditInstitusjonIndex(index)
  }

  const onSaveEditInstitusjon = () => {
    const clonedvalidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationInstitusjonProps>(
      clonedvalidation, namespace, validateInstitusjon, {
        institusjon: _editInstitusjon,
        index: _editInstitusjonIndex
      }
    )

    if(!hasErrors) {
      dispatch(updatePSED(`${target}[${_editInstitusjonIndex}]`, _editInstitusjon))
      onCloseEditInstitusjon(namespace + getIdx(_editInstitusjonIndex))
    } else {
      dispatch(setValidation(clonedvalidation))
    }
  }

  const onRemoveEpost = (removedInstitusjon: string) => {
    const newInstitusjoner: Array<string> = _.reject(institusjoner,
      (i: string) => _.isEqual(removedInstitusjon, i))
    dispatch(updatePSED(`${target}`, newInstitusjoner))
  }
  const renderInstitusjon = (institusjon: string | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editInstitusjonIndex === index
    const _institusjon = index < 0 ? _newInstitusjon : (inEditMode ? _editInstitusjon : institusjon)
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
        <HGrid columns={2}>
          {inEditMode
            ? (
                <Input
                  error={_v[_namespace]?.feilmelding}
                  namespace={_namespace}
                  id=''
                  label={t('p2000:form-diverse-institusjonennaaikkesoektompensjon')}
                  hideLabel={true}
                  onChanged={(e) => setInstitusjon(e, index)}
                  value={_institusjon ?? ''}
                />
            )
            : (<FormTextBox id='' error={_v[_namespace]?.feilmelding}>{_institusjon}</FormTextBox>)
          }
          <HStack>
            <Spacer/>
            <AddRemovePanel
              item={institusjon}
              marginTop={false  }
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveEpost}
              onAddNew={onAddNewInstitusjon}
              onCancelNew={onCloseNewInstitusjon}
              onStartEdit={onStartEditInstitusjon}
              onConfirmEdit={onSaveEditInstitusjon}
              onCancelEdit={() => onCloseEditInstitusjon(_namespace)}
            />
          </HStack>
        </HGrid>
      </Box>
    )
  }

  return (
      <>
        <Heading size="xsmall">{t('p2000:form-diverse-institusjonennaaikkesoektompensjon')}</Heading>
        {_.isEmpty(institusjoner)
          ? (<em>{t('message:warning-no-institusjonennaaikkesoektompensjon')}</em>)
          : (<Box>{institusjoner?.map(renderInstitusjon)}</Box>)
        }
        {_newInstitusjonForm
          ? renderInstitusjon(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewInstitusjonForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-diverse-institusjon')?.toLowerCase() })}
              </Button>
            </Box>
            )
        }
      </>
  )
}

export default Institusjon
