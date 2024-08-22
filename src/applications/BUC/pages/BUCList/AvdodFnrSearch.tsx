import React, {useState} from "react";
import {HorizontalSeparatorDiv, VerticalSeparatorDiv} from "@navikt/hoykontrast";
import {BadBucDiv, FlexDiv, HiddenDiv} from "../../CommonBucComponents";
import {Accordion, Button, Heading, TextField} from "@navikt/ds-react";
import {MagnifyingGlassIcon} from "@navikt/aksel-icons";
import classNames from "classnames";
import {fetchBucsListWithAvdodFnr} from "src/actions/buc";
import {State} from "../../../../declarations/reducers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";

export interface AvdodFnrSearchProps {
  setNewBucPanelOpen: (value: boolean | ((prevVar: boolean) => boolean)) => void
}

export interface AvdodFnrSearchSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
}

const mapState = (state: State): AvdodFnrSearchSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
})

const AvdodFnrSearch: React.FC<any> = ({setNewBucPanelOpen}: AvdodFnrSearchProps): JSX.Element => {
  const {aktoerId, sakId}: AvdodFnrSearchSelector = useSelector<State, AvdodFnrSearchSelector>(mapState)
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [_avdodFnr, setAvdodFnr] = useState<string>('')
  const [_validation, setValidation] = useState<string | undefined>(undefined)

  const performValidation = (): boolean => _avdodFnr.match(/^\d{11}$/) !== null

  const onAvdodFnrChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValidation(undefined)
    setAvdodFnr(e.target.value)
  }

  const onAvdodFnrButtonClick = (): void => {
    const valid = performValidation()
    if (valid && aktoerId && sakId) {
      setNewBucPanelOpen(false)
      dispatch(fetchBucsListWithAvdodFnr(aktoerId, sakId, _avdodFnr))
    } else {
      setValidation(t('message:validation-badAvdodFnr'))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onAvdodFnrButtonClick()
    }
  }

  return(
    <>
      <VerticalSeparatorDiv size='2' />
      <BadBucDiv>
        <>
          <Accordion id='a_buc_c_buclist--no-buc-id'>
            <Accordion.Item>
              <Accordion.Header>
                <FlexDiv>
                  <MagnifyingGlassIcon fontSize="1.5rem" />
                  <HorizontalSeparatorDiv />
                  <Heading size='small'>
                    {t('buc:form-searchOtherBUCs')}
                  </Heading>
                </FlexDiv>
              </Accordion.Header>
              <Accordion.Content>
                <FlexDiv className={classNames({ error: _validation || false })}>
                  <TextField
                    style={{ width: '200px' }}
                    data-testid='a-buc-p-buclist--avdod-input-id'
                    error={_validation || false}
                    id='a-buc-p-buclist--avdod-input-id'
                    label={(
                      <HiddenDiv>
                        {t('buc:form-avdodFnr')}
                      </HiddenDiv>
                    )}
                    onChange={onAvdodFnrChange}
                    description={t('buc:form-searchOtherBUCs-description')}
                    value={_avdodFnr || ''}
                    onKeyPress={handleKeyPress}
                  />
                  <HorizontalSeparatorDiv />
                  <Button
                    variant='primary'
                    onClick={onAvdodFnrButtonClick}
                  >
                    {t('ui:get')}
                  </Button>
                </FlexDiv>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
          <VerticalSeparatorDiv size='2' />
        </>
      </BadBucDiv>
      <VerticalSeparatorDiv size='2' />
    </>
  )
}

export default AvdodFnrSearch
