import React, { JSX, useEffect } from "react";
import { Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuc, getSed, resetPSED } from "src/actions/buc";
import { resetEditingItems } from "src/actions/app";
import { resetValidation } from "src/actions/validation";
import { Buc, Sed } from "src/declarations/buc";
import { BUCMode } from "src/declarations/app";
import { P2200SED } from "src/declarations/p2200";
import { State } from "src/declarations/reducers";
import styles from "src/assets/css/common.module.css";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import useUnmount from "src/hooks/useUnmount";
import { createSelector } from "@reduxjs/toolkit";

export interface P2200Props {
  buc: Buc
  sed?: Sed
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P2200Selector {
  currentPSED: P2200SED
  gettingSed: boolean
}

const mapState = createSelector(
  (state: State) => state.buc.PSED as P2200SED,
  (state: State) => state.loading.gettingSed,
  (currentPSED, gettingSed): P2200Selector => ({ currentPSED, gettingSed })
)

const P2200: React.FC<P2200Props> = ({ buc, sed, setMode }: P2200Props): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { gettingSed }: P2200Selector = useSelector<State, P2200Selector>(mapState)

  useUnmount(() => {
    dispatch(resetPSED())
  })

  useEffect(() => {
    if (sed) {
      dispatch(resetEditingItems())
      dispatch(resetValidation("p2200"))
      dispatch(getSed(buc.caseId!, sed))
    }
  }, [sed])

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation("p2200"))
    dispatch(fetchBuc(buc.caseId!))
    setMode("bucedit", "back")
  }

  if (gettingSed) {
    return (
      <div className={styles.waitingPanel}>
        <WaitingPanel size="2xlarge" />
      </div>
    )
  }

  return (
    <VStack gap="space-16">
      <HStack>
        <Button
          variant="secondary"
          onClick={onBackClick}
          iconPosition="left"
          icon={<ChevronLeftIcon aria-hidden />}
        >
          {t("ui:back")}
        </Button>
      </HStack>
      <Heading level="1" size="medium">P2200</Heading>
    </VStack>
  )
}

export default P2200
