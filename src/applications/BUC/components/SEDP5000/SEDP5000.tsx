import { SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import printJS from 'print-js'
import React, { useState } from 'react'
import PT from 'prop-types'
import { useTranslation } from 'react-i18next'
import * as labels from './SEDP5000.labels'

export interface SEDP5000Props {
  seds: Seds;
  sedContent: SedContentMap;
}

const SEDP5000: React.FC<SEDP5000Props> = ({ seds, sedContent }: SEDP5000Props): JSX.Element => {
  const { t } = useTranslation()
  const [activeSeds, setActiveSeds] = useState<{[k: string]: boolean}>(_.mapValues(_.keyBy(seds, 'id'), () => true))

  const convertRawP5000toRow = (sedContent: SedContent): Array<any> => {
    const res: Array<any> = []
    sedContent.pensjon.medlemskap.forEach((m: any) => {
      res.push({
        type: m.type,
        startdato: m.periode.fom,
        sluttdato: m.periode.tom,
        år: m.sum.aar,
        kvartal: m.sum.kvartal,
        måned: m.sum.maaneder,
        uke: '',
        dagerEnhet: m.sum.dager.nr + '/' + m.sum.dager.type,
        land: m.land,
        relevantForYtelse: m.relevans,
        ordning: m.ordning,
        yrke: m.yrke,
        informasjonOmBeregning: m.beregning
      })
    })
    return res
  }

  const getItems = () => {
    console.log(sedContent)
    let res: Array<any> = []
    if (activeSeds['60578cf8bf9f45a7819a39987c6c8fd4']) {
      res = res.concat(convertRawP5000toRow(sedContent['60578cf8bf9f45a7819a39987c6c8fd4']))
    }
    if (activeSeds['50578cf8bf9f45a7819a39987c6c8fd4']) {
      res = res.concat(convertRawP5000toRow(sedContent['50578cf8bf9f45a7819a39987c6c8fd4']))
    }
    return res
  }

  const printOut = () => {
    printJS({
      printable: 'printJS-form',
      type: 'html',
      header: 'P5000'
    })
  }

  const changeActiveSed = (sedId: string) => {
    setActiveSeds({
      ...activeSeds,
      [sedId]: !activeSeds[sedId]
    })
  }

  return (
    <div className='a-buc-c-sedp5000' style={{ minHeight: '500px' }}>
      <div className='d-flex flex-column'>
        {Object.keys(activeSeds).map(sedId => (
          <Ui.Nav.Checkbox
            key={sedId}
            id={'checkbox-' + sedId}
            className='mb-2'
            checked={activeSeds[sedId]}
            onChange={() => changeActiveSed(sedId)}
            label={t('buc:form-titleP5000') + ' - ' + sedId}
          />
        ))}
      </div>
      <div id='printJS-form'>
        <Ui.TableSorter
          className='w-varslerPanel__table w-100 mt-2'
          items={getItems()}
          searchable
          selectable={false}
          sortable
          labels={labels}
          columns={[
            { id: 'type', label: t('ui:type'), type: 'string' },
            { id: 'startdato', label: t('ui:startDate'), type: 'string' },
            { id: 'sluttdato', label: t('ui:endDate'), type: 'string' },
            { id: 'år', label: t('ui:year'), type: 'string' },
            { id: 'kvartal', label: t('ui:quarter'), type: 'string' },
            { id: 'måned', label: t('ui:month'), type: 'string' },
            { id: 'uke', label: t('ui:week'), type: 'string' },
            { id: 'dagerEnhet', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
            { id: 'land', label: t('ui:country'), type: 'string' },
            { id: 'relevantForYtelse', label: t('ui:relevantForPerformance'), type: 'string' },
            { id: 'ordning', label: t('ui:scheme'), type: 'string' },
            { id: 'yrke', label: t('ui:profession'), type: 'string' },
            { id: 'informasjonOmBeregning', label: t('ui:calculationInformation'), type: 'string' }
          ]}
        />
      </div>
      <div className='mt-4'>
        <Ui.Nav.Knapp onClick={printOut}>Utskift</Ui.Nav.Knapp>
      </div>
    </div>
  )
}

SEDP5000.propTypes = {
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000
