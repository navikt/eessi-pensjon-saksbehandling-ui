import { ytelsestypeOptions } from 'applications/BUC/components/SEDP5000/SEDP5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett, FlexBaseDiv, PileDiv } from 'components/StyledComponents'
import { LocalStorageEntry, P5000EditLocalStorageContent } from 'declarations/app'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import NavHighContrast, { HighContrastFlatknapp, HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import styled from 'styled-components'

interface SEDLoadSaveProps {
  caseId: string
  highContrast: boolean
  onLoad: (content: any) => void
  p5000Storage: LocalStorageEntry<P5000EditLocalStorageContent>
  setP5000Storage: (it: LocalStorageEntry<P5000EditLocalStorageContent>) => void
}

const FlexDiv = styled.div`
  display: flex;
  align-items: baseline;
`

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  caseId,
  highContrast,
  onLoad,
  p5000Storage,
  setP5000Storage
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { t } = useTranslation()

  const onRemove = (key: string) => {
    const newP5000Storage = _.cloneDeep(p5000Storage)
    if (!_.isNil(newP5000Storage)) {
      delete newP5000Storage[key]
      setP5000Storage(newP5000Storage)
    }
  }

  const onDownload = async (content: P5000EditLocalStorageContent, caseId: string) => {
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

  return (
    <NavHighContrast highContrast={highContrast}>
      <PileDiv>
        {!_.isEmpty(p5000Storage[caseId]) && (
          <Normaltekst>
            {t('buc:p5000-saved-entries')}
          </Normaltekst>
        )}
        <VerticalSeparatorDiv />
        {p5000Storage && p5000Storage[caseId] && (
          <div key={p5000Storage[caseId].name}>
            <Etikett style={{ padding: '0.5rem' }}>
              <PileDiv>
                <PileDiv>
                  <FlexDiv>
                    <UndertekstBold>
                      {t('buc:p5000-4-1-title') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv data-size='0.5' />
                    <Normaltekst>
                      {(p5000Storage[caseId]?.content as P5000EditLocalStorageContent)
                        .ytelseOption ?
                        _.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                          o?.value === (p5000Storage[caseId]?.content as P5000EditLocalStorageContent)?.ytelseOption
                        ))?.label : '-'}
                    </Normaltekst>
                  </FlexDiv>
                  <FlexDiv>
                    <UndertekstBold>
                      {t('ui:date') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv data-size='0.5' />
                    <Normaltekst>
                      {p5000Storage[caseId].date}
                    </Normaltekst>
                  </FlexDiv>
                </PileDiv>
                <VerticalSeparatorDiv data-size='0.5' />
                <FlexBaseDiv>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onLoad(p5000Storage[caseId].content)}
                  >
                    {t('ui:load')}
                  </HighContrastFlatknapp>
                  <HighContrastFlatknapp
                    mini
                    kompakt
                    onClick={() => onDownload(p5000Storage[caseId].content, caseId)}
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
