import { Sed } from 'declarations/buc'
import { SedPropType } from 'declarations/buc.pt'
import Ui from 'eessi-pensjon-ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface SEDP5000Props {
  sed: Sed
}

const SEDP5000: React.FC<SEDP5000Props> = ({ sed }: SEDP5000Props): JSX.Element => {
  const { t } = useTranslation()
  const items = [
    { key: '01', land: 'Sverige', from: '1970-01-01', to: '1971-01-01', time: '1 år' },
    { key: '02', land: 'Norge', from: '1972-01-01', to: '1973-01-01', time: '1 år' },
    { key: '03', land: 'Sverige', from: '1974-01-01', to: '1975-01-01', time: '1 år' },
    { key: '04', land: 'Norge', from: '1976-01-01', to: '1977-01-01', time: '1 år' }
  ]

  return (
    <div className='a-buc-c-sedp5000'>
      <Ui.TableSorter
        className='w-varslerPanel__table w-100 mt-2'
        items={items}
        searchable
        selectable={false}
        sortable
        columns={[
          { id: 'land', label: t('ui:country'), type: 'string' },
          { id: 'from', label: t('ui:from'), type: 'string' },
          { id: 'to', label: t('ui:to'), type: 'string' },
          { id: 'time', label: t('ui:time'), type: 'string' }
        ]}
      />
    </div>
  )
}

SEDP5000.propTypes = {
  sed: SedPropType.isRequired
}

export default SEDP5000
