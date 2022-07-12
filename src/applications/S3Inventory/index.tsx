import { Accordion, Heading, Panel } from '@navikt/ds-react'
import { timeDiffLogger } from 'metrics/loggers'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import S3Inventory from './S3Inventory'

export const S3InventoryIndex = (): JSX.Element => {
  const [totalTimeWithMouseOver, setTotalTimeWithMouseOver] = useState<number>(0)
  const [mouseEnterDate, setMouseEnterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    return () => {
      timeDiffLogger('s3inventory.mouseover', totalTimeWithMouseOver)
    }
  }, [])

  const { t } = useTranslation()

  const onMouseEnter = () => setMouseEnterDate(new Date())

  const onMouseLeave = () => {
    if (mouseEnterDate) {
      setTotalTimeWithMouseOver(totalTimeWithMouseOver + (new Date().getTime() - mouseEnterDate?.getTime()))
    }
  }

  return (
    <Panel
      border style={{ padding: '0px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Accordion data-testid='w-s3inventory-id'>
        <Accordion.Item>
          <Accordion.Header>
            <Heading size='medium'>{t('ui:s3inventory-title')}</Heading>
          </Accordion.Header>
          <Accordion.Content>
            <S3Inventory />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Panel>
  )
}

export default S3InventoryIndex
