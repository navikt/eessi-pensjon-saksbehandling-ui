import { ytelsestypeOptions } from '../SEDP5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett } from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue, P5000EditLocalStorageContent } from 'declarations/app'
import { Buc } from 'declarations/buc'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, {
  FlexBaseDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'

interface SEDLoadSaveProps {
  buc: Buc
  highContrast: boolean
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  sedId: string
  setP5000Storage: (it: LocalStorageEntry<P5000EditLocalStorageContent>) => void
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  highContrast,
  sedId,
  p5000Storage,
  setP5000Storage
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { t } = useTranslation()

  const onRemove = (caseId: string, sedId: string) => {
    const newP5000Storage = _.cloneDeep(p5000Storage)
    if (!_.isNil(newP5000Storage)) {
      let newValue = _.cloneDeep(p5000Storage[caseId])
      newValue = _.filter(newValue, n => n.id !== sedId)
      if (_.isEmpty(newValue)) {
        delete newP5000Storage[caseId]
      } else {
        newP5000Storage[caseId] = newValue
      }
      setP5000Storage(newP5000Storage)
    }
  }

  return (
    <NavHighContrast highContrast={highContrast}>
      <PileDiv>
        {p5000Storage && p5000Storage[buc.caseId!] && p5000Storage[buc.caseId!]
          .filter(sed => sed.id === sedId)
          .map((sed: LocalStorageValue<P5000EditLocalStorageContent>) => (
            <FlexBaseDiv key={sed.id} style={{ flexDirection: 'row-reverse' }}>
              <Etikett style={{ padding: '0.5rem', display: 'flex' }}>
                <FlexBaseDiv style={{ alignItems: 'center' }} key={sed.id}>
                  <PileDiv>
                    <Normaltekst>
                      {t('buc:p5000-saved-entries')}
                    </Normaltekst>
                    <VerticalSeparatorDiv size='0.3' />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('buc:p5000-4-1-title') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv size='0.5' />
                      <Normaltekst>
                        {(sed.content as P5000EditLocalStorageContent)
                          .ytelseOption
                          ? _.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                              o?.value === (sed.content as P5000EditLocalStorageContent)?.ytelseOption
                            ))?.label
                          : '-'}
                      </Normaltekst>
                    </FlexBaseDiv>
                    <VerticalSeparatorDiv size='0.3' />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('buc:p5000-4-2-title') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv size='0.5' />
                      <Normaltekst>
                        {(sed.content as P5000EditLocalStorageContent).forsikringElklerBosetningsperioder}
                      </Normaltekst>
                    </FlexBaseDiv>
                    <VerticalSeparatorDiv size='0.3' />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('ui:date') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv size='0.5' />
                      <Normaltekst>
                        {sed.date}
                      </Normaltekst>
                    </FlexBaseDiv>
                    <VerticalSeparatorDiv size='0.3' />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('ui:rows') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv size='0.5' />
                      <Normaltekst>
                        {sed.content?.items?.length}
                      </Normaltekst>
                    </FlexBaseDiv>
                  </PileDiv>
                  <HorizontalSeparatorDiv />
                  <FlexBaseDiv>
                    <AddRemovePanel
                      existingItem
                      candidateForDeletion={_confirmDelete}
                      onBeginRemove={() => setConfirmDelete(true)}
                      onConfirmRemove={() => onRemove(buc.caseId!, sed.id)}
                      onCancelRemove={() => setConfirmDelete(false)}
                    />
                  </FlexBaseDiv>
                </FlexBaseDiv>
              </Etikett>
            </FlexBaseDiv>
          )
          )}
      </PileDiv>
    </NavHighContrast>
  )
}

export default SEDLoadSave
