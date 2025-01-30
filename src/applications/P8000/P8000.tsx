import React, {useEffect} from "react";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode, Validation} from "src/declarations/app";
import {useDispatch, useSelector} from "react-redux";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {fetchBuc, getSed} from "src/actions/buc";
import {WaitingPanelDiv} from "src/components/StyledComponents";
import WaitingPanel from "src/components/WaitingPanel/WaitingPanel";
import {P8000SED} from "src/declarations/p8000";
import {State} from "src/declarations/reducers";
import {Box, Button, Heading, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";

export interface P8000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

export interface P8000Selector {
  PSEDChanged: boolean
  currentPSED: P8000SED
  savingSed: boolean
  sendingSed: boolean
  PSEDSendResponse: any | null | undefined
  PSEDSavedResponse: any | null | undefined
  gettingSed: boolean
  validation: Validation
  editingItems: any
  aktoerId: string
}

const mapState = (state: State): P8000Selector => ({
  PSEDChanged: state.buc.PSEDChanged,
  currentPSED: state.buc.PSED as P8000SED,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  PSEDSendResponse: state.buc.PSEDSendResponse,
  PSEDSavedResponse: state.buc.PSEDSavedResponse,
  gettingSed: state.loading.gettingSed,
  validation: state.validation.status,
  editingItems: state.app.editingItems,
  aktoerId: state.app.params.aktoerId
})


const P8000: React.FC<P8000Props> = ({
 buc,
 sed,
 setMode
}: P8000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const { gettingSed }: P8000Selector = useSelector<State, P8000Selector>(mapState)
  const namespace = "p8000"

  useEffect(() => {
    if(sed){
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

  if(gettingSed){
    return(
      <WaitingPanelDiv>
        <WaitingPanel/>
      </WaitingPanelDiv>
    )
  }

  return (
    <>
      <VStack gap="4">
        <div style={{ display: 'inline-block' }}>
          <Button
            variant='secondary'
            onClick={onBackClick}
            iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
          >
            <span>
              {t('ui:back')}
            </span>
          </Button>
        </div>
        <Box
          as="header"
          borderWidth="1"
          borderRadius="medium"
          borderColor="border-default"
          background="bg-default"
          padding="4"
        >
          <Heading level="1" size="medium">P8000</Heading>
        </Box>
      </VStack>
    </>
  )
}

export default P8000
