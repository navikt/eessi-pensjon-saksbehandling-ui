import {PlusCircleIcon} from "@navikt/aksel-icons";
import {BodyLong, Box, Button, Heading, HStack, Radio, RadioGroup, Spacer, VStack} from '@navikt/ds-react'
import {resetValidation, setValidation} from 'src/actions/validation'
import classNames from 'classnames'
import AddRemovePanel from 'src/components/AddRemovePanel/AddRemovePanel'
import useValidation from 'src/hooks/useValidation'
import _ from 'lodash'
import React, {JSX, useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useAppDispatch, useAppSelector} from 'src/store'
import {getIdx} from 'src/utils/namespace'
import performValidation from 'src/utils/performValidation'
import {hasNamespaceWithErrors} from 'src/utils/validation'
import {validateSendeItem, ValidationSendeItemProps} from './validation'
import {Validation} from "src/declarations/app"
import {State} from "src/declarations/reducers"
import {MainFormSelector} from "src/applications/P2000/MainForm"
import {ActionWithPayload} from '@navikt/fetch'
import {UpdateSedPayload} from 'src/declarations/types'
import {addEditingItem, deleteEditingItem} from "src/actions/app"
import FormTextBox from "src/components/Forms/FormTextBox"
import TextArea from "src/components/Forms/TextArea"
import {SendeItem, X009SED} from "src/declarations/x009"
import styles from "src/assets/css/common.module.css"

const mapState = (state: State): MainFormSelector => ({
  validation: state.validation.status
})

export interface PaaminnelseProps {
  label?: string
  parentNamespace: string
  PSED: X009SED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const Paaminnelse: React.FC<PaaminnelseProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: PaaminnelseProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const {validation} = useAppSelector(mapState)
  const namespace = `${parentNamespace}-paaminnelse`
  const target = 'nav.sak.paaminnelse.sende'

  const sendeItems: Array<SendeItem> | undefined = _.get(PSED as X009SED, target)

  const [_newSendeItem, _setNewSendeItem] = useState<SendeItem | undefined>(undefined)
  const [_editSendeItem, _setEditSendeItem] = useState<SendeItem | undefined>(undefined)
  const [_editIndex, _setEditIndex] = useState<number | undefined>(undefined)
  const [_newForm, _setNewForm] = useState<boolean>(false)
  const [_validation, _resetValidation, _performValidation] = useValidation<ValidationSendeItemProps>(validateSendeItem, namespace)

  useEffect(() => {
    if (_newForm || _editSendeItem) {
      dispatch(addEditingItem("paaminnelse"))
    } else if (!_newForm && !_editSendeItem) {
      dispatch(deleteEditingItem("paaminnelse"))
    }
  }, [_newForm, _editSendeItem])

  const setSendeItems = (newSendeItems: Array<SendeItem>) => {
    let sendeItems: Array<SendeItem> | undefined = _.cloneDeep(newSendeItems)

    if (sendeItems && sendeItems.length === 0) {
      sendeItems = undefined
    }

    if (updatePSED) {
      dispatch(updatePSED(target, sendeItems))
    }

    dispatch(resetValidation(namespace))
  }

  const setType = (newType: string, index: number) => {
    if (index < 0) {
      _setNewSendeItem({..._newSendeItem, type: newType.trim()})
      _resetValidation(namespace + '-type')
      return
    }
    _setEditSendeItem({..._editSendeItem, type: newType.trim()})
    dispatch(resetValidation(namespace + getIdx(index) + '-type'))
  }

  const setDetaljer = (newDetaljer: string, index: number) => {
    if (index < 0) {
      _setNewSendeItem({..._newSendeItem, detaljer: newDetaljer.trim()})
      _resetValidation(namespace + '-detaljer')
      return
    }
    _setEditSendeItem({..._editSendeItem, detaljer: newDetaljer.trim()})
    dispatch(resetValidation(namespace + getIdx(index) + '-detaljer'))
  }

  const onCloseEdit = (namespace: string) => {
    _setEditSendeItem(undefined)
    _setEditIndex(undefined)
    dispatch(resetValidation(namespace))
  }

  const onCloseNew = () => {
    _setNewSendeItem(undefined)
    _setNewForm(false)
    _resetValidation()
  }

  const onStartEdit = (sendeItem: SendeItem, index: number) => {
    if (_editIndex !== undefined) {
      dispatch(resetValidation(namespace + getIdx(_editIndex)))
    }
    _setEditSendeItem(sendeItem)
    _setEditIndex(index)
  }

  const onSaveEdit = () => {
    const clonedValidation = _.cloneDeep(validation)
    const hasErrors = performValidation<ValidationSendeItemProps>(
      clonedValidation, namespace, validateSendeItem, {
        sendeItem: _editSendeItem,
        sendeItemArray: sendeItems,
        index: _editIndex
      })
    if (_editIndex !== undefined && !!_editSendeItem && !hasErrors) {
      const newSendeItems: Array<SendeItem> = _.cloneDeep(sendeItems) as Array<SendeItem>
      newSendeItems[_editIndex] = _editSendeItem
      setSendeItems(newSendeItems)
      onCloseEdit(namespace + getIdx(_editIndex))
    } else {
      dispatch(setValidation(clonedValidation))
    }
  }

