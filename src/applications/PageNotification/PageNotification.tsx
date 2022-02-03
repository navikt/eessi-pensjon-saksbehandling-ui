import { setNotification } from 'actions/pagenotification'
import { pageNotificationValidate, PageNotificationValidationProps } from 'applications/PageNotification/validation'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import { Loader, Button, Panel, RadioGroup, Radio } from '@navikt/ds-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface PageNotificationSelector {
  message: string | null | undefined
  byline: string | null | undefined
  show: boolean | undefined
  sendingPageNotification: boolean
  response: any
}

const mapState = (state: State): PageNotificationSelector => ({
  message: state.pagenotification.message,
  show: state.pagenotification.show,
  byline: state.pagenotification.byline,
  sendingPageNotification: state.loading.sendingPageNotification,
  response: state.pagenotification.response
})

const PageNotification = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { message, show, byline, sendingPageNotification }: PageNotificationSelector = useSelector<State, PageNotificationSelector>(mapState)
  const [_show, _setShow] = useState<boolean | undefined>(show)
  const [_message, _setMessage] = useState<string | null | undefined>(message)
  const [_byline, _setByline] = useState<string | null | undefined>(byline)
  const [validation, resetValidation, performValidation] = useValidation<PageNotificationValidationProps>({}, pageNotificationValidate)

  const setShow = (newShow: string) => {
    _setShow(newShow === 'true')
    resetValidation('w-pagenotification-show')
  }

  const setMessage = (newMessage: string) => {
    _setMessage(newMessage)
    resetValidation('w-pagenotification-message')
  }

  const setByline = (newByline: string) => {
    _setByline(newByline)
    resetValidation('w-pagenotification-byline')
  }

  const onSave = () => {
    const valid = performValidation({
      show: _show,
      message: _message,
      byline: _byline
    })
    if (valid) {
      dispatch(setNotification(_message, _show, _byline))
    }
  }

  return (
    <Panel>
      <RadioGroup
        value={'' + _show}
        error={validation['w-pagenotification-show']?.feilmelding}
        data-test-id='w-pagenotification-show'
        id='w-pagenotification-show'
        data-no-border
        legend={t('ui:show-message') + ' *'}
        name='w-pagenotification-show'
        onChange={setShow}
      >
        <Radio value='true'>{t('ui:yes')}</Radio>
        <Radio value='false'>{t('ui:no')}</Radio>
      </RadioGroup>
      <VerticalSeparatorDiv />
      <Input
        id='message'
        namespace='w-pagenotification'
        onChanged={setMessage}
        error={validation['w-pagenotification-message']?.feilmelding}
        label={t('ui:message')}
        value={_message ?? ''}
      />
      <VerticalSeparatorDiv />
      <Input
        id='byline'
        namespace='w-pagenotification'
        onChanged={setByline}
        error={validation['w-pagenotification-byline']?.feilmelding}
        label={t('ui:byline')}
        value={_byline ?? ''}
      />
      <VerticalSeparatorDiv />
      <Button
        variant='primary'
        disabled={sendingPageNotification}
        onClick={onSave}
      >
        {sendingPageNotification && <Loader />}
        {sendingPageNotification ? t('ui:sending') : t('ui:update')}
      </Button>
    </Panel>

  )
}

export default PageNotification
