import { getSed, jornalføreSed } from 'actions/journalføring'
import { TextArea } from 'applications/BUC/components/BUCTools/BUCTools'
import { JournalføringValidate, JournalføringValidationProps } from 'applications/Journalføring/validation'
import { typeOptions } from 'applications/P5000/P5000Edit'
import Select from 'components/Select/Select'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { O } from 'declarations/app'
import { Sed } from 'declarations/buc'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { HighContrastHovedknapp, HighContrastPanel, VerticalSeparatorDiv } from 'nav-hoykontrast'
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
  const [_validation, _resetValidation, _performValidation] = useValidation<JournalføringValidationProps>({}, JournalføringValidate)

  const handleJournalføringClick = () => {
    const valid = _performValidation({
      sed: _sed
    })
    if (valid) {
      dispatch(jornalføreSed(sakId, aktoerId, _sed))
    }
  }

  const setSed = (newSed: string) => {
    _setSed(newSed)
    _resetValidation('w-journalføring__sed-select-id')
  }

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
      <Select
        key='w-journalføring__sed-select-key'
        id='w-journalføring__sed-select-id'
        feil={_validation['w-journalføring__sed-select-id']?.feilmelding}
        highContrast={highContrast}
        options={sedOptions}
        label={t('jou:sed')}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => setSed((e as O).value)}
        defaultValue={_.find(sedOptions, o => o.value === _sed)}
        value={_.find(typeOptions, o => o.value === _sed)}
      />
      <VerticalSeparatorDiv />
      <TextArea
        data-test-id='w-journalføring__sed-comment-id'
        className='skjemaelement__input'
        label={t('ui:comment')}
        value={_sedComment || ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => _setSedComment(e.target.value)}
      />
      <VerticalSeparatorDiv />
      <HighContrastHovedknapp
        spinner={sendingJournalføringSend}
        disabled={sendingJournalføringSend}
        onClick={handleJournalføringClick}
      >
        {sendingJournalføringSend ? t('jou:journalføring') : t('jou:journalføre')}
      </HighContrastHovedknapp>
    </HighContrastPanel>

  )
}

export default Journalføring
