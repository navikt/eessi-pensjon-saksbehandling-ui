import {BodyLong, Box, Button, Heading, HGrid, HStack, Select, Spacer, VStack} from "@navikt/ds-react";
import _ from "lodash";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {Fragment, useEffect, useState} from "react";
import {MainFormProps, MainFormSelector} from "../MainForm";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "src/store";
import {getIdx} from "src/utils/namespace";
import {State} from "src/declarations/reducers";
import PersonOpplysninger from "../PersonOpplysninger/PersonOpplysninger";
import {resetValidation, setValidation} from "src/actions/validation";
import {useDispatch} from "react-redux";
import AddRemovePanel from "../../../components/AddRemovePanel/AddRemovePanel";
import classNames from "classnames";
import UtenlandskePin from "src/components/UtenlandskePin/UtenlandskePin";
import Foedested from "../Foedested/Foedested";
import Statsborgerskap from "../Statsborgerskap/Statsborgerskap";
import DateField from "../DateField/DateField";
import {formatDate} from "src/utils/utils";
import useValidation from "../../../hooks/useValidation";
import {hasNamespaceWithErrors} from "src/utils/validation";
import {validateBarn, validateBarnArray, ValidationBarnArrayProps, ValidationBarnProps} from "./validation";
import performValidation from "../../../utils/performValidation";
import {Validation} from "src/declarations/app";
import useUnmount from "../../../hooks/useUnmount";
import {addEditingItem, deleteEditingItem} from "src/actions/app";
import FormTextBox from "src/components/Forms/FormTextBox";
import {Barn as P2000Barn} from "src/declarations/sed";
import styles from "src/assets/css/common.module.css";

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

  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationBarnProps>(validateBarn, namespace)

  useUnmount(() => {
    const clonedvalidation = _.cloneDeep(validation)
    performValidation<ValidationBarnArrayProps>(
      clonedvalidation, namespace, validateBarnArray, {
        barnArray: barn
      }, true
    )
    dispatch(setValidation(clonedvalidation))
  })

  useEffect(() => {
    if(_newForm || _editBarn){
      dispatch(addEditingItem("barn"))
    } else if (!_newForm && !_editBarn){
      dispatch(deleteEditingItem("barn"))
    }
  }, [_newForm, _editBarn])

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
    _resetValidation()
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
    const hasErrors = performValidation<ValidationBarnProps>(
      clonedValidation, namespace, validateBarn, {
        barn: _editBarn,
        index: _editIndex,
      })

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
    const valid: boolean = _performValidation({
      barn: _newBarn,
    })

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
    const idx = getIdx(index)
    if (index < 0) {
      _setNewBarn({
          ..._newBarn,
        person: {
            ..._newBarn?.person,
          [property]: value
        }
      })

      if(_validation[namespace + '-person-' + property]){
        _resetValidation(namespace + '-person-' + property)
      }

      return
    }
    _setEditBarn({
      ..._editBarn,
      person: {
        ..._editBarn?.person,
        [property]: value
      }
    })

    if(validation[namespace + idx + '-person-' + property]){
      dispatch(resetValidation(namespace + idx + '-person-' + property))
    }

  }

  const setBarnFoedested = (property: string, value: string | null | undefined, index: number) => {
    if (index < 0) {
      _setNewBarn({
        ..._newBarn,
        person: {
          ..._newBarn?.person,
          foedested: {
            ..._newBarn?.person?.foedested,
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
          ..._editBarn?.person?.foedested,
          [property]: value
        }
      }
    })
  }

  const setRelasjon = (relasjon: string, index: number) => {
    if (index < 0) {
      _setNewBarn({
        ..._newBarn,
        relasjontilbruker: relasjon
      })
      return
    }
    _setEditBarn({
      ..._editBarn,
      relasjontilbruker: relasjon
    })
  }

  const relasjonOptions = [
    {value:'eget_barn', label: t('p2000:form-barn-relasjon-eget-barn')},
    {value:'adoptivbarn', label: t('p2000:form-barn-relasjon-adoptivbarn')},
    {value:'fosterbarn', label: t('p2000:form-barn-relasjon-fosterbarn')}
  ]

  const getRelasjonLabel = (relasjon: string | undefined | null) => {
    const selectedRelasjon = relasjonOptions.find((r) => r.value === relasjon)
    return selectedRelasjon ? selectedRelasjon.label : relasjon
  }

  const renderRow = (barn: P2000Barn | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _barn = index < 0 ? _newBarn : (inEditMode ? _editBarn : barn)

    return (
      <Fragment key={"barn-" + index}>
        <Box
          id={'repeatablerow-' + _namespace}
          key={index}
          className={classNames(styles.repeatableBox, {
            [styles.new]: index < 0,
            [styles.error]: hasNamespaceWithErrors(_v, _namespace),
            [styles.withBorder]: true
          })}
          padding="4"
        >
            <VStack gap="4">
              <Box>
                <PersonOpplysninger setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index} parentEditMode={inEditMode} parentValidation={_v}/>
              </Box>
              <Box>
                <UtenlandskePin setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index} parentEditMode={inEditMode}/>
              </Box>
              <Box>
                <Foedested setPersonOpplysninger={setBarnFoedested} person={_barn?.person} parentNamespace={_namespace} parentIndex={index} parentEditMode={inEditMode} parentValidation={_v}/>
              </Box>
              <Box>
                <Statsborgerskap setPersonOpplysninger={setBarnPersonalia} person={_barn?.person} parentNamespace={_namespace} parentIndex={index} parentEditMode={inEditMode}/>
              </Box>
              <Heading size='small'>
                {t('p2000:form-barn-relasjontilbruker')}
              </Heading>
              {inEditMode &&
                <HGrid columns={3} gap="4">
                  <Select
                    error={_v[_namespace + '-relasjontilbruker']?.feilmelding}
                    id='barn-relasjontilbruker'
                    label={t('p2000:form-barn-relasjontilbruker')}
                    hideLabel={true}
                    onChange={(e) => setRelasjon(e.target.value, index)}
                    value={(_barn?.relasjontilbruker) ?? ''}
                  >
                    <option value=''>{t('p2000:form-velg')}</option>
                    {relasjonOptions.map((option) => {
                      return(<option key={option.value} value={option.value}>{option.label}</option>)
                    })}
                  </Select>
                </HGrid>
              }
              {!inEditMode &&
                <FormTextBox
                  error={_v[_namespace + '-relasjontilbruker']?.feilmelding}
                  id='barn-relasjontilbruker'
                  padding="0"
                >
                  {_barn?.relasjontilbruker && <BodyLong>{getRelasjonLabel(_barn?.relasjontilbruker)}</BodyLong>}
                  {!_barn?.relasjontilbruker && <em>{t('p2000:ingen-x-registrert', {x: 'relasjon'})}</em>}
                </FormTextBox>
              }
              <Heading size='small'>
                Dødsdato
              </Heading>
              {inEditMode &&
                <HGrid columns={3} gap="4">
                  <DateField
                    hideLabel={true}
                    id='person-doedssdato'
                    index={0}
                    label={t('p2000:form-person-doedsdato')}
                    error={_v[_namespace + '-person-doedssdato']?.feilmelding}
                    namespace={_namespace}
                    onChanged={(v) => setBarnPersonalia("doedsdato", v, index)}
                    dateValue={_barn?.person?.doedsdato ?? ''}
                  />
                </HGrid>
              }
              {!inEditMode &&
                <FormTextBox
                  error={_v[_namespace + '-person-doedssdato']?.feilmelding}
                  id='person-doedssdato'
                  padding="0"
                >
                  {_barn?.person?.doedsdato &&<BodyLong>{formatDate(_barn?.person?.doedsdato)}</BodyLong>}
                  {!_barn?.person?.doedsdato && <em>{t('p2000:ingen-x-registrert', {x: 'dødsdato'})}</em>}
                </FormTextBox>
              }
              <HStack>
                <Spacer/>
                <AddRemovePanel<P2000Barn>
                  item={barn}
                  marginTop={index < 0}
                  index={index}
                  inEditMode={inEditMode}
                  alwaysVisible={true}
                  onRemove={onRemove}
                  onAddNew={onAddNew}
                  onCancelNew={onCloseNew}
                  onStartEdit={onStartEdit}
                  onConfirmEdit={onSaveEdit}
                  onCancelEdit={() => onCloseEdit(_namespace)}
                />
              </HStack>
            </VStack>
        </Box>
      </Fragment>
    )
  }

  return (
    <Box padding="4">
      <VStack gap="4">
        <Heading size='medium'>
          {label}
        </Heading>
        {_.isEmpty(barn)
          ? (
            <BodyLong>
              <em>{t('p2000:ingen-x-registrert', {x: 'barn'})}</em>
            </BodyLong>
          )
          : (
            <>
              {barn?.map(renderRow)}
            </>
          )
        }
        {_newForm
          ? renderRow(null, -1)
          : (
              <Box>
                <Button
                  variant='tertiary'
                  onClick={() => _setNewForm(true)}
                  iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
                >
                  {t('ui:add-new-x', { x: t('p2000:form-barn')?.toLowerCase() })}
                </Button>
              </Box>
          )}
      </VStack>
    </Box>
  )
}

export default Barn
