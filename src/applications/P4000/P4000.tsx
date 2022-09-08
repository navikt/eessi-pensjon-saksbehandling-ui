import { BackFilled } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'
import { BUCMode } from 'declarations/app'
import {Buc, Sed} from 'declarations/buc'
import { HorizontalSeparatorDiv, VerticalSeparatorDiv } from '@navikt/hoykontrast'
import React, {useEffect} from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {getSedP4000} from "../../actions/buc";
import {dateSorter} from "../BUC/components/BUCUtils/BUCUtils";

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
    // select which P4000 SEDs we want to see
    const seds = buc.seds?.filter((sed: Sed) => sed.type === 'P4000' && sed.status === 'received')
    const sortedSeds = seds?.sort(dateSorter)
    if(sortedSeds && sortedSeds.length > 0){
      dispatch(getSedP4000(buc.caseId!, sortedSeds[0]))
    }

  }, [buc])

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
