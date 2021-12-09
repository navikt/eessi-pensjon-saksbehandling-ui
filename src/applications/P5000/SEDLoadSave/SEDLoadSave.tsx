import { BodyLong, Panel } from '@navikt/ds-react'
import { unsyncFromP5000Storage } from 'actions/p5000'
import { ytelseType } from 'applications/P5000/P5000.labels'
import AddRemovePanel from 'components/AddRemovePanel/AddRemovePanel'
import { LocalStorageEntry, LocalStorageValue, Option } from 'declarations/app'
import { Buc } from 'declarations/buc'
import { P5000SED } from 'declarations/p5000'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { FlexBaseDiv, HorizontalSeparatorDiv, PileDiv } from 'nav-hoykontrast'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

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

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

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
            <Panel border>
              <FlexBaseDiv style={{ alignItems: 'center' }} key={sed.id}>
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
                        o?.value === (sed.content as P5000SED)?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
                      ))?.label ?? '-'}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('buc:p5000-4-2-title') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {(sed.content as P5000SED)?.pensjon?.medlemskapboarbeid?.gyldigperiode}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('ui:date') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {new Date(sed.date).toLocaleDateString()}
                    </BodyLong>
                  </FlexBaseDiv>
                  <FlexBaseDiv>
                    <BodyLong size='small'>
                      {t('ui:rows') + ': '}
                    </BodyLong>
                    <HorizontalSeparatorDiv size='0.5' />
                    <BodyLong>
                      {sed.content?.pensjon.medlemskapboarbeid?.medlemskap?.length}
                    </BodyLong>
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
            </Panel>
          </FlexBaseDiv>
        )
        )}
    </PileDiv>
  )
}

export default SEDLoadSave
