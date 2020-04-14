import { Participant, SedContent, SedContentMap, Seds } from 'declarations/buc'
import { SedsPropType } from 'declarations/buc.pt'
import { AllowedLocaleString } from 'declarations/types'
import Ui from 'eessi-pensjon-ui'
import _ from 'lodash'
import moment from 'moment'
import printJS from 'print-js'
import PT from 'prop-types'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as labels from './SEDP5000.labels'

export interface SEDP5000Props {
  locale: AllowedLocaleString;
  seds: Seds;
  sedContent: SedContentMap;
}

type ActiveSeds = {[k: string]: boolean}

interface SedSender {
  country: string;
  countryLabel: string;
  institution: string;
}

const SEDP5000: React.FC<SEDP5000Props> = ({ locale, seds, sedContent }: SEDP5000Props): JSX.Element => {
  const { t } = useTranslation()
  const [activeSeds, setActiveSeds] = useState<ActiveSeds>(_.mapValues(_.keyBy(seds, 'id'), () => true))

  const convertRawP5000toRow = (sedId: string, sedContent: SedContent): Array<any> => {
    const res: Array<any> = []
    const sender = getSedSender(sedId)
    sedContent.pensjon.medlemskap.forEach((m: any) => {
      res.push({
        land: sender!.countryLabel || '-',
        type: m.type || '-',
        startdato: m.periode?.fom ? moment(m.periode?.fom, 'YYYY-MM-DD').toDate() : '-',
        sluttdato: m.periode?.tom ? moment(m.periode?.tom, 'YYYY-MM-DD').toDate() : '-',
        år: m.sum?.aar || '-',
        kvartal: m.sum?.kvartal || '-',
        måned: m.sum?.maaneder || '-',
        uker: m.sum?.uker || '-',
        dagerEnhet: (m.sum?.dager?.nr || '-') + '/' + (m.sum?.dager?.type || '-'),
        relevantForYtelse: m.relevans || '-',
        ordning: m.ordning || '-',
        informasjonOmBeregning: m.beregning || '-'
      })
    })
    return res
  }

  const getSedSender = (sedId: string): SedSender | undefined => {
    const sed = _.find(seds, { id: sedId })
    if (!sed) {
      return undefined
    }
    const sender: Participant | undefined = sed.participants.find((participant: Participant) => participant.role === 'Sender')
    if (sender) {
      return {
        countryLabel: Ui.CountryData.getCountryInstance(locale).findByValue(sender.organisation.countryCode).label,
        country: sender.organisation.countryCode,
        institution: sender.organisation.name
      }
    }
    return undefined
  }

  const getItems = () => {
    let res: Array<any> = []
    Object.keys(activeSeds).forEach((key: string) => {
      if (activeSeds[key]) {
        res = res.concat(convertRawP5000toRow(key, sedContent[key]))
      }
    })
    return res
  }

  const printOut = () => {
    printJS({
      printable: 'printJS-form',
      type: 'html',
      style: '@page { size: A4 landscape; }',
      header: 'P5000'
    })
  }

  const changeActiveSed = (sedId: string) => {
    const newActiveSeds = _.cloneDeep(activeSeds)
    newActiveSeds[sedId] = !activeSeds[sedId]
    setActiveSeds(newActiveSeds)
  }

  return (
    <div className='a-buc-c-sedp5000' style={{ minHeight: '500px' }}>
      <div className='d-flex flex-column'>
        {Object.keys(activeSeds).map(sedId => {
          const sender: SedSender | undefined = getSedSender(sedId)
          return (
            <Ui.Nav.Checkbox
              key={sedId}
              id={'checkbox-' + sedId}
              className='mb-2'
              checked={activeSeds[sedId]}
              onChange={() => changeActiveSed(sedId)}
              label={(
                <div className='d-flex align-items-end'>
                  <span>{t('buc:form-titleP5000')}</span>
                  <span className='ml-1 mr-1'>-</span>
                  {sender ? (
                    <div className='d-flex align-items-center'>
                      <Ui.Flag type='circle' className='ml-1 mr-1' size='S' country={sender?.country} label={sender?.countryLabel} />
                      <span>{sender?.countryLabel}</span>
                      <span className='ml-1 mr-1'>-</span>
                      <span>{sender?.institution}</span>
                    </div>
                  ) : sedId}
                </div>
              )}
            />
          )
        })}
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
            { id: 'land', label: t('ui:country'), type: 'string' },
            { id: 'type', label: t('ui:type'), type: 'string' },
            {
              id: 'startdato',
              label: t('ui:startDate'),
              type: 'date',
              renderCell: (item: any, value: any) => (
                <Ui.Nav.Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Ui.Nav.Normaltekst>
              )
            },
            {
              id: 'sluttdato',
              label: t('ui:endDate'),
              type: 'date',
              renderCell: (item: any, value: any) => (
                <Ui.Nav.Normaltekst>{_.isDate(value) ? moment(value).format('DD.MM.YYYY') : value}</Ui.Nav.Normaltekst>
              )
            },
            { id: 'år', label: t('ui:year'), type: 'string' },
            { id: 'kvartal', label: t('ui:quarter'), type: 'string' },
            { id: 'måned', label: t('ui:month'), type: 'string' },
            { id: 'uker', label: t('ui:week'), type: 'string' },
            { id: 'dagerEnhet', label: t('ui:days') + '/' + t('ui:unit'), type: 'string' },
            { id: 'relevantForYtelse', label: t('ui:relevantForPerformance'), type: 'string' },
            { id: 'ordning', label: t('ui:scheme'), type: 'string' },
            { id: 'informasjonOmBeregning', label: t('ui:calculationInformation'), type: 'string' }
          ]}
        />
      </div>
      <div className='mt-4'>
        <Ui.Nav.Knapp onClick={printOut}>
          {t('ui:print')}
        </Ui.Nav.Knapp>
      </div>
    </div>
  )
}

SEDP5000.propTypes = {
  seds: SedsPropType.isRequired,
  sedContent: PT.any.isRequired
}

export default SEDP5000
