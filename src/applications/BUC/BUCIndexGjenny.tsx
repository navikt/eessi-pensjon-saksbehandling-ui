import {RinaUrl} from 'declarations/app.d'
import { State } from 'declarations/reducers'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from "react";
import {getRinaUrl} from "../../actions/buc";
import {loadAllEntries} from "../../actions/localStorage";
import styled from "styled-components/macro";
import {Button, Select, TextField} from "@navikt/ds-react";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {useTranslation} from "react-i18next";
import {getAktoerId, setStatusParam} from "../../actions/app";
import BUCIndexPageGjenny from "./BUCIndexPageGjenny";
import { SakTypeKey, SakTypeMap } from 'declarations/buc.d'

export const FrontpageDiv = styled.div`
  display: flex;
  border-color: var(--navds-semantic-color-border);
  border-style: solid;
  border-width: 1px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: var(--navds-semantic-color-component-background-alternate);
`

const FrontpageForm = styled.div`
  display: flex;
  flex-direction: column;
`

export interface BUCIndexSelector {
  rinaUrl: RinaUrl | undefined
  aktoerId: string | null | undefined
  avdodAktoerId: string | null | undefined
  sakType: string | null | undefined
  sakId: string | null | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  rinaUrl: state.buc.rinaUrl,
  aktoerId: state.app.params.aktoerId,
  avdodAktoerId: state.app.params.avdodAktoerId,
  sakType: state.app.params.sakType,
  sakId: state.app.params.sakId
})

export const BUCIndexGjenny = (): JSX.Element => {
  const {
    rinaUrl,
    aktoerId,
    avdodAktoerId,
    sakType,
    sakId
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string | null | undefined>("")
  const [_fnrAvdod, setFnrAvdod] = useState<string | null | undefined>("")
  const [_sakType, setSakType] = useState<string | null | undefined>("")
  const [_sakId, setSakId] = useState<string | null | undefined>("")
  const [validationFnr, setValidationFnr] = useState<string | undefined>(undefined)
  const [validationFnrAvdod, setValidationFnrAvdod] = useState<string | undefined>(undefined)
  const [validationSakType, setValidationSakType] = useState<string | undefined>(undefined)
  const [validationSakId, setValidationSakId] = useState<string | undefined>(undefined)



  useEffect(() => {
    dispatch(loadAllEntries())
    if (!rinaUrl) {
      dispatch(getRinaUrl())
    }
  },[])

  const onFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidationFnr(undefined)
    setFnr(e.target.value.trim())
  }

  const onFnrAvdodChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidationFnrAvdod(undefined)
    setFnrAvdod(e.target.value.trim())
  }

  const onSakTypeChange = (e: any) => {
    setValidationSakType(undefined)
    setSakType(e.target.value)
  }

  const onSakIdChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidationSakId(undefined)
    setSakId(e.target.value.trim())
  }

  const onSubmit = () => {
    if (!_fnr || !_fnr.match(/^\d+$/)) {
      setValidationFnr("Ingen FNR")
    }
    if (!_fnrAvdod || !_fnrAvdod.match(/^\d+$/)) {
      setValidationFnrAvdod("Ingen FNR Avdød")
    }

    if (!_sakType || _sakType === "") {
      setValidationSakType("Ingen saktype")
    }

    if (!_sakId || _sakId === "") {
      setValidationSakId("Ingen sakID")
    }

    if(_fnr && _fnrAvdod && _fnr.match(/^\d+$/) && _fnrAvdod.match(/^\d+$/)){
      dispatch(getAktoerId(_fnr, "aktoerId"))
      dispatch(getAktoerId(_fnrAvdod, "avdodAktoerId"))
      dispatch(setStatusParam("gjenlevendeFnr", _fnr))
      dispatch(setStatusParam("avdodFnr", _fnrAvdod))
      dispatch(setStatusParam("sakType", SakTypeMap[_sakType as SakTypeKey]))
      dispatch(setStatusParam("sakId", _sakId))
    }

  }

  if (!aktoerId || !avdodAktoerId || !sakType || !sakId) {
    return (
      <FrontpageDiv>
        <FrontpageForm>
          <TextField
            error={validationFnr || false}
            id='gjenny-fnr-input-id'
            label="FNR"
            onChange={onFnrChange}
            value={_fnr || ''}
          />
          <VerticalSeparatorDiv/>
          <TextField
            error={validationFnrAvdod || false}
            id='gjenny-fnr-avdod-input-id'
            label="FNR Avdød"
            onChange={onFnrAvdodChange}
            value={_fnrAvdod || ''}
          />
          <VerticalSeparatorDiv/>
          <Select label="Saktype" onChange={onSakTypeChange} error={validationSakType || false}>
            <option value="">Velg saktype</option>
            <option value="OMSST">{SakTypeMap["OMSST"]}</option>
            <option value="BARNEP">{SakTypeMap["BARNEP"]}</option>
          </Select>
          <VerticalSeparatorDiv/>
          <TextField
            error={validationSakId || false}
            id='gjenny-sakid-input-id'
            label="Sak ID"
            onChange={onSakIdChange}
            value={_sakId || ''}
          />
          <VerticalSeparatorDiv/>
          <Button
            variant='primary'
            onClick={onSubmit}
          >
            {t('ui:add')}
          </Button>
        </FrontpageForm>
      </FrontpageDiv>
    )
  }

  return(
    <BUCIndexPageGjenny/>
  )
}

export default BUCIndexGjenny
