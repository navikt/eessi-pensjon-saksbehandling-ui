import React, {useEffect, useState} from "react";
import {Button, Heading, HStack, Loader, TextField, VStack} from "@navikt/ds-react";
import { useTranslation } from 'react-i18next'
import {
  cleanNewlyCreatedBuc,
  createBuc,
  createSed,
  getSedP8000,
  resetNewSed, resetPSED,
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

export interface P5000FraATPProps {
  onCancel: () => void
}

export interface P5000FraATPSelector {
  personPdl: PersonPDL | undefined
  newlyCreatedBuc: Buc | undefined
  newlyCreatedSed: Sed | undefined
  sakId?: string | null | undefined
  aktoerId?: string | null | undefined
  currentPSED: P8000SED
}

export const mapState = (state: State): P5000FraATPSelector => ({
  personPdl: state.person.personPdl,
  newlyCreatedBuc: state.buc.newlyCreatedBuc,
  newlyCreatedSed: state.buc.newlyCreatedSed,
  sakId: state.app.params.sakId,
  aktoerId: state.app.params.aktoerId,
  currentPSED: state.buc.PSED as P8000SED,
})


const P5000FraATP: React.FC<P5000FraATPProps> = ({
  onCancel
}: P5000FraATPProps): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { personPdl, newlyCreatedBuc, newlyCreatedSed, sakId, aktoerId, currentPSED }: P5000FraATPSelector = useSelector<State, P5000FraATPSelector>(mapState)
  const [_isCreatingBuc, setIsCreatingBuc] = useState<boolean>(false)
  const [_isCreatingSed, setIsCreatingSed] = useState<boolean>(false)
  const [_isGettingSed, setIsGettingSed] = useState<boolean>(false)
  const [_danskPIN, setDanskPIN] = useState<string | undefined>(undefined)

  const onCreateBucAndSed = () => {
    resetAll()
    setIsCreatingBuc(true)
    const payload: NewBucPayload = {
      buc: "P_BUC_05",
      person: personPdl!
    }
    dispatch(createBuc(payload))
  }

  const cancel = () => {
    resetAll()
    onCancel()
  }

  const resetAll = () => {
    dispatch(cleanNewlyCreatedBuc())
    dispatch(resetNewSed())
    dispatch(resetPSED())
  }

  useEffect(() => {
    if (newlyCreatedBuc) {
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
        euxCaseId: newlyCreatedBuc.caseId!
      }
      dispatch(createSed(newlyCreatedBuc, payload))
    }
  }, [newlyCreatedBuc])

  useEffect(() => {
    if (newlyCreatedSed) {
      setIsCreatingSed(false)
      setIsGettingSed(true)
      dispatch(getSedP8000(newlyCreatedBuc?.caseId!, newlyCreatedSed))
    }
  }, [newlyCreatedSed])

  useEffect(() => {
    if (currentPSED) {
      setIsGettingSed(false)

      const _person:  Person | undefined = _.get(currentPSED, `nav.bruker.person`)
      const danskePINs: Array<PIN> = _.filter(_person?.pin, p => p.land === 'DK')
      setDanskPIN(danskePINs && danskePINs.length > 0 ? danskePINs[0].identifikator : "")
    }
  }, [currentPSED])

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
          onClick={cancel}
        >{t('ui:cancel')}
        </Button>
      </HStack>
      <HorizontalLineSeparator/>
      <HStack gap="2" align="center">
        {_isCreatingBuc && <><Loader/> Oppretter P_BUC_05</>}
        {newlyCreatedBuc && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P_BUC_05 opprettet</>}
      </HStack>
      <HStack gap="2" align="center">
        {_isCreatingSed && <><Loader/> Oppretter P8000</>}
        {newlyCreatedSed && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P8000 opprettet</>}
      </HStack>
      <HStack gap="2" align="center">
        {_isGettingSed && <><Loader/> Henter P8000</>}
        {currentPSED && <><CheckmarkCircleFillIcon color="green" fontSize="1.5em"/> P8000 hentet</>}
      </HStack>
      {currentPSED &&
        <HStack gap="4" align="end">
          <TextField
            id='identifikator'
            label={t('buc:form-utenlandske-pin-pin')}
            onChange={(e) => setDanskPIN(e.target.value)}
            value={_danskPIN}
          />
          <Button
            variant='primary'
            onClick={()=>{}}
            loading={false}
          >
            Send SED
          </Button>
        </HStack>
      }
    </VStack>
  )
}

export default P5000FraATP
