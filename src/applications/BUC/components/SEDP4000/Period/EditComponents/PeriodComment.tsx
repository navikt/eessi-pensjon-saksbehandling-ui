import { Period } from 'declarations/period'
import { PeriodPropType } from 'declarations/period.pt'
import React from 'react'
import PT from 'prop-types'
import Ui from 'eessi-pensjon-ui'
import { useTranslation } from 'react-i18next'

export interface PeriodCommentProps {
  period: Period;
  setComment: (e: React.ChangeEvent) => void;
}

const PeriodComment: React.FC<PeriodCommentProps> = ({ period, setComment }: PeriodCommentProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Ui.Nav.Row>
      <div className='col-sm-12'>
        <Ui.Nav.Undertittel className='mt-5 mb-2'>{t('buc:p4000-title-comment-info')}</Ui.Nav.Undertittel>
        <Ui.Nav.Textarea
          id='a-buc-c-sedp4000-period__comment-id'
          className='a-buc-c-sedp4000-period__comment skjemaelement__input'
          label={
            <div className='a-buc-c-sedp4000-period__label'>
              <div className='a-buc-c-sedp4000-period__label'>
                <Ui.Nav.UndertekstBold>{t('buc:p4000-label-comment-info')}</Ui.Nav.UndertekstBold>
                <Ui.Nav.Hjelpetekst>
                  {t('buc:p4000-help-comment-info')}
                </Ui.Nav.Hjelpetekst>
              </div>
              <Ui.Nav.Normaltekst className='optional'>{t('ui:optional')}</Ui.Nav.Normaltekst>
            </div>
          }
          placeholder={t('buc:p4000-placeholder-comment-info')}
          value={period.comment || ''}
          onChange={setComment}
          maxLength={2300}
        />
      </div>
    </Ui.Nav.Row>
  )
}

PeriodComment.propTypes = {
  period: PeriodPropType.isRequired,
  setComment: PT.func.isRequired
}

export default PeriodComment
