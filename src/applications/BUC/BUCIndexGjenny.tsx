import {RinaUrl} from 'declarations/app.d'
import { State } from 'declarations/reducers'
import {useDispatch, useSelector} from 'react-redux'
import {useEffect, useState} from "react";
import {getRinaUrl} from "../../actions/buc";
import {loadAllEntries} from "../../actions/localStorage";
import styled from "styled-components/macro";
import {Button, TextField} from "@navikt/ds-react";
import {VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {useTranslation} from "react-i18next";
import {getAktoerId} from "../../actions/app";

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
}

const mapState = (state: State): BUCIndexSelector => ({
  rinaUrl: state.buc.rinaUrl,
})

export const BUCIndexGjenny = (): JSX.Element => {
  const {
    rinaUrl
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [_fnr, setFnr] = useState<string | null | undefined>("")
  const [_fnrAvdod, setFnrAvdod] = useState<string | null | undefined>("")
  const [validationFnr, setValidationFnr] = useState<string | undefined>(undefined)
  const [validationFnrAvdod, setValidationFnrAvdod] = useState<string | undefined>(undefined)



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

  const onSubmit = () => {
    if (!_fnr || !_fnr.match(/^\d+$/)) {
      setValidationFnr("Ingen FNR")
    }
    if (!_fnrAvdod || !_fnrAvdod.match(/^\d+$/)) {
      setValidationFnrAvdod("Ingen FNR Avdød")
    }
    if(_fnr && _fnrAvdod && _fnr.match(/^\d+$/) && _fnrAvdod.match(/^\d+$/)){
      dispatch(getAktoerId(_fnr, "aktoerId"))
      dispatch(getAktoerId(_fnrAvdod, "avdodAktoerId"))
    }

  }

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

export default BUCIndexGjenny
