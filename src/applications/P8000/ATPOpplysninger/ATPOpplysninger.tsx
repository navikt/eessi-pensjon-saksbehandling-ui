import React, {useEffect, useState} from "react";
import {Alert, Box, Button, Heading, HStack, Loader, Textarea, TextField, VStack} from "@navikt/ds-react";
import { useTranslation } from 'react-i18next'
import {
  createATPBuc,
  createATPSed, fetchBuc,
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
import {CheckmarkCircleFillIcon, MenuElipsisHorizontalCircleIcon, XMarkOctagonFillIcon} from "@navikt/aksel-icons";
import {HorizontalLineSeparator} from "src/components/StyledComponents";
import {IS_Q} from "src/constants/environment";
import {P8000SED} from "src/declarations/p8000";
import {Person, PIN} from "src/declarations/sed";
import _, {cloneDeep} from "lodash";
import {BUCMode} from "src/declarations/app";

export interface ATPOpplysningerProps {
  onCancel: () => void
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

interface ATPStepProps {
  action: boolean
  response: any
  actionInitial: string
  actionActive: string
  actionSuccess: string
  actionFailure: string
}

export interface ATPOpplysningerSelector {
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

export const mapState = (state: State): ATPOpplysningerSelector => ({
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


const ATPOpplysninger: React.FC<ATPOpplysningerProps> = ({
  onCancel, setMode
}: ATPOpplysningerProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { personPdl, newlyCreatedATPBuc, newlyCreatedATPSed, sakId, aktoerId, currentPSED, PSEDSavedResponse, savingSed, sendingSed, PSEDSendResponse }: ATPOpplysningerSelector = useSelector<State, ATPOpplysningerSelector>(mapState)
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(false)
  const [_isCreatingSed, setIsCreatingSed] = useState<boolean>(false)
  const [_isGettingSed, setIsGettingSed] = useState<boolean>(false)
  const [_isSavingSed, setIsSavingSed] = useState<boolean>(false)
  const [_isSendingSed, setIsSendingSed] = useState<boolean>(false)
  const [_ytterligereInformasjon, setYtterligereInformasjon] = useState<string | undefined>(t('p8000:atp-fritekst-default-text'))
  const [_danskPIN, setDanskPIN] = useState<string | undefined>(undefined)

  const targetPerson = `nav.bruker.person`
  const targetBegrunnelse = "pensjon.ytterligeinformasjon"
  const targetOptionsATP = "options.ATP"

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
    dispatch(updatePSED(targetOptionsATP, true))
    const _person:  Person | undefined = _.get(currentPSED, targetPerson)
    let filteredPINs: Array<PIN> = _.filter(_person?.pin, p => p.land !== 'DK')
    if(_danskPIN && _danskPIN !== ""){
      filteredPINs.push({
        land: "DK",
        identifikator: _danskPIN
      })
      dispatch(updatePSED(targetPerson + '.pin', filteredPINs))
    }
    dispatch(updatePSED(targetBegrunnelse, _ytterligereInformasjon))
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
    } else if (newlyCreatedATPBuc === null) {
      setIsCreatingBuc(false)
    }
  }, [newlyCreatedATPBuc])

  useEffect(() => {
    if (newlyCreatedATPSed) {
      setIsCreatingSed(false)
      setIsGettingSed(true)
      dispatch(getSedP8000(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed))
    } else if (newlyCreatedATPSed === null) {
      setIsCreatingSed(false)
    }
  }, [newlyCreatedATPSed])

  useEffect(() => {
    if (currentPSED && newlyCreatedATPBuc && newlyCreatedATPSed) {
      setIsGettingSed(false)

      const _person:  Person | undefined = _.get(currentPSED, targetPerson)

      const begrunnelse = _.get(currentPSED, targetBegrunnelse)
      setYtterligereInformasjon(begrunnelse && begrunnelse!=="" ? begrunnelse : t('p8000:atp-fritekst-default-text'))

      const danskePINs: Array<PIN> = _.filter(_person?.pin, p => p.land === 'DK')
      setDanskPIN(danskePINs && danskePINs.length > 0 ? danskePINs[0].identifikator : "")

      if(!PSEDSavedResponse && begrunnelse && begrunnelse!==""){
        setIsSavingSed(true)
        let PSEDToSave: any = cloneDeep(currentPSED)
        if(PSEDToSave.options){
          const encodeOptionsString = encodeURI(JSON.stringify(currentPSED.options))
          PSEDToSave = {
            ...PSEDToSave,
            options: encodeOptionsString
          }
        }

        dispatch(saveSed(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed!.id, "P8000", PSEDToSave))
      }
    } else if (currentPSED === null) {
      setIsGettingSed(false)
    }
  }, [currentPSED])

  useEffect(() => {
    if (PSEDSavedResponse && newlyCreatedATPBuc && newlyCreatedATPSed) {
      setIsSavingSed(false)
      setIsSendingSed(true)
      dispatch(sendSed(newlyCreatedATPBuc!.caseId!, newlyCreatedATPSed!.id))
    } else if (PSEDSavedResponse === null) {
      setIsSavingSed(false)
    }
  }, [PSEDSavedResponse])

  useEffect(() => {
    if (PSEDSendResponse && newlyCreatedATPBuc && newlyCreatedATPSed) {
      setIsSendingSed(false)
      gotoBuc(newlyCreatedATPBuc!)
    } else if (PSEDSendResponse === null) {
      setIsSendingSed(false)
    }
  }, [PSEDSendResponse])

/*  useEffect(() => {
    dispatch(updatePSED(`pensjon.ytterligeinformasjon`, "\n" + _ytterligereInformasjon))
  }, [_ytterligereInformasjon])*/

  const gotoBuc = (buc: Buc): void => {
    dispatch(fetchBuc(buc.caseId!))
    resetAndClose()
    dispatch(setCurrentBuc(buc.caseId!))
    setMode('bucedit' as BUCMode, 'forward')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  const ATPStep: React.FC<ATPStepProps> =  ({
    action, response, actionInitial, actionActive, actionSuccess, actionFailure
  }: ATPStepProps): JSX.Element => {
    return (
      <HStack paddingInline="1" gap="2" align="center">
        {!action && response === undefined && <><MenuElipsisHorizontalCircleIcon color="grey" fontSize="1.2em"/> {actionInitial}</>}
        {action && <><Loader fontSize="1.2"/> {actionActive}</>}
        {response && <><CheckmarkCircleFillIcon color="green" fontSize="1.2em"/> {actionSuccess}</>}
        {response === null && <><XMarkOctagonFillIcon color="var(--a-icon-danger)" fontSize="1.2em"/> {actionFailure}</>}
      </HStack>
    )
  }

  return(
    <VStack gap="4">
      <Heading size='medium'>
        {t('p8000:atp-label-bestill-atp-opplysninger')}
      </Heading>
      <HStack gap="4">
        <Button
          variant='primary'
          onClick={onCreateBucAndSed}
          loading={_isCreatingBuc || _isCreatingSed || _isGettingSed}
        >
          {t('p8000:atp-label-bestill')}
        </Button>
        <Button
          variant='tertiary'
          onClick={resetAndClose}
        >{t('ui:cancel')}
        </Button>
      </HStack>
      <HorizontalLineSeparator/>
      <ATPStep
        action={_isCreatingBuc}
        response={newlyCreatedATPBuc}
        actionInitial={t('p8000:atp-opprette-buc-or-sed', {BUC_SED: "P_BUC_05"})}
        actionActive={t('p8000:atp-oppretter-buc-or-sed', {BUC_SED: "P_BUC_05"})}
        actionSuccess={t('p8000:atp-opprettet-buc-or-sed', {BUC_SED: "P_BUC_05"})}
        actionFailure={t('p8000:atp-opprettelse-feilet-buc-or-sed', {BUC_SED: "P_BUC_05"})}
      />
      <ATPStep
        action={_isCreatingSed}
        response={newlyCreatedATPSed}
        actionInitial={t('p8000:atp-opprette-buc-or-sed', {BUC_SED: "P8000"})}
        actionActive={t('p8000:atp-oppretter-buc-or-sed', {BUC_SED: "P8000"})}
        actionSuccess={t('p8000:atp-opprettet-buc-or-sed', {BUC_SED: "P8000"})}
        actionFailure={t('p8000:atp-opprettelse-feilet-buc-or-sed', {BUC_SED: "P8000"})}
      />
      <ATPStep
        action={_isGettingSed}
        response={currentPSED}
        actionInitial={t('p8000:atp-hente-buc-or-sed', {BUC_SED: "P8000"})}
        actionActive={t('p8000:atp-henter-buc-or-sed', {BUC_SED: "P8000"})}
        actionSuccess={t('p8000:atp-hentet-buc-or-sed', {BUC_SED: "P8000"})}
        actionFailure={t('p8000:atp-henting-feilet-buc-or-sed', {BUC_SED: "P8000"})}
      />
      <ATPStep
        action={_isSavingSed}
        response={PSEDSavedResponse}
        actionInitial={t('p8000:atp-lagre-buc-or-sed', {BUC_SED: "P8000"})}
        actionActive={t('p8000:atp-lagrer-buc-or-sed', {BUC_SED: "P8000"})}
        actionSuccess={t('p8000:atp-lagret-buc-or-sed', {BUC_SED: "P8000"})}
        actionFailure={t('p8000:atp-lagring-feilet-buc-or-sed', {BUC_SED: "P8000"})}
      />
      <ATPStep
        action={_isSendingSed}
        response={PSEDSendResponse}
        actionInitial={t('p8000:atp-sende-buc-or-sed', {BUC_SED: "P8000"})}
        actionActive={t('p8000:atp-sender-buc-or-sed', {BUC_SED: "P8000"})}
        actionSuccess={t('p8000:atp-sendt-buc-or-sed', {BUC_SED: "P8000"})}
        actionFailure={t('p8000:atp-sending-feilet-buc-or-sed', {BUC_SED: "P8000"})}
      />
      {currentPSED &&
        <VStack>
          <Box
            paddingBlock="0 4"
          >
            <Textarea
              label={t('p8000:atp-label-fritekst')}
              value={_ytterligereInformasjon}
              onChange={(e) => setYtterligereInformasjon(e.target.value)}
            />
          </Box>
          <HStack gap="4" align="end">
            <TextField
              id='identifikator'
              label={t('buc:form-utenlandske-pin-dansk-pin')}
              onChange={(e) => setDanskPIN(e.target.value)}
              value={_danskPIN}
            />
          </HStack>
          { !_ytterligereInformasjon &&
            <Box
              paddingBlock="8 2"
            >
              <Alert variant="warning" size="small">
                {t('p8000:atp-warning-missing-fritekst')}
              </Alert>
            </Box>
          }
          <HStack
            paddingBlock="8 0"
            gap="4"
            align="end"
          >
            <Button
              variant='primary'
              onClick={onUpdateAndSend}
              loading={savingSed || sendingSed}
            >
              {t('p8000:atp-label-lagre-og-send-sed')}
            </Button>
          </HStack>
        </VStack>
      }
    </VStack>
  )
}

export default ATPOpplysninger
