import React from 'react'
import PT from 'prop-types'

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

  return <div
    className='a-buc-c-bucheader'
    id={'a-buc-c-bucheader__' + buc.type}>
    <div className='col-4 a-buc-c-bucheader__label'>
      <Nav.Ingress data-qa='BucHeader-type-name'>{buc.type + ' - ' + buc.name}</Nav.Ingress>
      <Nav.Normaltekst data-qa='BucHeader-dateCreated'>{t('ui:created')}: {buc.dateCreated}</Nav.Normaltekst>
    </div>
    <div className='col-4 a-buc-c-bucheader__flags'>
      <FlagList data-qa='BucHeader-FlagList' locale={locale} countries={buc.countries} overflowLimit={5} />
    </div>
    <div className='col-2 a-buc-c-bucheader__actions'>
      <Nav.LenkepanelBase data-qa='BucHeader-LinkButton' onClick={(e) => requestHandleBUC(buc, e)} className='a-buc-c-bucheader__button smallerButton knapp' href={buc.href} border>{t('ui:processing')}</Nav.LenkepanelBase>
    </div>
    <div className='col-2 a-buc-c-bucheader__tags'>
      {buc.merknader && buc.merknader.length > 0
        ? <ProblemCircle data-qa='BucHeader-ProblemCircle' className='a-buc-c-bucheader__tag' />
        : null
      }
    </div>
  </div>
}

BUCHeader.propTypes = {
  t: PT.func.isRequired,
  buc: PT.object.isRequired,
  locale: PT.string.isRequired,
  onBUCEdit: PT.func
}

export default BUCHeader
