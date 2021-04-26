import { ytelsestypeOptions } from 'applications/BUC/components/SEDP5000/SEDP5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexBaseDiv, PileDiv } from 'components/StyledComponents'
import { LocalStorageEntry, P5000EditLocalStorageContent } from 'declarations/app'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'

interface SEDLoadSaveProps {
  caseId: string
  highContrast: boolean
  onLoad: (content: any) => void
  storageKey: string
}

const FlexDiv = styled.div`
  display: flex;
  align-items: baseline;
`

const SEDLoadSave: React.FC<SEDLoadSaveProps> = <CustomLocalStorageContent extends any>({
  caseId,
  highContrast,
  onLoad,
  storageKey
}: SEDLoadSaveProps) => {
  const [_savedEntries, setSavedEntries] = useState<LocalStorageEntry<CustomLocalStorageContent> | null | undefined>(undefined)
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { t } = useTranslation()

  const loadReplySeds = () => {
    const items: string | null = window.localStorage.getItem(storageKey)
    let savedEntries: LocalStorageEntry<CustomLocalStorageContent> | null | undefined
    if (_.isString(items)) {
      savedEntries = JSON.parse(items)
    } else {
      savedEntries = {}
    }
    setSavedEntries(savedEntries)
  }

  const onRemove = (key: string) => {
    const newReplySeds = _.cloneDeep(_savedEntries)
    if (!_.isNil(newReplySeds)) {
      delete newReplySeds[key]
      setSavedEntries(newReplySeds)
      window.localStorage.setItem(storageKey, JSON.stringify(newReplySeds))
    }
  }

  const onDownload = async (content: CustomLocalStorageContent, caseId: string) => {
    const fileName = caseId + '.json'
    const json = JSON.stringify(content)
    const blob = new Blob([json], { type: 'application/json' })
    const href = await URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (_savedEntries === undefined) {
      loadReplySeds()
    }
  }, [_savedEntries])

  return (
    <NavHighContrast highContrast={highContrast}>
      <PileDiv>
        {!_.isEmpty(_savedEntries) && (
          <Normaltekst>
            {t('buc:p5000-saved-entries')}
          </Normaltekst>
        )}
        <VerticalSeparatorDiv />
        {_savedEntries && _savedEntries[caseId] && (
          <div key={_savedEntries[caseId].name}>
            <Etikett style={{ padding: '0.5rem' }}>
              <PileDiv>
                <PileDiv>
                  <FlexDiv>
                    <UndertekstBold>
                      {t('buc:p5000-4-1-title') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv data-size='0.5' />
                    <Normaltekst>
                      {(_savedEntries[caseId]?.content as P5000EditLocalStorageContent)
                        .ytelseOption ?
                        _.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                          o?.value === (_savedEntries[caseId]?.content as P5000EditLocalStorageContent)?.ytelseOption
                        ))?.label : '-'}
                    </Normaltekst>
                  </FlexDiv>
                  <FlexDiv>
                    <UndertekstBold>
                      {t('ui:date') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv data-size='0.5' />
                    <Normaltekst>
                      {_savedEntries[caseId].date}
                    </Normaltekst>
                  </FlexDiv>
                </PileDiv>
                <VerticalSeparatorDiv data-size='0.5' />
                <FlexBaseDiv>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onLoad(_savedEntries[caseId].content)}
                  >
                    {t('ui:load')}
                  </HighContrastFlatknapp>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onDownload(_savedEntries[caseId].content, caseId)}
                  >
                    {t('ui:download')}
                  </HighContrastFlatknapp>
                  <AddRemovePanel
                    existingItem
                    candidateForDeletion={_confirmDelete}
                    onBeginRemove={() => setConfirmDelete(true)}
                    onConfirmRemove={() => onRemove(caseId)}
                    onCancelRemove={() => setConfirmDelete(false)}
                  />
                </FlexBaseDiv>
              </PileDiv>
            </Etikett>
            <VerticalSeparatorDiv />
          </div>
        )}
      </PileDiv>
    </NavHighContrast>
  )
}

export default SEDLoadSave
