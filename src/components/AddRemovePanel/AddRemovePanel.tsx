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
import { Button, BodyLong } from '@navikt/ds-react'
import { HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

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

const InlineFlexDiv = styled.div`
  display: inline-flex;
  align-items: flex-center;
  margin-top: 0.5rem;
  &.marginTop {
    margin-top: 2.5rem;
  }
  &.noMargin {
    margin-top: 0rem;
  }
`

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
      <InlineFlexDiv className={classNames('slideInFromRight', { marginTop }, { noMargin })}>
        <BodyLong style={{ whiteSpace: 'nowrap' }}>
          {labels?.areYouSure ?? t('ui:are-you-sure')}
        </BodyLong>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => {onRemove(item!);setInDeleteMode(false)}}
        >
          {labels?.yes ?? t('ui:yes')}
        </Button>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          size='small'
          variant='tertiary'
          onClick={() => setInDeleteMode(false)}
        >
          {labels?.no ?? t('ui:no')}
        </Button>
      </InlineFlexDiv>
    )
  }

  if (candidateForEdition) {
    return (
      <InlineFlexDiv className={classNames({ marginTop }, { noMargin })}>
        <HorizontalSeparatorDiv />
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
        <HorizontalSeparatorDiv />
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
      </InlineFlexDiv>
    )
  }

  if (isNew) {
    return (
      <InlineFlexDiv className={classNames({ marginTop }, { noMargin })}>
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
        <HorizontalSeparatorDiv />
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
      </InlineFlexDiv>
    )
  }

  return (
    <InlineFlexDiv className={classNames(alwaysVisible ? '' : 'control-buttons', 'noMargin')}>
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
        <>
          <HorizontalSeparatorDiv />
          <Button
            size='small'
            variant='tertiary'
            onClick={() => setInDeleteMode(true)}
            iconPosition="left" icon={<TrashIcon aria-hidden />}
          >
            {labels?.remove ?? t('ui:remove')}
          </Button>
        </>
      )}
    </InlineFlexDiv>
  )
}

export default AddRemovePanel
