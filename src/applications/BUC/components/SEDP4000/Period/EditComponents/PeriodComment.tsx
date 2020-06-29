import { Period } from 'declarations/period'
//import { PeriodPropType } from 'declarations/period.pt'
import React from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Row } from 'nav-frontend-grid'
import { Normaltekst, UndertekstBold, Undertittel } from 'nav-frontend-typografi'
import Hjelpetekst from 'nav-frontend-hjelpetekst'
import { Textarea } from 'nav-frontend-skjema'

export interface PeriodCommentProps {
  period: Period;
  setComment: (e: React.ChangeEvent) => void;
}

const PeriodComment: React.FC<PeriodCommentProps> = ({ period, setComment }: PeriodCommentProps): JSX.Element => {
  const { t } = useTranslation()
  return (
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
                <Hjelpetekst>
                  {t('buc:p4000-help-comment-info')}
                </Hjelpetekst>
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
}

PeriodComment.propTypes = {
  //period: PeriodPropType.isRequired,
  setComment: PT.func.isRequired
}

export default PeriodComment
