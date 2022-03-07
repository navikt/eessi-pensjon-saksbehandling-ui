import { BodyLong, Panel } from '@navikt/ds-react'
import { saveEntries } from 'actions/localStorage'
import { updateP5000WorkingCopies } from 'applications/P5000/utils/entriesUtils'
import { ytelseType } from 'applications/P5000/P5000.labels'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { LocalStorageEntry, LocalStorageEntriesMap, Option } from 'declarations/app'
import { Buc } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileDiv } from '@navikt/hoykontrast'
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
  storageEntries: LocalStorageEntriesMap
}

const mapState = (state: State): SEDLoadSaveSelector => ({
  storageEntries: state.localStorage.entries
})

const SEDLoadSave: React.FC<SEDLoadSaveProps> = ({
  buc,
  sedId
}: SEDLoadSaveProps) => {
  const [_confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const { storageEntries } = useSelector<State, SEDLoadSaveSelector>(mapState)

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const entries: Array<LocalStorageEntry<P5000SED>> | undefined =
    storageEntries?.[buc.caseId!]?.filter(entry => entry.sedId === sedId && entry.sedType === 'P5000') as Array<LocalStorageEntry<P5000SED>> | undefined

  const onRemove = (caseId: string, sedId: string) => {
    const newEntries: Array<LocalStorageEntry<P5000SED>> = updateP5000WorkingCopies(entries!, undefined, sedId)
    dispatch(saveEntries(caseId, newEntries))
  }

  return (
    <PileDiv>
      {entries?.map((entry: LocalStorageEntry<P5000SED>) => (
        <FlexBaseDiv key={entry.sedId} style={{ flexDirection: 'row-reverse' }}>
          <MyPanel border>
            <FlexBaseDiv style={{ alignItems: 'center' }}>
              <PileDiv>
                <BodyLong>
                  {t('p5000:saved-entries')}
                </BodyLong>
                <FlexBaseDiv>
                  <BodyLong size='small'>
                    {t('p5000:4-1-title') + ': '}
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
                    {t('p5000:4-2-title') + ': '}
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
                  onConfirmRemove={() => onRemove(buc.caseId!, entry.sedId)}
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
