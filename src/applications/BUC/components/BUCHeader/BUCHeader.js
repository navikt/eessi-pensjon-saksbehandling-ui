import React from 'react'

import * as Nav from 'components/ui/Nav'
import FlagList from 'components/ui/Flag/FlagList'

import { ReactComponent as ProblemCircle } from 'resources/images/report-problem-circle.svg'
import { ReactComponent as BubbleChat } from 'resources/images/bubble-chat-2.svg'

import './BUCHeader.css'

const BUCHeader = (props) => {
  const { t, locale, buc, onBUCEdit } = props

  const requestHandleBUC = (buc, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof onBUCEdit === 'function') {
      onBUCEdit(buc)
    }
  }

  return <div className='p-0 w-100 d-flex a-buc-c-bucHeader justify-content-between'>
    <div className='col-3'>
      <Nav.Ingress data-qa='BucHeader-type-name' className='font-weight-bold'>{buc.type + ' - ' + buc.name}</Nav.Ingress>
      <Nav.Normaltekst data-qa='BucHeader-dateCreated'>{t('ui:created')}: {buc.dateCreated}</Nav.Normaltekst>
    </div>
    <div className='col-3 mr-auto d-flex align-items-center pl-0 pr-0'>
      <FlagList data-qa='BucHeader-FlagList' locale={locale} countries={buc.countries} overflowLimit={5} flagPath='../../../../flags/' extention='.png' />
    </div>
    <div className='col-3 d-flex justify-content-end align-items-center pl-0 pr-0'>
      <Nav.LenkepanelBase data-qa='BucHeader-LinkButton' onClick={(e) => requestHandleBUC(buc, e)} className='knapp goToBehandlingButton smallerButton pl-3 pr-3 pt-2 pb-2 m-0' href={buc.href} border>{t('ui:processing')}</Nav.LenkepanelBase>
    </div>
    <div className='col-2 d-flex justify-content-end align-items-center'>
      {buc.merknader && buc.merknader.length > 0
        ? <ProblemCircle data-qa='BucHeader-ProblemCircle' className='bucheader-svg mr-2 ml-2' />
        : null
      }
    </div>
  </div>
}

BUCHeader.defaultProps = {
  type: '',
  name: '',
  dateCreated: '',
  href: '',
  countries: [],
  merknader: [],
  comments: [],
  behandlingOnClick: () => {},
  t: arg => arg
}

export default BUCHeader
