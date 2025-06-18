import React, {useEffect, useState} from "react";
import {Button, Heading, HStack, Loader, TextField, VStack} from "@navikt/ds-react";
import { useTranslation } from 'react-i18next'
import {
  createATPBuc,
  createATPSed,
  getSedP8000, resetATP,
  saveSed,
  sendSed,
  setCurrentBuc,
  updatePSED,
} from "src/actions/buc";
import {Buc, NewBucPayload, NewSedPayload, Sed} from "src/declarations/buc";
import {PersonPDL} from "src/declarations/person";
import {State} from "src/declarations/reducers";
import {useDispatch, useSelector} from "react-redux";
import {CheckmarkCircleFillIcon} from "@navikt/aksel-icons";
import {HorizontalLineSeparator} from "src/components/StyledComponents";
import {IS_Q} from "src/constants/environment";
import {P8000SED} from "src/declarations/p8000";
import {Person, PIN} from "src/declarations/sed";
import _ from "lodash";
import {BUCMode} from "src/declarations/app";

export interface P5000FraATPProps {
  onCancel: () => void
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface P5000FraATPSelector {
  personPdl: PersonPDL | undefined
  newlyCreatedATPBuc: Buc | undefined
  newlyCreatedATPSed: Sed | undefined
  sakId?: string | null | undefined
  aktoerId?: string | null | undefined
  currentPSED: P8000SED
  savingSed: boolean
  sendingSed: boolean
  PSEDSendResponse: any | null | undefined
  PSEDSavedResponse: any | null | undefined
}

export const mapState = (state: State): P5000FraATPSelector => ({
  personPdl: state.person.personPdl,
  newlyCreatedATPBuc: state.buc.newlyCreatedATPBuc,
  newlyCreatedATPSed: state.buc.newlyCreatedATPSed,
  sakId: state.app.params.sakId,
  aktoerId: state.app.params.aktoerId,
  currentPSED: state.buc.PSED as P8000SED,
  savingSed: state.loading.savingSed,
  sendingSed: state.loading.sendingSed,
  PSEDSendResponse: state.buc.PSEDSendResponse,
  PSEDSavedResponse: state.buc.PSEDSavedResponse
})


const P5000FraATP: React.FC<P5000FraATPProps> = ({
  onCancel, setMode
}: P5000FraATPProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { personPdl, newlyCreatedATPBuc, newlyCreatedATPSed, sakId, aktoerId, currentPSED, PSEDSavedResponse, savingSed, sendingSed, PSEDSendResponse }: P5000FraATPSelector = useSelector<State, P5000FraATPSelector>(mapState)
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(false)
  const [_isCreatingSed, setIsCreatingSed] = useState<boolean>(false)
  const [_isGettingSed, setIsGettingSed] = useState<boolean>(false)
  const [_danskPIN, setDanskPIN] = useState<string | undefined>(undefined)

  const targetPerson = `nav.bruker.person`
  const targetSendFolgendeSEDer = "pensjon.anmodning.seder[0].sendFolgendeSEDer"
  const targetBegrunnelse = "pensjon.anmodning.seder[0].begrunnelse"

  const onCreateBucAndSed = () => {
    resetAll()
    setIsCreatingBuc(true)
    const payload: NewBucPayload = {
      buc: "P_BUC_05",
      person: personPdl!
    }
    dispatch(createATPBuc(payload))
  }

  const onUpdateAndSend = () => {
    const _person:  Person | undefined = _.get(currentPSED, targetPerson)
    let filteredPINs: Array<PIN> = _.filter(_person?.pin, p => p.land !== 'DK')
    if(_danskPIN && _danskPIN !== ""){
      filteredPINs.push({
        land: "DK",
        identifikator: _danskPIN
      })
      dispatch(updatePSED(targetPerson + '.pin', filteredPINs))
    }
    dispatch(updatePSED(targetSendFolgendeSEDer, ["p5000"]))
    dispatch(updatePSED(targetBegrunnelse, "Vennligst send informasjon om ATP-perioder."))
  }

  const resetAndClose = () => {
    resetAll()
    onCancel()
  }

  const resetAll = () => {
    dispatch(resetATP())
  }

  useEffect(() => {
    if (newlyCreatedATPBuc) {
      setIsCreatingBuc(false)
      setIsCreatingSed(true)
      const payload: NewSedPayload = {
        sakId: sakId!,
        buc: "P_BUC_05",
        sed: "P8000",
        institutions: [
          IS_Q ?
            {
              country: "DK",
              institution: "NO:NAVAT05",
              name: "NAV ACCEPTANCE TEST 05",
              acronym: "NAVAT05"
            }
            :
            {
              country: "DK",
              institution: "DK:43405810",
              name: "The Labour Market Supplementary Pension Scheme",
              acronym: "ATP"
            }
        ],
        aktoerId: aktoerId!,
        euxCaseId: newlyCreatedATPBuc.caseId!
      }
      dispatch(createATPSed(newlyCreatedATPBuc, payload))
    }
  }, [newlyCreatedATPBuc])

  useEffect(() => {
    if (newlyCreatedATPSed) {
      setIsCreatingSed(false)
      setIsGettingSed(true)
      dispatch(getSedP8000(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed))
    }
  }, [newlyCreatedATPSed])

  useEffect(() => {
    if (currentPSED && newlyCreatedATPBuc && newlyCreatedATPSed) {
      setIsGettingSed(false)

      const _person:  Person | undefined = _.get(currentPSED, targetPerson)
      const begrunnelse = _.get(currentPSED, targetBegrunnelse)

      const danskePINs: Array<PIN> = _.filter(_person?.pin, p => p.land === 'DK')
      setDanskPIN(danskePINs && danskePINs.length > 0 ? danskePINs[0].identifikator : "")

      if(!PSEDSavedResponse && begrunnelse && begrunnelse!==""){
        dispatch(saveSed(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed!.id, "P8000", currentPSED))
      }
    }
  }, [currentPSED])

  useEffect(() => {
    if (PSEDSavedResponse && newlyCreatedATPBuc && newlyCreatedATPSed) {
      dispatch(sendSed(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed!.id))
    }
  }, [PSEDSavedResponse])

  useEffect(() => {
    if (PSEDSendResponse && newlyCreatedATPBuc && newlyCreatedATPSed) {
      gotoBuc(newlyCreatedATPBuc!)
    }
  }, [PSEDSendResponse])

  const gotoBuc = (buc: Buc): void => {
    resetAndClose()
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit' as BUCMode, 'forward')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return(
    <VStack gap="4">
      <Heading size='medium'>
        Bestill P5000 fra ATP
      </Heading>
      <HStack gap="4">
        <Button
          variant='primary'
          onClick={onCreateBucAndSed}
          loading={_isCreatingBuc || _isCreatingSed || _isGettingSed}
        >
          Opprett P_BUC_05 og P8000
        </Button>
        <Button
          variant='tertiary'
          onClick={resetAndClose}
        >{t('ui:cancel')}
        </Button>
      </HStack>
      <HorizontalLineSeparator/>
      <HStack gap="2" align="center">
        {_isCreatingBuc && <><Loader/> Oppretter P_BUC_05</>}
        {newlyCreatedATPBuc && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P_BUC_05 opprettet</>}
      </HStack>
      <HStack gap="2" align="center">
        {_isCreatingSed && <><Loader/> Oppretter P8000</>}
        {newlyCreatedATPSed && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P8000 opprettet</>}
      </HStack>
      <HStack gap="2" align="center">
        {_isGettingSed && <><Loader/> Henter P8000</>}
        {currentPSED && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P8000 hentet</>}
      </HStack>
      {currentPSED &&
        <HStack gap="4" align="end">
          <TextField
            id='identifikator'
            label={t('buc:form-utenlandske-pin-dansk-pin')}
            onChange={(e) => setDanskPIN(e.target.value)}
            value={_danskPIN}
          />
          <Button
            variant='primary'
            onClick={onUpdateAndSend}
            loading={savingSed || sendingSed}
          >
            Send SED
          </Button>
        </HStack>
      }
    </VStack>
  )
}

export default P5000FraATP
