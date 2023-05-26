import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {Buc, Sed} from "../../declarations/buc";
import {BUCMode} from "../../declarations/app";
import {Button, Heading} from "@navikt/ds-react";
import {BackFilled} from "@navikt/ds-icons";
import {HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import {getSed, saveSed} from "../../actions/buc";
import {State} from "../../declarations/reducers";
import {P2000SED} from "../../declarations/p2000";
import { VerticalSeparatorDiv } from '@navikt/hoykontrast'
import Verge from "./Verge";

export interface P2000Selector {
  currentSed: P2000SED
  savingSed: boolean
}

const mapState = (state: State): P2000Selector => ({
  currentSed: state.buc.currentEditingSed as P2000SED,
  savingSed: state.loading.savingSed
})

export interface P2000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P2000: React.FC<P2000Props> = ({
  buc,
  sed,
  setMode
}: P2000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { currentSed, savingSed }: P2000Selector = useSelector<State, P2000Selector>(mapState)

  useEffect(() => {
    if(sed){
      dispatch(getSed(buc.caseId!, sed))
    }

  }, [sed])

  const onBackClick = () => {
    setMode('bucedit', 'back')
  }

  const onSaveSed = () => {
    dispatch(saveSed(buc.caseId!, sed!.id, sed!.type, currentSed))
  }

  return (
    <>
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
      <Heading size={"medium"}>P2000</Heading>
      <Verge sed={currentSed}/>
      <VerticalSeparatorDiv/>
      <Button
        variant='primary'
        onClick={onSaveSed}
        loading={savingSed}
      >
        Lagre
      </Button>
    </>
  )
}

export default P2000
