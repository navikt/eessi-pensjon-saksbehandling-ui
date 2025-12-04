import {RinaUrl} from 'src/declarations/app.d'
import { State } from 'src/declarations/reducers'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from "react";
import { getRinaUrl} from "../../actions/buc";
import {loadAllEntries} from "../../actions/localStorage";
import {Box, Button, HStack, Select, TextField, VStack} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {getAktoerId, setContext, setStatusParam} from "../../actions/app";
import BUCIndexPageGjenny from "./BUCIndexPageGjenny";
import { SakTypeKey, SakTypeMap} from 'src/declarations/buc.d'
import {GJENNY} from "../../constants/constants";
import {clearPersonData, getPersonAvdodInfoFromAktoerId, getPersonInfo} from "../../actions/person";
import {PersonAvdods, PersonPDL} from "../../declarations/person";
import {validateFnrDnrNpid} from "../../utils/fnrValidator";

export interface BUCIndexSelector {
  rinaUrl: RinaUrl | undefined
  aktoerId: string | null | undefined
  avdodAktoerId: string | null | undefined
  avdodFnr: string | null | undefined
  sakType: string | null | undefined
  sakId: string | null | undefined
  personPdl: PersonPDL | undefined,
  personAvdods: PersonAvdods | undefined,
  gettingPersonInfo: boolean
  gettingPersonAvdodAktoerId: boolean
  gettingAktoerId: boolean
}

const mapState = (state: State): BUCIndexSelector => ({
  rinaUrl: state.buc.rinaUrl,
  aktoerId: state.app.params.aktoerId,
  avdodAktoerId: state.app.params.avdodAktoerId,
  avdodFnr: state.app.params.avdodFnr,
  sakType: state.app.params.sakType,
  sakId: state.app.params.sakId,
  personPdl: state.person.personPdl,
  personAvdods: state.person.personAvdods,
  gettingPersonInfo: state.loading.gettinPersonInfo,
  gettingPersonAvdodAktoerId: state.loading.gettingPersonAvdodAktoerId,
  gettingAktoerId: state.loading.gettingAktoerId
})

