import { Row } from 'nav-frontend-grid'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import { Textarea } from 'nav-frontend-skjema'
import { HjelpetekstAuto } from 'nav-frontend-hjelpetekst'
import React from 'react'
import PT from 'prop-types'

const PeriodComment = ({ t, period, setComment }) => (
  <Row>
    <div className='col-sm-12'>
      <Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-comment-info')}</Undertittel>
      <Textarea
        id='a-buc-c-sedp4000-period__comment-id'
        className='a-buc-c-sedp4000-period__comment skjemaelement__input'
        label={
          <div className='a-buc-c-sedp4000-period__label'>
            <div className='a-buc-c-sedp4000-period__label'>
              <UndertekstBold>{t('buc:p4000-label-comment-info')}</UndertekstBold>
              <HjelpetekstAuto id='a-buc-c-sedp4000-period__comment-help'>
                {t('buc:p4000-help-comment-info')}
              </HjelpetekstAuto>
            </div>
            <Normaltekst className='optional'>{t('ui:optional')}</Normaltekst>
          </div>
        }
        placeholder={t('buc:p4000-placeholder-comment-info')}
        value={period.comment || ''}
        onChange={setComment}
        maxLength={2300}
      />
    </div>
  </Row>
)

PeriodComment.propTypes = {
  period: PT.object,
  t: PT.func,
  setComment: PT.func
}

export default PeriodComment
