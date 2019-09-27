import React from 'react'
import PT from 'prop-types'
import { Nav } from 'eessi-pensjon-ui'

const PeriodComment = ({ period, setComment, t }) => (
  <Nav.Row>
    <div className='col-sm-12'>
      <Nav.Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-comment-info')}</Nav.Undertittel>
      <Nav.Textarea
        id='a-buc-c-sedp4000-period__comment-id'
        className='a-buc-c-sedp4000-period__comment skjemaelement__input'
        label={
          <div className='a-buc-c-sedp4000-period__label'>
            <div className='a-buc-c-sedp4000-period__label'>
              <Nav.UndertekstBold>{t('buc:p4000-label-comment-info')}</Nav.UndertekstBold>
              <Nav.HjelpetekstAuto id='a-buc-c-sedp4000-period__comment-help'>
                {t('buc:p4000-help-comment-info')}
              </Nav.HjelpetekstAuto>
            </div>
            <Nav.Normaltekst className='optional'>{t('ui:optional')}</Nav.Normaltekst>
          </div>
        }
        placeholder={t('buc:p4000-placeholder-comment-info')}
        value={period.comment || ''}
        onChange={setComment}
        maxLength={2300}
      />
    </div>
  </Nav.Row>
)

PeriodComment.propTypes = {
  period: PT.object,
  setComment: PT.func,
  t: PT.func.isRequired
}

export default PeriodComment
