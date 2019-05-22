import React, {useState} from 'react'
import classNames from 'classnames'
import { EkspanderbartpanelBase, Ingress, Normaltekst } from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'
import _ from 'lodash'

import './BUCDetail.css'

const BUCDetail = (props) => {

  const { t, buc, className, locale } = props

  console.log(buc)
  return <EkspanderbartpanelBase
    className={classNames('a-buc-c-bucdetail', className)}
    heading={<Ingress className='a-buc-c-bucdetail-header'>{buc.type + ' - ' + buc.name}</Ingress>
    }>
      <div className='a-buc-c-bucdetail-body'>
        <dl className='a-buc-c-bucdetail-props'>
          <dt>Opprettet:</dt>
          <dd>dd.mm.åååå</dd>
          <dt>Sakseier (CO):</dt>
          <dd>xxxxxxxxx</dd>
          <dt>Merknad:</dt>
          <dd>Hastesak</dd>
        </dl>
        <Ingress className='mb-2'>{t('buc:form-involvedInstitutions')}:</Ingress>
        {!_.isEmpty(buc.institutions) ? Object.keys(buc.institutions).map(landkode => {
           return <div className='d-flex align-items-baseline'>
             <FlagList locale={locale} countries={[landkode]} overflowLimit={5} flagPath='../../../../flags/' extention='.png' />
             <span>{landkode}: {buc.institutions[landkode].join(', ')}</span>
           </div>
        }) : <Normaltekst>{t('buc:form-noInstitutionYet')}</Normaltekst>}
      </div>
    </EkspanderbartpanelBase>
}

export default BUCDetail
