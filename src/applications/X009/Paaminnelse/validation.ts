import {Validation} from 'src/declarations/app'
import {getIdx} from 'src/utils/namespace'
import {checkIfDuplicate, checkIfEmpty, checkIfTooLong} from 'src/utils/validation'
import {SendeItem} from 'src/declarations/x009'

export interface ValidationSendeItemProps {
  sendeItem: SendeItem | null | undefined
  sendeItemArray: Array<SendeItem> | undefined
  index?: number
}

export interface ValidationPaaminnelseProps {
  sendeItemArray: Array<SendeItem> | undefined
}

export const validateSendeItem = (
  v: Validation,
  namespace: string | undefined,
  {
    sendeItem,
    sendeItemArray,
    index
  }: ValidationSendeItemProps
): boolean => {
  const hasErrors: Array<boolean> = []
  const idx = getIdx(index)

  hasErrors.push(checkIfEmpty(v, {
    needle: sendeItem?.type,
    id: namespace + idx + '-type',
    message: 'validation:missing-x009-paaminnelse-type'
  }))

  hasErrors.push(checkIfEmpty(v, {
    needle: sendeItem?.detaljer,
    id: namespace + idx + '-detaljer',
    message: 'validation:missing-x009-paaminnelse-detaljer'
  }))

  hasErrors.push(checkIfTooLong(v, {
    needle: sendeItem?.detaljer,
    max: 65,
    id: namespace + idx + '-detaljer',
    message: 'validation:textOverX'
  }))

  hasErrors.push(checkIfDuplicate(v, {
    needle: sendeItem?.type,
    haystack: sendeItemArray,
    matchFn: (_sendeItem: SendeItem) => _sendeItem.type === sendeItem?.type,
    index,
    id: namespace + idx + '-type',
    message: 'validation:duplicate-x009-paaminnelse-type'
  }))

  return hasErrors.find(value => value) !== undefined
}

export const validatePaaminnelse = (
  v: Validation,
  namespace: string | undefined,
  {
    sendeItemArray
  }: ValidationPaaminnelseProps
): boolean => {
  const hasErrors: Array<boolean> = []

  hasErrors.push(checkIfEmpty(v, {
    needle: sendeItemArray,
    id: namespace + '-sende',
    message: 'validation:missing-x009-paaminnelse'
  }))

  sendeItemArray?.forEach((sendeItem: SendeItem, index: number) => {
    hasErrors.push(validateSendeItem(v, namespace, {sendeItem, sendeItemArray, index}))
  })

  return hasErrors.find(value => value) !== undefined
}
