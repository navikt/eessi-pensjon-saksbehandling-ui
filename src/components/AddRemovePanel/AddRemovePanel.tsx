import {
  PlusCircleIcon,
  ArrowUndoIcon,
  FilesIcon,
  TrashIcon,
  PencilIcon,
  CheckmarkIcon
} from '@navikt/aksel-icons'
import classNames from 'classnames'
import { Labels } from 'src/declarations/app'
import {Button, BodyLong, Box, HStack} from '@navikt/ds-react'
import _ from 'lodash'
import {JSX, useState} from 'react'
import { useTranslation } from 'react-i18next'

export interface AddRemovePanelProps<T> {
  item: T | null
  index: number
  labels?: Labels
  marginTop?: boolean
  noMargin?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  onAddNew?: () => void
  onCopy?: (item: T, index: number) => void
  inEditMode?: boolean
  onStartEdit?: (item: T, index: number) => void
  onConfirmEdit?: () => void
  onCancelEdit?: () => void
  onCancelNew?: () => void
  onRemove: (item: T) => void
  alwaysVisible?: boolean
}

const AddRemovePanel = <T extends any>({
  labels = {},
  item,
  index,
  allowEdit = true,
  allowDelete = true,
  marginTop = undefined,
  noMargin = undefined,
  inEditMode = false,
  onStartEdit,
  onConfirmEdit,
  onCancelEdit,
  onRemove,
  onAddNew,
  onCopy,
  onCancelNew,
  alwaysVisible = false
}: AddRemovePanelProps<T>): JSX.Element | null => {
  const { t } = useTranslation()

  const [inDeleteMode, setInDeleteMode] = useState<boolean>(false)

  const isNew = item === null
  const candidateForDeletion = isNew ? false : inDeleteMode
  const candidateForEdition = isNew ? false : inEditMode

  if (candidateForDeletion) {
    return (
      <Box className={classNames('slideInFromRight', { marginTop }, { noMargin })}>
        <HStack gap="4" align="center">
          <BodyLong style={{ whiteSpace: 'nowrap' }}>
            {labels?.areYouSure ?? t('ui:are-you-sure')}
          </BodyLong>

          <Button
            size='small'
            variant='tertiary'
            onClick={() => {onRemove(item!);setInDeleteMode(false)}}
          >
            {labels?.yes ?? t('ui:yes')}
          </Button>
          <Button
            size='small'
            variant='tertiary'
            onClick={() => setInDeleteMode(false)}
          >
            {labels?.no ?? t('ui:no')}
          </Button>
        </HStack>
      </Box>
    )
  }

  if (candidateForEdition) {
    return (
      <Box className={classNames({ marginTop }, { noMargin })}>
        <HStack gap="4">
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              onConfirmEdit!()
            }}
            iconPosition="left" icon={<CheckmarkIcon aria-hidden />}
          >
            {labels?.ok ?? t('ui:save')}
          </Button>
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              if (onCancelEdit) {
                onCancelEdit()
              }
            }}
            iconPosition="left" icon={<ArrowUndoIcon aria-hidden />}
          >
            {labels?.cancel ?? t('ui:cancel')}
          </Button>
        </HStack>
      </Box>
    )
  }

  if (isNew) {
    return (
      <Box className={classNames({ marginTop }, { noMargin })}>
        <HStack gap="4">
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              if (_.isFunction(onAddNew)) {
                onAddNew()
              }
            }}
            iconPosition="left" icon={<PlusCircleIcon aria-hidden />}
          >
            {labels?.add ?? t('ui:add')}
          </Button>
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              if (_.isFunction(onCancelNew)) {
                onCancelNew()
              }
            }}
            iconPosition="left" icon={<ArrowUndoIcon aria-hidden />}
          >
            {labels?.cancel ?? t('ui:cancel')}
          </Button>
        </HStack>
      </Box>
    )
  }

  return (
    <Box className={classNames(alwaysVisible ? '' : 'control-buttons', 'noMargin')}>
      <HStack gap="4">
        {allowEdit && (
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              if (onStartEdit) {
                onStartEdit(item!, index)
              }
            }}
            iconPosition="left" icon={<PencilIcon aria-hidden />}
          >
            {labels?.edit ?? t('ui:edit')}
          </Button>
        )}
        {onCopy &&
          <Button
            size='small'
            variant='tertiary'
            onClick={() => {
              onCopy(item!, index)
            }}
            iconPosition="left" icon={<FilesIcon aria-hidden />}
          >
            {labels?.copy ?? t('ui:copy')}
          </Button>
        }
        {allowDelete && (
          <Button
            size='small'
            variant='tertiary'
            onClick={() => setInDeleteMode(true)}
            iconPosition="left" icon={<TrashIcon aria-hidden />}
          >
            {labels?.remove ?? t('ui:remove')}
          </Button>
        )}
      </HStack>
    </Box>
  )
}

export default AddRemovePanel
