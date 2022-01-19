import { BackFilled } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'
import { resetSentP5000info } from 'actions/p5000'
import { P5000Props } from 'applications/P5000/P5000'
import { BUCMode } from 'declarations/app'
import { Buc, Sed } from 'declarations/buc'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from 'nav-hoykontrast'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

export interface P4000Props {
  buc: Buc
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P4000: React.FC<P5000Props> = ({
  setMode
}: P4000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const onBackClick = () => {
    dispatch(resetSentP5000info())
    setMode('bucedit', 'back')
  }

  const renderBackLink = () => (
    <div style={{ display: 'inline-block' }}>
      <Button
        variant='secondary'
        onClick={onBackClick}
      >
        <BackFilled />
        <HorizontalSeparatorDiv size='0.25' />
        <span>
          {t('ui:back')}
        </span>
      </Button>
    </div>
  )

  return (
    <div>
      <VerticalSeparatorDiv size='3' />
      {renderBackLink()}
      <VerticalSeparatorDiv size='2' />
      P4000
    </div>
  )
}

export default P4000
