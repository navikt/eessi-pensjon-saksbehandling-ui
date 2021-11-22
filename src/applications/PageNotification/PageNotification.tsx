import { setNotification } from 'actions/pagenotification'
import { pageNotificationValidate, PageNotificationValidationProps } from 'applications/PageNotification/validation'
import Input from 'components/Forms/Input'
import { State } from 'declarations/reducers'
import useValidation from 'hooks/useValidation'
import {
  HighContrastHovedknapp,
  HighContrastPanel,
  HighContrastRadioPanelGroup,
  VerticalSeparatorDiv
} from 'nav-hoykontrast'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

export interface PageNotificationSelector {
  highContrast: boolean
  message: string | null | undefined
  byline: string | null | undefined
  show: boolean | undefined
  sendingPageNotification: boolean
  response: any
}

const mapState = (state: State): PageNotificationSelector => ({
  highContrast: state.ui.highContrast,
  message: state.pagenotification.message,
  show: state.pagenotification.show,
  byline: state.pagenotification.byline,
  sendingPageNotification: state.loading.sendingPageNotification,
  response: state.pagenotification.response
})

const PageNotification = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {message, show, byline, sendingPageNotification}: PageNotificationSelector = useSelector<State, PageNotificationSelector>(mapState)
  const [_show, _setShow] = useState<boolean | undefined>(show)
  const [_message, _setMessage] = useState<string | null | undefined>(message)
  const [_byline, _setByline] = useState<string | null | undefined>(byline)
  const [validation, resetValidation, performValidation] = useValidation<PageNotificationValidationProps>({}, pageNotificationValidate)

  const setShow = (newShow: boolean) => {
    _setShow(newShow)
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
    <HighContrastPanel>
      <HighContrastRadioPanelGroup
        checked={'' + _show}
        feil={validation['w-pagenotification-show']?.feilmelding}
        data-test-id={'w-pagenotification-show'}
        id={'w-pagenotification-show'}
        data-no-border
        legend={t('label:show-message') + ' *'}
        name={'w-pagenotification-show'}
        radios={[
          { label: t('ui:yes'), value: 'true' },
          { label: t('ui:no'), value: 'false' }
        ]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShow(e.target.value === 'true')}
      />
      <VerticalSeparatorDiv/>
      <Input
        id='message'
        namespace='w-pagenotification'
        onChanged={setMessage}
        feil={validation['w-pagenotification-message']?.feilmelding}
        label={t('ui:message')}
        value={_message ?? ''}
      />
      <VerticalSeparatorDiv/>
      <Input
        id='byline'
        namespace='w-pagenotification'
        onChanged={setByline}
        feil={validation['w-pagenotification-byline']?.feilmelding}
        label={t('ui:byline')}
        value={_byline ?? ''}
      />
      <VerticalSeparatorDiv/>
      <HighContrastHovedknapp
        spinner={sendingPageNotification}
        disabled={sendingPageNotification}
        onClick={onSave}
      >
        {sendingPageNotification ? t('ui:sending') : t('ui:update')}
      </HighContrastHovedknapp>
    </HighContrastPanel>

  )
}

export default PageNotification
