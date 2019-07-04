import React, { useState } from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { connect } from 'store'
import { Undertekst, Undertittel } from 'components/ui/Nav'
import Period from './Period'

export const mapStateToProps = (state) => {
  return {
    p4000: state.buc.p4000,
    locale: state.ui.locale
  }
}

const SEDP4000 = (props) => {

  const [ _period, setPeriod ] = useState({})
  const [ maxPeriods ] = useState(8)

  const { locale, p4000, t } = props
  const mode = _period && _period.id ? 'edit' : 'new'

  return <div className={classNames('a-buc-c-sedp4000', mode)}>
    {mode === 'new' ? <React.Fragment>
      <Undertittel className='mb-3'>{t('buc:p4000-title')}</Undertittel>
      <Undertekst className='mb-2'>{t('buc:p4000-description')}</Undertekst>
      <Undertekst className='mb-3'>{t('buc:p4000-info-on-help-icon')}</Undertekst>
    </React.Fragment> : null}
    {!_.isEmpty(p4000) && mode === 'new' ? <React.Fragment>
      <Undertittel className='mt-5 mb-2'>{t('buc:p4000-previousPeriods')}</Undertittel>
      {p4000.sort((a, b) => {
        return a.startDate - b.startDate
      }).map((period, index) => {
        return <Period t={t}
          mode='view'
          first={index === 0}
          last={index === p4000.length - 1}
          period={period}
          periods={p4000}
          editPeriod={() => setPeriod(period)}
          key={period.id}/>
      })}
    </React.Fragment>
      : null}
    { p4000.length < maxPeriods ? <Period t={t}
      mode={mode}
      period={_period}
      periods={p4000}
      locale={locale}
      editPeriod={() => setPeriod(_period)}
    /> : <span>
      {t('buc:p4000-alert-maxPeriods', { maxPeriods: maxPeriods })}
    </span> }
  </div>
}

SEDP4000.propTypes = {
  locale: PT.string,
  p4000: PT.array,
  t: PT.func
}

export default connect(mapStateToProps, () => {})(SEDP4000)
