import { useDispatch, useSelector } from 'react-redux'
import { ytelsestypeOptions } from '../P5000Edit'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { Etikett } from 'components/StyledComponents'
import { LocalStorageEntry, LocalStorageValue } from 'declarations/app'
import { Buc } from 'declarations/buc'
import _ from 'lodash'
import { Normaltekst, UndertekstBold } from 'nav-frontend-typografi'
import {
  FlexBaseDiv,
  HorizontalSeparatorDiv,
  PileDiv,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { OptionTypeBase } from 'react-select'
import { P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import { unsyncFromP5000Storage } from 'actions/p5000'

interface SEDLoadSaveProps {
  buc: Buc
  sedId: string
}

interface SEDLoadSaveSelector {
  p5000Storage: LocalStorageEntry<P5000SED> | undefined
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  p5000Storage: state.p5000.p5000Storage
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  sedId
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { p5000Storage } = useSelector<State, SEDLoadSaveSelector>(mapState)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onRemove = (caseId: string, sedId: string) => {
    dispatch(unsyncFromP5000Storage(caseId, sedId))
  }

  return (
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
                        o?.value === (sed.content as P5000SED)?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
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
                      {(sed.content as P5000SED)?.pensjon?.medlemskapboarbeid?.gyldigperiode}
                    </Normaltekst>
                  </FlexBaseDiv>
                  <VerticalSeparatorDiv size='0.3' />
                  <FlexBaseDiv>
                    <UndertekstBold>
                      {t('ui:date') + ': '}
                    </UndertekstBold>
                    <HorizontalSeparatorDiv size='0.5' />
                    <Normaltekst>
                      {new Date(sed.date).toLocaleDateString()}
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
  )
}

export default SEDLoadSave
