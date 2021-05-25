import { ytelsestypeOptions } from '../P5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett } from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue } from 'declarations/app'
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
import { P5000SED } from 'declarations/p5000'

interface SEDLoadSaveProps {
  buc: Buc
  highContrast: boolean
  p5000Storage: LocalStorageEntry<P5000SED>
  setP5000Storage: (e: LocalStorageEntry<P5000SED>) => void
  sedId: string
}

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  p5000Storage,
  setP5000Storage,
  highContrast,
  sedId
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
          .map((sed: LocalStorageValue<P5000SED>) => (
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
                        {_.find(ytelsestypeOptions, (o: OptionTypeBase) => (
                           o?.value === (sed.content as P5000SED)?.pensjon.medlemskapboarbeid.enkeltkrav.krav
                        ))?.label ?? '-'}
                      </Normaltekst>
                    </FlexBaseDiv>
                    <VerticalSeparatorDiv size='0.3' />
                    <FlexBaseDiv>
                      <UndertekstBold>
                        {t('buc:p5000-4-2-title') + ': '}
                      </UndertekstBold>
                      <HorizontalSeparatorDiv size='0.5' />
                      <Normaltekst>
                        {(sed.content as P5000SED).pensjon.medlemskapboarbeid.gyldigperiode}
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
                        {sed.content?.pensjon.medlemskapboarbeid?.medlemskap?.length}
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
