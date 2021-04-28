import { ytelsestypeOptions } from 'applications/BUC/components/SEDP5000/SEDP5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexBaseDiv, PileDiv } from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue, P5000EditLocalStorageContent } from 'declarations/app'
import { Buc } from 'declarations/buc'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'

interface SEDLoadSaveProps {
  buc: Buc
  highContrast: boolean
  onLoad: (content: any) => void
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  sedId: string
  setP5000Storage: (it: LocalStorageEntry<P5000EditLocalStorageContent>) => void
}

const FlexDiv = styled.div`
  display: flex;
  align-items: baseline;
`

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  highContrast,
  sedId,
  onLoad,
  p5000Storage,
  setP5000Storage
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { t } = useTranslation()

  const onRemove = (caseId: string, sedId: string) => {
    let newP5000Storage = _.cloneDeep(p5000Storage)
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
        {!_.isEmpty(p5000Storage[buc.caseId!]) && (
          <Normaltekst>
            {t('buc:p5000-saved-entries')}
          </Normaltekst>
        )}
        <VerticalSeparatorDiv />
        {p5000Storage && p5000Storage[buc.caseId!] && p5000Storage[buc.caseId!]
          .filter((sed => sed.id === sedId))
          .map((sed: LocalStorageValue<P5000EditLocalStorageContent> ) => (
            <FlexDiv>
              <Etikett style={{ padding: '0.5rem', display: 'flex'}}>
                <div key={sed.id}>
                  <PileDiv>
                    <FlexDiv>
                      <UndertekstBold>
                        {t('buc:p5000-4-1-title') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {(sed.content as P5000EditLocalStorageContent)
                          .ytelseOption ?
                          _.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                            o?.value === (sed.content as P5000EditLocalStorageContent)?.ytelseOption
                          ))?.label : '-'}
                      </Normaltekst>
                    </FlexDiv>
                    <VerticalSeparatorDiv data-size='0.3'/>
                    <FlexDiv>
                      <UndertekstBold>
                        {t('ui:date') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {sed.date}
                      </Normaltekst>
                    </FlexDiv>
                  </PileDiv>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <FlexBaseDiv>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => onLoad(sed)}
                    >
                      {t('ui:load')}
                    </HighContrastFlatknapp>
                    <AddRemovePanel
                      existingItem
                      candidateForDeletion={_confirmDelete}
                      onBeginRemove={() => setConfirmDelete(true)}
                      onConfirmRemove={() => onRemove(buc.caseId!, sed.id)}
                      onCancelRemove={() => setConfirmDelete(false)}
                    />
                  </FlexBaseDiv>
                </div>
              </Etikett>
              <div/>
            </FlexDiv>
          )
        )}
      </PileDiv>
    </NavHighContrast>
  )
}

export default SEDLoadSave