const BUCIndexGjenny = (): JSX.Element => {
  const {
    rinaUrl,
    aktoerId,
    avdodAktoerId,
    avdodFnr,
    sakType,
    sakId,
    personPdl,
    personAvdods,
    gettingAktoerId,
    gettingPersonInfo,
    gettingPersonAvdodAktoerId
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string | null | undefined>("")
  const [_fnrAvdod, setFnrAvdod] = useState<string | null | undefined>("")
  const [_sakType, setSakType] = useState<string | null | undefined>("")
  const [_sakId, setSakId] = useState<string | null | undefined>("")
  const [_validationFnr, _setValidationFnr] = useState<string | undefined>(undefined)
  const [_validationFnrAvdod, _setValidationFnrAvdod] = useState<string | undefined>(undefined)
  const [_validationSakType, _setValidationSakType] = useState<string | undefined>(undefined)
  const [_validationSakId, _setValidationSakId] = useState<string | undefined>(undefined)

  const hasValidationErrors = (_validationFnr || _validationFnrAvdod || _validationSakType || _validationSakId)
  const [hasPersons, setHasPersons] = useState<boolean>(false)

  useEffect(() => {
    dispatch(loadAllEntries())
    if (!rinaUrl) {
      dispatch(getRinaUrl())
    }
  },[])

  useEffect(() => {
    if(avdodFnr){
      dispatch(getAktoerId(avdodFnr, "avdodAktoerId"))
    }
  },[])

  const onFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    _setValidationFnr(undefined)
    setHasPersons(false)
    setFnr(e.target.value.trim())
  }

  const onFnrAvdodChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    _setValidationFnrAvdod(undefined)
    setHasPersons(false)
    setFnrAvdod(e.target.value.trim())
  }

  const onSakTypeChange = (e: any) => {
    _setValidationSakType(undefined)
    setSakType(e.target.value)
  }

  const onSakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    _setValidationSakId(undefined)
    setSakId(e.target.value.trim())
  }

  const getFnrValidation = (fnr: string | null | undefined, type: string) => {
    if (!fnr || !fnr.match(/^\d+$/)) {
      return {
        validation: "Ingen PID " + type,
        message: ""
      }
    }

    const validationResult = validateFnrDnrNpid(fnr)
    let validation = ""
    let message = ""

    if (validationResult.status !== 'valid') {
      validation = "Ugyldig PID " + type
    } else {
      if (validationResult.type === 'fnr') {
        message = t('label:valid-fnr')
      }
      if (validationResult.type === 'dnr') {
        message = t('label:valid-dnr')
      }
      if (validationResult.type === 'npid') {
        message = t('label:valid-npid')
      }
    }

    return {
      validation,
      message
    }
  }

  const onSubmit = () => {
    dispatch(clearPersonData())
    setHasPersons(false)
    dispatch(setStatusParam("gjenlevendeFnr", undefined))
    dispatch(setStatusParam("avdodFnr", undefined))
    dispatch(setStatusParam("sakType", undefined))
    dispatch(setStatusParam("sakId", undefined))
    dispatch(setContext(GJENNY))

    const fnrGjenlevendeValidationResult = getFnrValidation(_fnr, "Gjenlevende")
    const fnrAvdodValidationResult = getFnrValidation(_fnrAvdod, "Avdød")

    _setValidationFnr(fnrGjenlevendeValidationResult.validation)
    _setValidationFnrAvdod(fnrAvdodValidationResult.validation)

    const hasFnrValidationErrors = fnrGjenlevendeValidationResult.validation !== "" || fnrAvdodValidationResult.validation !== ""

    if (!_sakType || _sakType === "") {
      _setValidationSakType("Ingen saktype")
    }

    if (!_sakId || _sakId === "") {
      _setValidationSakId("Ingen sakID")
    }

    if(_fnr && _fnrAvdod && _fnr.match(/^\d+$/) && _fnrAvdod.match(/^\d+$/) && !hasFnrValidationErrors){
      dispatch(getAktoerId(_fnr, "aktoerId"))
      dispatch(getAktoerId(_fnrAvdod, "avdodAktoerId"))
      dispatch(setStatusParam("gjenlevendeFnr", _fnr))
      dispatch(setStatusParam("avdodFnr", _fnrAvdod))
      dispatch(setStatusParam("sakType", SakTypeMap[_sakType as SakTypeKey]))
      dispatch(setStatusParam("sakId", _sakId))
      dispatch(setContext(GJENNY))
    }
  }

  useEffect(() => {
    if(aktoerId && avdodAktoerId && !hasValidationErrors){
      if(!personPdl){
        dispatch(getPersonInfo(aktoerId))
      }
      if(!personAvdods){
        dispatch(getPersonAvdodInfoFromAktoerId(avdodAktoerId))
      }
    }
  },[aktoerId, avdodAktoerId])

  useEffect(() => {
    if(personPdl && personAvdods){
      if(personPdl.doedsfall){
        _setValidationFnr("Personen har en dødsdato")
      }
      if(personAvdods && personAvdods.length > 0 && !personAvdods[0].doedsDato){
        _setValidationFnrAvdod("Personen har ikke en dødsdato")
      }
      setHasPersons(true)
    }
  },[personPdl, personAvdods])

  if(aktoerId && avdodFnr && sakType && sakId){
    return <BUCIndexPageGjenny/>
  }

  if (!aktoerId || !avdodFnr || !sakType || !sakId || hasValidationErrors || !hasPersons) {
    return (
        <Box padding="8" borderWidth="1" borderRadius="medium" background="surface-subtle">
          <VStack align="center" justify="center">
            <HStack width="25%">
              <VStack gap="4" width="100%">
                <TextField
                  error={_validationFnr || false}
                  id='gjenny-fnr-input-id'
                  label="PID Gjenlevende"
                  onChange={onFnrChange}
                  value={_fnr || ''}
                />
                <TextField
                  error={_validationFnrAvdod || false}
                  id='gjenny-fnr-avdod-input-id'
                  label="PID Avdød"
                  onChange={onFnrAvdodChange}
                  value={_fnrAvdod || ''}
                />
                <Select label="Saktype" onChange={onSakTypeChange} error={_validationSakType || false}>
                  <option value="">Velg saktype</option>
                  <option value="OMSST">{SakTypeMap["OMSST"]}</option>
                  <option value="BARNEP">{SakTypeMap["BARNEP"]}</option>
                </Select>
                <TextField
                  error={_validationSakId || false}
                  id='gjenny-sakid-input-id'
                  label="Sak ID"
                  onChange={onSakIdChange}
                  value={_sakId || ''}
                />
                <Button
                  variant='primary'
                  onClick={onSubmit}
                  loading={gettingAktoerId || gettingPersonInfo || gettingPersonAvdodAktoerId}
                >
                  {t('ui:add')}
                </Button>
              </VStack>
            </HStack>
          </VStack>
        </Box>
    )
  }

  return(
    <BUCIndexPageGjenny/>
  )
}

export default BUCIndexGjenny
