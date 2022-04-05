import { getSed, jornalføreSed } from 'actions/journalføring'
import { TextArea } from 'applications/BUC/components/BUCTools/BUCTools'
import { JournalføringValidate, JournalføringValidationProps } from 'applications/Journalføring/validation'
import Select from 'components/Select/Select'
import WaitingPanel from 'components/WaitingPanel/WaitingPanel'
import { Option } from 'declarations/app'
import { Sed } from 'declarations/buc'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import _ from 'lodash'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Panel, Loader } from '@navikt/ds-react'

export interface JournalføringSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  seds: Array<Sed> | null | undefined
  sedSend: any | null | undefined
  gettingJournalføringSed: boolean
  sendingJournalføringSend: boolean
}

const mapState = (state: State): JournalføringSelector => ({
  aktoerId: state.app.params.aktoerId,
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
    aktoerId, sakId, seds, gettingJournalføringSed,
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
    _resetValidation('w-journalføring--sed-select-id')
  }

  useEffect(() => {
    if (seds === undefined && !gettingJournalføringSed) {
      dispatch(getSed(sakId, aktoerId))
    }
  }, [])

  if (gettingJournalføringSed) {
    return (<WaitingPanel size='xsmall' oneLine message={t('message:loading-gettingSEDs')} />)
  }

  if (gettingJournalføringSed === null) {
    return (
      <Button
        variant='primary'
        onClick={() => dispatch(getSed(sakId, aktoerId))}
      >
        {t('Error. retry?')}
      </Button>
    )
  }

  return (
    <Panel>
      <Select
        key='w-journalføring--sed-select-key'
        id='w-journalføring--sed-select-id'
        error={_validation['w-journalføring--sed-select-id']?.feilmelding}
        options={sedOptions}
        label={t('jou:sed')}
        menuPortalTarget={document.body}
        onChange={(e: unknown) => setSed((e as Option).value)}
        defaultValue={_.find(sedOptions, o => o.value === _sed)}
        value={_.find(sedOptions, o => o.value === _sed)}
      />
      <VerticalSeparatorDiv />
      <TextArea
        data-testid='w-journalføring--sed-comment-id'
        className='skjemaelement--input'
        label={t('ui:comment')}
        value={_sedComment || ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void => _setSedComment(e.target.value)}
      />
      <VerticalSeparatorDiv />
      <Button
        variant='primary'
        disabled={sendingJournalføringSend}
        onClick={handleJournalføringClick}
      >
        {sendingJournalføringSend && <Loader />}
        {sendingJournalføringSend ? t('jou:journalføring') : t('jou:journalføre')}
      </Button>
    </Panel>

  )
}

export default Journalføring
