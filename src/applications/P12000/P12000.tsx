import React, {JSX, useEffect} from "react";
import {Button, HGrid, HStack, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {fetchBuc, getSed, resetPSED} from "src/actions/buc";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode} from "src/declarations/app";
import {P12000SED} from "src/declarations/p12000";
import {State} from "src/declarations/reducers";
import styles from "src/assets/css/common.module.css";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import useUnmount from "src/hooks/useUnmount";
import SEDDetails from "src/components/SEDDetails/SEDDetails";
import SakInfo from "src/components/SakInfo/SakInfo";

export interface P12000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P12000Selector {
  currentPSED: P12000SED
  gettingSed: boolean
}

const mapState = (state: State): P12000Selector => ({
  currentPSED: state.buc.PSED as P12000SED,
  gettingSed: state.loading.gettingSed
})

const P12000: React.FC<P12000Props> = ({buc, sed, setMode}: P12000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {currentPSED, gettingSed}: P12000Selector = useSelector<State, P12000Selector>(mapState)
  const namespace = "p12000"

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if (sed) {
      dispatch(resetEditingItems())
      dispatch(resetValidation(namespace))
      dispatch(getSed(buc.caseId!, sed))
    }
  }, [sed])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  if (gettingSed) {
    return (
      <div className={styles.waitingPanel}>
        <WaitingPanel size="2xlarge"/>
      </div>
    )
  }

  return (
    <VStack gap="space-16">
      <HStack>
        <Button
          variant='secondary'
          onClick={onBackClick}
          iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
        >
          {t('ui:back')}
        </Button>
      </HStack>
      <HGrid columns="1fr 400px" gap="space-16" align="start">
        <VStack gap="space-16">
          <SakInfo PSED={currentPSED} title="P12000"/>
        </VStack>
        {sed && (
          <SEDDetails sed={sed}/>
        )}
      </HGrid>
    </VStack>
  )
}

export default P12000
