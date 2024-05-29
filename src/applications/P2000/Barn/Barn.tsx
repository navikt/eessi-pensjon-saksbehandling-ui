import {AlignEndColumn, AlignStartRow, Column, PaddedDiv, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {BodyLong, Button, Heading} from "@navikt/ds-react";
import _ from "lodash";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useTranslation} from "react-i18next";

import {useAppSelector} from "../../../store";
import {Barn as P2000Barn} from "../../../declarations/p2000";
import {getIdx} from "../../../utils/namespace";

import {State} from "../../../declarations/reducers";
import PersonOpplysninger from "../PersonOpplysninger/PersonOpplysninger";
import {resetValidation, setValidation} from "../../../actions/validation";
import {useDispatch} from "react-redux";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import classNames from "classnames";
import {RepeatableRowNoBackground} from "../../../components/StyledComponents";
import UtenlandskePin from "../UtenlandskePin/UtenlandskePin";
import Foedested from "../Foedested/Foedested";

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status,
})

const Barn: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {validation} = useAppSelector(mapState)
  const namespace = `${parentNamespace}-barn`
  const target = 'nav.barn'
  const barn:  Array<P2000Barn> | undefined = _.get(PSED, target)

  const [_newBarn, _setNewBarn] = useState<P2000Barn | undefined>(undefined)
  const [_editBarn, _setEditBarn] = useState<P2000Barn | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)


  const setBarn = (newBarnArray: Array<P2000Barn>) => {
    let barnArray: Array<P2000Barn> | undefined = _.cloneDeep(newBarnArray)
    if (_.isNil(barnArray)) {
      barnArray = []
    }
    dispatch(updatePSED(`${target}`, barnArray))
    dispatch(resetValidation(namespace))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditBarn(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewBarn(undefined)
    _setNewForm(false)
    //_resetValidation()
  }

  const onStartEdit = (barn: P2000Barn, index: number) => {
    // reset any validation that exists from a cancelled edited item
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditBarn(barn)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
/*
    const hasErrors = performValidation<ValidationBarnProps>(
      clonedValidation, namespace, validateBarn, {
        barn: _editBarn,
        index: _editIndex,
      })
*/
    const hasErrors = false;

    if (_editIndex !== undefined && !!_editBarn && !hasErrors) {
      const newBarnArray: Array<P2000Barn> = _.cloneDeep(barn) as Array<P2000Barn>
      newBarnArray[_editIndex] = _editBarn
      setBarn(newBarnArray)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedBarn: P2000Barn) => {
    const newBarnArray: Array<P2000Barn> = _.reject(barn,
      (b: P2000Barn) => _.isEqual(removedBarn, b))
    dispatch(updatePSED(`${target}`, newBarnArray))
  }

  const onAddNew = () => {
/*
    const valid: boolean = _performValidation({
      barn: _newBarn,
    })
*/

    const valid = true
    if (!!_newBarn && valid) {
      let newBarnArray: Array<P2000Barn> = _.cloneDeep(barn) as Array<P2000Barn>
      if (_.isNil(newBarnArray)) {
        newBarnArray = []
      }
      newBarnArray.push(_newBarn)
      setBarn(newBarnArray)
      onCloseNew()
    }
  }

  const setBarnPersonalia = (property: string, value: string | undefined, index: number) => {
    if (index < 0) {
      _setNewBarn({
          ..._newBarn,
        person: {
            ..._newBarn?.person,
          [property]: value
        }
      })
      return
    }
    _setEditBarn({
      ..._editBarn,
      person: {
        ..._editBarn?.person,
        [property]: value
      }
    })
  }

  const setBarnFoedested = (property: string, value: string | null | undefined, index: number) => {
    if (index < 0) {
      _setNewBarn({
        ..._newBarn,
        person: {
          ..._newBarn?.person,
          foedested: {
            ..._newBarn?.person.foedested,
            [property]: value
          }
        }
      })
      return
    }
    _setEditBarn({
      ..._editBarn,
      person: {
        ..._editBarn?.person,
        foedested: {
          ..._editBarn?.person.foedested,
          [property]: value
        }
      }
    })
  }





  const renderRow = (barn: P2000Barn | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    //const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _barn = index < 0 ? _newBarn : (inEditMode ? _editBarn : barn)
    return (
      <>
        <RepeatableRowNoBackground
          id={'repeatablerow-' + _namespace}
          key={index}
          className={classNames({
            new: index < 0,
            error: false, //hasNamespaceWithErrors(_v, _namespace),
            selected: inEditMode
          })}
        >
          {inEditMode &&
            <>
              <PersonOpplysninger setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index}/>
              <VerticalSeparatorDiv/>
              <UtenlandskePin setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index}/>
              <VerticalSeparatorDiv/>
              <Foedested setPersonOpplysninger={setBarnFoedested} person={_barn?.person} parentNamespace={_namespace} parentIndex={index}/>
              <VerticalSeparatorDiv/>
              {/*<Statsborgerskap setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index}/>*/}
              <AlignEndColumn>
                <AddRemovePanel<P2000Barn>
                  item={barn}
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
              </AlignEndColumn>
            </>
          }
          {!inEditMode &&
            <AlignStartRow>
              <Column>
                {_barn?.person?.etternavn} {_barn?.person?.fornavn}
              </Column>
              <AlignEndColumn>
                <AddRemovePanel<P2000Barn>
                  item={barn}
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
              </AlignEndColumn>
            </AlignStartRow>
          }
          <VerticalSeparatorDiv/>
        </RepeatableRowNoBackground>
      </>
    )
  }

  return (
    <>
      <PaddedDiv>
        <Heading size='medium'>
          {label}
        </Heading>
        <VerticalSeparatorDiv/>
        {_.isEmpty(barn)
          ? (
            <BodyLong>
              {t('p2000:ingen-barn')}
            </BodyLong>
          )
          : (
            <>
              {barn?.map(renderRow)}
            </>
          )
        }
        <VerticalSeparatorDiv />
        {_newForm
          ? renderRow(null, -1)
          : (
            <AlignEndColumn>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
              >
                {t('ui:add-new-x', { x: t('p2000:form-barn')?.toLowerCase() })}
              </Button>
            </AlignEndColumn>
          )}


      </PaddedDiv>
    </>
  )
}

export default Barn
