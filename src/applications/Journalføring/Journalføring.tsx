import { getSed } from 'actions/journalføring'
import { TextArea } from 'applications/BUC/components/BUCTools/BUCTools'
import { typeOptions } from 'applications/P5000/P5000Edit'
import Select from 'components/Select/Select'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { O } from 'declarations/app'
import { Sed } from 'declarations/buc'
import { State } from 'declarations/reducers'
import _ from 'lodash'
import { HighContrastHovedknapp, HighContrastPanel } from 'nav-hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface JournalføringSelector {
  aktoerId: string | null | undefined
  highContrast: boolean
  sakId: string | null | undefined
  seds: Array<Sed> | null | undefined
  sedSend: any | null | undefined
  gettingJournalføringSed: boolean
  sendingJournalføringSend: boolean
}

const mapState = (state: State): JournalføringSelector => ({
  aktoerId: state.app.params.aktoerId,
  highContrast: state.ui.highContrast,
  sakId: state.app.params.sakId,
  seds: state.journalføring.seds,
  sedSend: state.journalføring.sedSend,
  gettingJournalføringSed: state.loading.gettingJournalføringSed,
  sendingJournalføringSend: state.loading.sendingJournalføringSend
})

const Journalføring = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    aktoerId, highContrast, sakId, seds, gettingJournalføringSed,
    sendingJournalføringSend
  }: JournalføringSelector = useSelector<State, JournalføringSelector>(mapState)

  const [_sed, _setSed] = useState<string | undefined>(undefined)
  const [_sedComment, _setSedComment] = useState<string>('')

  const sedOptions = seds?.map(sed => ({ label: sed.id, value: sed.id })) || []

  useEffect(() => {
    if (seds === undefined && !gettingJournalføringSed) {
      dispatch(getSed(sakId, aktoerId))
    }
  }, [])

  if (gettingJournalføringSed) {
    return (<WaitingPanel size='S' oneLine message={t('buc:loading-gettingSEDs')} />)
  }

  if (gettingJournalføringSed === null) {
    return (
      <HighContrastHovedknapp
        onClick={() => dispatch(getSed(sakId, aktoerId))}
      >
        {t('Error. retry?')}
      </HighContrastHovedknapp>
    )
  }

  return (
    <HighContrastPanel>
      {sendingJournalføringSend && (
        <WaitingPanel size='S' oneLine message={t('buc:loading-sendingSed')} />
      )}
      <Select
        key='w-journalføring__sed-select-key'
        id='w-journalføring__sed-select-id'
        highContrast={highContrast}
        options={sedOptions}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => _setSed((e as O).value)}
        defaultValue={_.find(sedOptions, o => o.value === _sed)}
        value={_.find(typeOptions, o => o.value === _sed)}
      />
      <TextArea
        data-test-id='w-journalføring__sed-comment-id'
        className='skjemaelement__input'
        label=''
        value={_sedComment || ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => _setSedComment(e.target.value)}
      />
      <HighContrastHovedknapp>
        {t('doc:utgår')}
      </HighContrastHovedknapp>
    </HighContrastPanel>

  )
}

export default Journalføring
