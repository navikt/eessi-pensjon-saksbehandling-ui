import { BodyLong, Panel } from '@navikt/ds-react'
import { removeEntry } from 'actions/localStorage'
import { ytelseType } from 'applications/P5000/P5000.labels'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { LocalStorageEntry, Option } from 'declarations/app'
import { Buc } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileDiv } from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const MyPanel = styled(Panel)`
  background: var(--navds-semantic-color-component-background-alternate);
`

interface SEDLoadSaveProps {
  buc: Buc
  sedId: string
}

interface SEDLoadSaveSelector {
  p5000Storage: Array<LocalStorageEntry<P5000SED>> | null | undefined
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  p5000Storage: state.localStorage.P5000.entries
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  sedId
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { p5000Storage } = useSelector<State, SEDLoadSaveSelector>(mapState)

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onRemove = (caseId: string, sedId: string) => {
    dispatch(removeEntry('P5000', {
      sedId,
      caseId: buc.caseId!,
    } as LocalStorageEntry<P5000SED>))
  }

  return (
    <PileDiv>
      {p5000Storage?.filter(entry => entry.sedId === sedId && entry.caseId === buc.caseId)
        .map((entry: LocalStorageEntry<P5000SED>) => (
          <FlexBaseDiv key={entry.caseId + '-' + entry.sedId} style={{ flexDirection: 'row-reverse' }}>
            <MyPanel border>
              <FlexBaseDiv style={{ alignItems: 'center' }}>
                <PileDiv>
                  <BodyLong>
                    {t('buc:p5000-saved-entries')}
                  </BodyLong>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('buc:p5000-4-1-title') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {_.find(ytelseOptions, (o: Option) => (
                        o?.value === (entry.content as P5000SED)?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
                      ))?.label ?? '-'}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('buc:p5000-4-2-title') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {(entry.content as P5000SED)?.pensjon?.medlemskapboarbeid?.gyldigperiode}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('ui:date') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {new Date(entry.date).toLocaleDateString()}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('ui:rows') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {entry.content?.pensjon.medlemskapboarbeid?.medlemskap?.length}
                    </BodyLong>
                  </FlexBaseDiv>
                </PileDiv>
                <HorizontalSeparatorDiv />
                <FlexBaseDiv>
                  <AddRemovePanel
                    existingItem
                    candidateForDeletion={_confirmDelete}
                    onBeginRemove={() => setConfirmDelete(true)}
                    onConfirmRemove={() => onRemove(entry.caseId, entry.sedId)}
                    onCancelRemove={() => setConfirmDelete(false)}
                  />
                </FlexBaseDiv>
              </FlexBaseDiv>
            </MyPanel>
          </FlexBaseDiv>
        )
        )}
    </PileDiv>
  )
}

export default SEDLoadSave
