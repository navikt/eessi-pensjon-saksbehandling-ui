import {Button, Heading} from "@navikt/ds-react";
import {AlignEndColumn, AlignStartRow, Column} from "@navikt/hoykontrast";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import _ from "lodash";
import {getIdx} from "../../../utils/namespace";
import {RepeatableRow} from "../../../components/StyledComponents";
import Input from "../../../components/Forms/Input";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import {ActionWithPayload} from "@navikt/fetch";
import {UpdateSedPayload} from "../../../declarations/types";
import {PSED, Validation} from "declarations/app";
import useValidation from "../../../hooks/useValidation";
import {validateInstitusjon, ValidationInstitusjonProps} from "./validation";
import {resetValidation, setValidation} from "../../../actions/validation";
import performValidation from "../../../utils/performValidation";
import {useAppSelector} from "../../../store";
import {State} from "../../../declarations/reducers";
import {MainFormSelector} from "../MainForm";
import {useTranslation} from "react-i18next";

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
      <RepeatableRow>
        <AlignStartRow>
          {inEditMode
            ? (
              <>
                <Column>
                  <Input
                    error={_v[_namespace]?.feilmelding}
                    namespace={_namespace}
                    id=''
                    label={t('p2000:form-diverse-institusjonennaaikkesoektompensjon')}
                    hideLabel={true}
                    onChanged={(e) => setInstitusjon(e, index)}
                    value={_institusjon ?? ''}
                  />
                </Column>
              </>
            )
            : (
              <Column>
                <div>{_institusjon}</div>
              </Column>
            )
          }

          <AlignEndColumn>
            <AddRemovePanel
              item={institusjon}
              marginTop={index < 0}
              index={index}
              inEditMode={inEditMode}
              onRemove={onRemoveEpost}
              onAddNew={onAddNewInstitusjon}
              onCancelNew={onCloseNewInstitusjon}
              onStartEdit={onStartEditInstitusjon}
              onConfirmEdit={onSaveEditInstitusjon}
              onCancelEdit={() => onCloseEditInstitusjon(_namespace)}
            />
          </AlignEndColumn>
        </AlignStartRow>
      </RepeatableRow>
    )
  }

  return (
    <>
      <Heading size="small">{t('p2000:form-diverse-institusjonennaaikkesoektompensjon')}</Heading>
      <AlignStartRow>
        <Column>
          {institusjoner?.map(renderInstitusjon)}
        </Column>
      </AlignStartRow>
      {_newInstitusjonForm
        ? renderInstitusjon(null, -1)
        : (
            <Button
              variant='tertiary'
              onClick={() => _setNewInstitusjonForm(true)}
              iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
            >
              {t('ui:add-new-x', { x: t('p2000:form-diverse-institusjon')?.toLowerCase() })}
            </Button>
          )
      }
    </>
  )
}

export default Institusjon
