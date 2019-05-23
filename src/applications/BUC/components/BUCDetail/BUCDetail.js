import React from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Element, Normaltekst } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import _ from 'lodash'

import './BUCDetail.css'

const BUCDetail = (props) => {
  const { t, buc, className, locale } = props

  return <EkspanderbartpanelBase
    id='a-a-buc-c-bucdetail-panel'
    className={classNames('a-buc-c-bucdetail', className)}
    heading={<div className='a-buc-c-bucdetail-header'>
      <Ingress>{buc.type}</Ingress>
      <Element>{buc.name}</Element>
    </div>}>
    <div className='a-buc-c-bucdetail-body'>
      <dl className='a-buc-c-bucdetail-props'>
        <dt>{t('ui:created')}:</dt>
        <dd>dd.mm.åååå</dd>
        <dt>{t('ui:caseowner')}:</dt>
        <dd>xxxxxxxxx</dd>
        <dt>{t('ui:tags')}:</dt>
        <dd>xxxxxxxxx</dd>
      </dl>
      <Ingress className='mb-2'>{t('buc:form-involvedInstitutions')}:</Ingress>
      {!_.isEmpty(buc.institutions) ? Object.keys(buc.institutions).map(landkode => {
        return <div className='a-buc-c-bucdetail-institutions'>
          <FlagList locale={locale} countries={[landkode]} overflowLimit={5} flagPath='../../../../flags/' extention='.png' />
          <span>{landkode}: {buc.institutions[landkode].join(', ')}</span>
        </div>
      }) : <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>}
    </div>
  </EkspanderbartpanelBase>
}

export default BUCDetail
