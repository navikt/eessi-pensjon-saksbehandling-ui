import Add from 'assets/icons/Tilsette'
import Trashcan from 'assets/icons/Trashcan'
import classNames from 'classnames'
import { Normaltekst } from 'nav-frontend-typografi'
import { FlexCenterDiv, HighContrastFlatknapp, HorizontalSeparatorDiv } from 'nav-hoykontrast'
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

const AddRemovePanel: React.FC<AddRemovePanelProps> = ({
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
        <Normaltekst>
          {t('ui:are-you-sure')}
        </Normaltekst>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onConfirmRemove}
        >
          {t('ui:yes')}
        </HighContrastFlatknapp>
        <HorizontalSeparatorDiv size='0.5' />
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={onCancelRemove}
        >
          {t('ui:no')}
        </HighContrastFlatknapp>
      </FlexCenterDiv>
      )
    : (
      <div className={classNames({ nolabel: marginTop })}>
        <HighContrastFlatknapp
          mini
          kompakt
          onClick={existingItem ? onBeginRemove : onAddNew}
        >
          {!existingItem ? <Add /> : <Trashcan />}
          <HorizontalSeparatorDiv size='0.5' />
          {!existingItem ? t('ui:add') : t('ui:remove')}
        </HighContrastFlatknapp>
        {!existingItem && (
          <>
            <HorizontalSeparatorDiv />
            <HighContrastFlatknapp
              mini
              kompakt
              onClick={onCancelNew}
            >
              {t('ui:cancel')}
            </HighContrastFlatknapp>
          </>
        )}
      </div>
      )
}

export default AddRemovePanel
