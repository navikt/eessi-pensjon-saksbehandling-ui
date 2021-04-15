import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexBaseDiv, FlexCenterDiv, PileDiv } from 'components/StyledComponents'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { LocalStorageEntry } from 'declarations/app'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, {
  HighContrastFlatknapp,
  HorizontalSeparatorDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SEDLoadSaveProps {
  highContrast: boolean
  onLoad: (content: any) => void
  storageKey: string
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = <CustomLocalStorageContent extends any>({
  highContrast,
  onLoad,
  storageKey
}: SEDLoadSaveProps) => {
  const [_savedEntries, setSavedEntries] = useState<Array<LocalStorageEntry<CustomLocalStorageContent>> | null | undefined>(undefined)
  const [_loadingSavedItems, setLoadingSavedItems] = useState<boolean>(false)
  const [_confirmDelete, setConfirmDelete] = useState<Array<string>>([])
  const { t } = useTranslation()

  const loadReplySeds = async () => {
    setLoadingSavedItems(true)
    const items: string | null = await window.localStorage.getItem(storageKey)
    let savedEntries: Array<LocalStorageEntry<CustomLocalStorageContent>> | null | undefined
    if (_.isString(items)) {
      savedEntries = JSON.parse(items)
    } else {
      savedEntries = null
    }
    setSavedEntries(savedEntries)
    setLoadingSavedItems(false)
  }

  const onRemove = async (i: number) => {
    const newReplySeds = _.cloneDeep(_savedEntries)
    if (!_.isNil(newReplySeds)) {
      newReplySeds.splice(i, 1)
      setSavedEntries(newReplySeds)
      await window.localStorage.setItem(storageKey, JSON.stringify(newReplySeds))
    }
  }

  const onDownload = async (savedEntry: LocalStorageEntry<CustomLocalStorageContent>) => {
    const fileName = savedEntry!.name + '.json'
    const json = JSON.stringify(savedEntry.content)
    const blob = new Blob([json], { type: 'application/json' })
    const href = await URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const addCandidateForDeletion = (key: string) => {
    setConfirmDelete(_confirmDelete.concat(key))
  }

  const removeCandidateForDeletion = (key: string) => {
    setConfirmDelete(_.filter(_confirmDelete, it => it !== key))
  }

  useEffect(() => {
    if (_savedEntries === undefined && !_loadingSavedItems) {
      loadReplySeds()
      setLoadingSavedItems(true)
    }
  }, [_savedEntries, _loadingSavedItems])

  return (
    <NavHighContrast highContrast={highContrast}>

      <PileDiv>
        {_loadingSavedItems && (<WaitingPanel />)}
        {_savedEntries === null || _.isEmpty(_savedEntries)
          ? (
            <Normaltekst>
              {t('buc:p5000-no-saved-entries')}
            </Normaltekst>
            )
          : (
            <Normaltekst>
              {t('buc:p5000-saved-entries')}
            </Normaltekst>
            )}
        <VerticalSeparatorDiv />
        {_savedEntries && _savedEntries.map((savedEntry: LocalStorageEntry<CustomLocalStorageContent>, i: number) => {
          const candidateForDeletion = _confirmDelete.indexOf(savedEntry.name) >= 0
          return (
            <div key={savedEntry.name}>
              <Etikett style={{ padding: '0.5rem' }}>
                <PileDiv>
                  <FlexCenterDiv>
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('ui:name') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {savedEntry.name}
                      </Normaltekst>
                    </FlexBaseDiv>
                    <HorizontalSeparatorDiv />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('ui:date') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv data-size='0.5' />
                      <Normaltekst>
                        {savedEntry.date}
                      </Normaltekst>
                    </FlexBaseDiv>
                  </FlexCenterDiv>
                  <VerticalSeparatorDiv data-size='0.5' />
                  <FlexBaseDiv>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => onLoad(savedEntry.content)}
                    >
                      {t('ui:load')}
                    </HighContrastFlatknapp>
                    <HighContrastFlatknapp
                      mini
                      kompakt
                      onClick={() => onDownload(savedEntry)}
                    >
                      {t('ui:download')}
                    </HighContrastFlatknapp>
                    <AddRemovePanel
                      existingItem
                      candidateForDeletion={candidateForDeletion}
                      onBeginRemove={() => addCandidateForDeletion(savedEntry.name)}
                      onConfirmRemove={() => onRemove(i)}
                      onCancelRemove={() => removeCandidateForDeletion(savedEntry.name!)}
                    />
                  </FlexBaseDiv>
                </PileDiv>
              </Etikett>
              <VerticalSeparatorDiv />
            </div>
          )
        })}
      </PileDiv>
    </NavHighContrast>
  )
}

export default SEDLoadSave
