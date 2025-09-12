import {BodyLong, Box, HStack, Spacer, VStack} from '@navikt/ds-react'
import { saveEntries } from 'src/actions/localStorage'
import { updateP5000WorkingCopies } from 'src/applications/P5000/utils/entriesUtils'
import { ytelseType } from 'src/applications/P5000/P5000.labels'
import { LocalStorageEntry, LocalStorageEntriesMap, Option } from 'src/declarations/app'
import { Buc } from 'src/declarations/buc'
import { P5000SED } from 'src/declarations/p5000'
import { State } from 'src/declarations/reducers'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import AddRemovePanel from "src/components/AddRemovePanel/AddRemovePanel";

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
  const { storageEntries } = useSelector<State, SEDLoadSaveSelector>(mapState)

  const [ytelseOptions] = useState<Array<Option>>(() => Object.keys(ytelseType)
    .sort((a: string | number, b: string | number) => (_.isNumber(a) ? a : parseInt(a)) > (_.isNumber(b) ? b : parseInt(b)) ? 1 : -1)
    .map((e: string | number) => ({ label: '[' + e + '] ' + _.get(ytelseType, e), value: '' + e })))

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const entries: Array<LocalStorageEntry<P5000SED>> | undefined =
    storageEntries?.[buc.caseId!]?.filter(entry => entry.sedId === sedId && entry.sedType === 'P5000') as Array<LocalStorageEntry<P5000SED>> | undefined

  const onRemove = (removedEntry: LocalStorageEntry) => {
    const sedId = removedEntry.sedId
    const newEntries: Array<LocalStorageEntry<P5000SED>> = updateP5000WorkingCopies(entries!, undefined, sedId)
    dispatch(saveEntries(buc.caseId!, newEntries))
  }

  return (
    <VStack>
      {entries?.map((entry: LocalStorageEntry<P5000SED>, index) => (
        <HStack key={entry.sedId} align="baseline">
          <Spacer/>
          <Box padding="4" borderWidth="1" borderColor="border-default" borderRadius="small" background={"surface-subtle"}>
            <HStack
              gap="4"
              align="center"
            >
              <VStack>
                <BodyLong>
                  {t('p5000:saved-entries')}
                </BodyLong>
                <HStack
                  align="center"
                  gap="2"
                >
                  <BodyLong size='small'>
                    {t('p5000:4-1-title') + ': '}
                  </BodyLong>
                  <BodyLong>
                    {_.find(ytelseOptions, (o: Option) => (
                      o?.value === (entry.content as P5000SED)?.pensjon?.medlemskapboarbeid?.enkeltkrav?.krav
                    ))?.label ?? '-'}
                  </BodyLong>
                </HStack>
                <HStack
                  align="center"
                  gap="2"
                >
                  <BodyLong size='small'>
                    {t('p5000:4-2-title') + ': '}
                  </BodyLong>
                  <BodyLong>
                    {(entry.content as P5000SED)?.pensjon?.medlemskapboarbeid?.gyldigperiode}
                  </BodyLong>
                </HStack>
                <HStack
                  align="center"
                  gap="2"
                >
                  <BodyLong size='small'>
                    {t('ui:date') + ': '}
                  </BodyLong>
                  <BodyLong>
                    {new Date(entry.date).toLocaleDateString()}
                  </BodyLong>
                </HStack>
                <HStack
                  align="center"
                  gap="2"
                >
                  <BodyLong size='small'>
                    {t('ui:rows') + ': '}
                  </BodyLong>
                  <BodyLong>
                    {entry.content?.pensjon.medlemskapboarbeid?.medlemskap?.length}
                  </BodyLong>
                </HStack>
              </VStack>
              <AddRemovePanel
                item={entry}
                index={index}
                onRemove={onRemove}
                allowEdit={false}
              />
            </HStack>
          </Box>
        </HStack>
      )
      )}
    </VStack>
  )
}

export default SEDLoadSave