  const onRemove = (removedSendeItem: SendeItem) => {
    const newSendeItems: Array<SendeItem> = _.reject(sendeItems, (sendeItem: SendeItem) => _.isEqual(removedSendeItem, sendeItem))
    setSendeItems(newSendeItems)
  }

  const onAddNew = () => {
    const valid: boolean = _performValidation({
      sendeItem: _newSendeItem,
      sendeItemArray: sendeItems
    })
    if (!!_newSendeItem && valid) {
      let newSendeItems: Array<SendeItem> = _.cloneDeep(sendeItems) as Array<SendeItem>
      if (_.isNil(newSendeItems)) {
        newSendeItems = []
      }
      newSendeItems.push(_newSendeItem)
      setSendeItems(newSendeItems)
      onCloseNew()
    }
  }

  const renderRow = (sendeItem: SendeItem | null, index: number) => {
    const _namespace = namespace + getIdx(index)
    const _v: Validation = index < 0 ? _validation : validation
    const inEditMode = index < 0 || _editIndex === index
    const _sendeItem = index < 0 ? _newSendeItem : (inEditMode ? _editSendeItem : sendeItem)
    return (
      <Box
        key={'repeatablerow-' + _namespace + index}
        id={'repeatablerow-' + _namespace}
        className={classNames(styles.repeatableBox, {
          [styles.new]: index < 0,
          [styles.error]: hasNamespaceWithErrors(_v, _namespace)
        })}
        padding="space-16"
      >
        {inEditMode
          ? (
            <VStack gap="space-16">
              <HStack gap="space-16" align="start">
                <RadioGroup
                  value={_sendeItem?.type ?? ''}
                  data-testid={_namespace + '-type'}
                  error={_v[_namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                  legend={t('x009:form-paaminnelse-type')}
                  onChange={(v: string) => setType(v, index)}
                >
                  <HStack gap="space-16">
                    <Radio value='dokument'>{t('x009:type-dokument')}</Radio>
                    <Radio value='informasjon'>{t('x009:type-informasjon')}</Radio>
                    <Radio value='sed'>{t('x009:type-sed')}</Radio>
                  </HStack>
                </RadioGroup>
                <Spacer/>
                <AddRemovePanel<SendeItem>
                  item={sendeItem}
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
              </HStack>
              <TextArea
                error={_v[_namespace + '-detaljer']?.feilmelding}
                namespace={_namespace}
                id='detaljer'
                label={t('x009:form-paaminnelse-detaljer')}
                onChanged={(v: string) => setDetaljer(v, index)}
                value={_sendeItem?.detaljer ?? ''}
                maxLength={65}
                required
              />
            </VStack>
            )
          : (
            <HStack gap="space-16" align="start">
              <VStack gap="space-4">
                <FormTextBox
                  error={_validation[_namespace + '-type']?.feilmelding}
                  id={_namespace + '-type'}
                  label={t('x009:form-paaminnelse-type')}
                  padding="space-0"
                >
                  <BodyLong>{_sendeItem?.type ? t('x009:type-' + _sendeItem.type) : ''}</BodyLong>
                </FormTextBox>
                <FormTextBox
                  error={_validation[_namespace + '-detaljer']?.feilmelding}
                  id={_namespace + '-detaljer'}
                  label={t('x009:form-paaminnelse-detaljer')}
                  padding="space-0"
                >
                  <BodyLong>{_sendeItem?.detaljer}</BodyLong>
                </FormTextBox>
              </VStack>
              <Spacer/>
              <AddRemovePanel<SendeItem>
                item={sendeItem}
                index={index}
                inEditMode={inEditMode}
                onRemove={onRemove}
                onAddNew={onAddNew}
                onCancelNew={onCloseNew}
                onStartEdit={onStartEdit}
                onConfirmEdit={onSaveEdit}
                onCancelEdit={() => onCloseEdit(_namespace)}
              />
            </HStack>
            )
        }
      </Box>
    )
  }

  return (
    <Box
      borderWidth="1"
      borderRadius="4"
      borderColor="neutral"
      background="default"
      padding="space-16"
    >
      <VStack gap="space-16">
        <Heading size="small">{label ?? t('x009:form-paaminnelser')}</Heading>
        <FormTextBox
          error={validation[namespace + '-sende']?.feilmelding}
          id={namespace + '-sende'}
          padding="space-0"
        >
          {_.isEmpty(sendeItems)
            ? (
              <Box paddingBlock="space-8">
                <BodyLong>
                  <em>{t('x009:warning-no-paaminnelse')}</em>
                </BodyLong>
              </Box>
              )
            : (
              <VStack gap="space-16">
                {sendeItems?.map(renderRow)}
              </VStack>
              )
          }
        </FormTextBox>
        {_newForm
          ? renderRow(null, -1)
          : (
            <Box>
              <Button
                variant='tertiary'
                onClick={() => _setNewForm(true)}
                iconPosition="left" icon={<PlusCircleIcon aria-hidden/>}
              >
                {t('ui:add-new-x', {x: t('x009:form-paaminnelse')?.toLowerCase()})}
              </Button>
            </Box>
            )
        }
      </VStack>
    </Box>
  )
}

export default Paaminnelse
