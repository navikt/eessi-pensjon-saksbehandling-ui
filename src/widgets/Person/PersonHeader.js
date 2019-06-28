import React from 'react'
import PT from 'prop-types'
import { Systemtittel, Undertekst } from 'nav-frontend-typografi'
import _ from 'lodash'
import { AlertStripe, NavFrontendSpinner } from 'components/ui/Nav'
import Flag from 'components/ui/Flag/Flag'
import Icons from 'components/ui/Icons'

function PersonHeader (props) {
  const { t, person, country, aktoerId, gettingPersonInfo } = props

  let age = '-'
  let fromDate; let toDate; let dateString = ''

  if (person) {
    if (person.foedselsdato) {
      const birthDate = new Date(Date.parse(person.foedselsdato.foedselsdato))
      age = new Date().getFullYear() - birthDate.getFullYear()
    }

    if (person.sivilstand.fomGyldighetsperiode) {
      fromDate = new Date(Date.parse(person.sivilstand.fomGyldighetsperiode)).toLocaleDateString()
      dateString = fromDate + ' - '
    }
    if (person.sivilstand.tomGyldighetsperiode) {
      toDate = new Date(Date.parse(person.sivilstand.tomGyldighetsperiode)).toLocaleDateString()
      dateString += toDate
    }
  }

  return <div className='d-flex w-100'>
    {!aktoerId ? <AlertStripe type='advarsel'>{t('buc:validation-noAktoerId')}</AlertStripe> : null }
    {gettingPersonInfo ? <div className='d-flex align-items-center'>
      <NavFrontendSpinner className='ml-3 mr-3' type='M' />
      <span className='pl-2'>{t('ui:loading')}</span>
    </div> : null}
    { !_.isEmpty(person) ? <div>
      <div className='d-flex align-items-center'>
        <Icons kind={person.kjoenn.kjoenn.value === 'K' ? 'nav-woman-icon' : 'nav-man-icon'} />
        <Systemtittel className='ml-2'>{person.personnavn.sammensattNavn} ({age}) - {person.aktoer.ident.ident}</Systemtittel>
      </div>
      <div className='d-flex align-items-center'>
        {country ? <Flag className='m-2' size='M' label={country.label} country={country.value} /> : null}
        <Undertekst className='ml-2'>{t('ui:adresse')}: {person.gjeldendePostadressetype.value}</Undertekst>
        <Undertekst className='ml-4'>{t('ui:marital-status')}: {person.sivilstand.sivilstand.value} {dateString ? '(' + dateString + ')' : ''}</Undertekst>
      </div>
    </div> : null}
  </div>
}

PersonHeader.propTypes = {
  t: PT.func.isRequired,
  person: PT.object,
  country: PT.object,
  aktoerId: PT.string,
  gettingPersonInfo: PT.bool
}

export default PersonHeader
