import React, { useState } from 'react'

import { ToggleGruppe } from 'nav-frontend-toggle'
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel'

import BucHeader from '../../components/newFeatures/BucHeader'
import SedHeader from '../../components/newFeatures/SedHeader'
import SedLabel from '../../components/newFeatures/SedLabel'

const BUCLIST = [
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ']
  },
  {
    type: 'P_BUC_02',
    name: 'UførePensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['SE', 'DK', 'CZ'],
    merknader: ['foo', 'bar', 'baz']
  },
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
    comments: ['foo', 'bar', 'baz']
  },
  {
    type: 'P_BUC_01',
    name: 'AldersPensjon',
    dateCreated: 'dd.mm.åå',
    countries: ['ZW', 'KR', 'SE', 'DK', 'CZ'],
    merknader: ['foo', 'bar', 'baz'],
    comments: ['foo', 'bar', 'baz']
  }
]

const ANDRELIST = [
  {
    type: 'P_BUC_01',
    name: 'FIFOFA',
    dateCreated: 'dd.mm.åå',
    countries: ['RU', 'GB', 'CH']
  },
  {
    type: 'P_BUC_02',
    name: 'GRÅTASS',
    dateCreated: 'dd.mm.åå',
    countries: ['DE', 'TR', 'CA']
  }
]

let SEDS = [
  {
    name: 'P2000',
    status: 'sendt',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P3000SE',
    status: 'draft',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P4000',
    status: 'received',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  },
  {
    name: 'P5000',
    status: 'foo',
    date: 'dd.mm.åå',
    country: 'Sverige',
    institution: 'Försäkringskassan'
  }
]

const SedList = (props) => {
  const [tab, setTab] = useState('ONGOING')
  const { t } = props

  return <React.Fragment>
    <div className='mb-3'>
      <ToggleGruppe
        defaultToggles={[
          { children: t('ongoing'), pressed: true, onClick: () => setTab('ONGOING') },
          { children: t('other'), onClick: () => setTab('OTHER') }
        ]}
      />
    </div>
    {
      tab === 'ONGOING'
        ? BUCLIST.map((buc, index) => (
          <EkspanderbartpanelBase key={index} className='mb-3' ariaTittel='foo' heading={<BucHeader t={t} {...buc} />}>
            <SedHeader t={t} />
            {SEDS.map((sed, index) => (
              <SedLabel t={t} key={index} sed={sed} />
            ))}
          </EkspanderbartpanelBase>
        ))
        : null }
    {
      tab === 'OTHER'
        ? ANDRELIST.map((buc, index) => (
          <EkspanderbartpanelBase key={index} className='mb-3' ariaTittel='foo' heading={<BucHeader t={t} {...buc} />}>
            <SedHeader t={t} />
            {SEDS.map((sed, index) => (
              <SedLabel t={t} key={index} sed={sed} />
            ))}
          </EkspanderbartpanelBase>
        ))
        : null }
  </React.Fragment>
}

export default SedList
