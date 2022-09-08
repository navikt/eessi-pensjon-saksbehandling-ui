import { BackFilled } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'
import { BUCMode } from 'declarations/app'
import {Buc, Sed, Seds} from 'declarations/buc'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, {useEffect, useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {getSedP4000} from "../../actions/buc";

export interface P4000Props {
  buc: Buc
  mainSed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P4000: React.FC<P4000Props> = ({
  buc,
  setMode
}: P4000Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [_seds, _setSeds] = useState<Seds | undefined>(undefined)

  const onBackClick = () => {
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

  /** check if we need to load SEDs from RINA, when buc changes; send the dispatches */
  useEffect(() => {
    // select which P5000 SEDs we want to see
    const seds = buc.seds?.filter((sed: Sed) => sed.type === 'P4000')
    _setSeds(seds)
    seds?.forEach(sed => dispatch(getSedP4000(buc.caseId!, sed)))
  }, [buc])

  console.log(_seds)
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
