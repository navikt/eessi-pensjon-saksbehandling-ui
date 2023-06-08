import { Delete, Add } from '@navikt/ds-icons'
import classNames from 'classnames'
import { BodyLong, Button } from '@navikt/ds-react'
import { FlexCenterDiv, HorizontalSeparatorDiv } from '@navikt/hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface AddRemovePanelProps {
  candidateForDeletion: boolean
  existingItem: boolean
  marginTop?: boolean,
  onAddNew?: () => void
  onCancelNew?: () => void
  onBeginRemove: () => void
  onCancelRemove: () => void
  onConfirmRemove: () => void
}

const OldAddRemovePanel: React.FC<AddRemovePanelProps> = ({
  candidateForDeletion,
  existingItem,
  marginTop = undefined,
  onAddNew,
  onCancelNew,
  onBeginRemove,
  onCancelRemove,
  onConfirmRemove
}: AddRemovePanelProps): JSX.Element => {
  const { t } = useTranslation()

  return candidateForDeletion
    ? (
      <FlexCenterDiv className={classNames('slideInFromRight', { nolabel: marginTop })}>
        <BodyLong>
          {t('ui:are-you-sure')}
        </BodyLong>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          variant='tertiary'
          size='small'
          onClick={onConfirmRemove}
        >
          {t('ui:yes')}
        </Button>
        <HorizontalSeparatorDiv size='0.5' />
        <Button
          variant='tertiary'
          size='small'
          onClick={onCancelRemove}
        >
          {t('ui:no')}
        </Button>
      </FlexCenterDiv>
      )
    : (
      <div className={classNames({ nolabel: marginTop })}>
        <Button
          variant='tertiary'
          size='small'
          onClick={existingItem ? onBeginRemove : onAddNew}
        >
          {!existingItem ? <Add /> : <Delete />}
          <HorizontalSeparatorDiv size='0.5' />
          {!existingItem ? t('ui:add') : t('ui:remove')}
        </Button>
        {!existingItem && (
          <>
            <HorizontalSeparatorDiv />
            <Button
              variant='tertiary'
              size='small'
              onClick={onCancelNew}
            >
              {t('ui:cancel')}
            </Button>
          </>
        )}
      </div>
      )
}

export default OldAddRemovePanel
