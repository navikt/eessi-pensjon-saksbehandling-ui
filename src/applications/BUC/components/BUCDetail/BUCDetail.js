import React from 'react'
import PT from 'prop-types'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Element, Normaltekst } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import _ from 'lodash'

import './BUCDetail.css'

const BUCDetail = (props) => {

  const { t, buc, className, locale } = props

  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-bucdetail', className)}
    id='a-buc-c-bucdetail__panel-id'
    heading={<div
      className='a-buc-c-bucdetail__header'>
      <Ingress>{buc.type} {buc.name}</Ingress>
    </div>}>
    <div className='a-buc-c-bucdetail__body'>
      <dl className='a-buc-c-bucdetail__props'>
        <dt>{t('ui:created')}:</dt>
        <dd>dd.mm.åååå</dd>
        <dt>{t('ui:caseowner')}:</dt>
        <dd>xxxxxxxxx</dd>
        <dt>{t('ui:tags')}:</dt>
        <dd>xxxxxxxxx</dd>
      </dl>
      <Ingress className='mb-2'>{t('buc:form-involvedInstitutions')}:</Ingress>
      {!_.isEmpty(buc.institutions) ? Object.keys(buc.institutions).map(landkode => {
        return <div
          className='a-buc-c-bucdetail__institutions'
          id='a-buc-c-bucdetail__institutions-id'>
          <FlagList locale={locale} countries={[landkode]} overflowLimit={5}/>
          <Normaltekst>{landkode}: {buc.institutions[landkode].join(', ')}</Normaltekst>
        </div>
      }) : <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>}
    </div>
  </EkspanderbartpanelBase>
}

BUCDetail.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  className: PT.string,
  locale: PT.string.isRequired
}

export default BUCDetail
