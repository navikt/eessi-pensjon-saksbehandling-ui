import React, {JSX, useState} from "react";
import {Accordion, Box, Button, Heading, HStack, TextField} from "@navikt/ds-react";
import {MagnifyingGlassIcon} from "@navikt/aksel-icons";
import classNames from "classnames";
import {fetchBucsListWithAvdodFnr} from "src/actions/buc";
import {State} from "src/declarations/reducers";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import styles from "./AvdodFnrSearch.module.css";

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
      dispatch(fetchBucsListWithAvdodFnr(aktoerId, sakId, _avdodFnr))
      setNewBucPanelOpen(false)
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
      <Box paddingBlock="8 8">
        <div className={styles.badBucDiv}>
          <>
            <Accordion id='a_buc_c_buclist--no-buc-id'>
              <Accordion.Item>
                <Accordion.Header>
                  <HStack align="end">
                    <HStack gap="4">
                      <MagnifyingGlassIcon fontSize="1.5rem" />
                      <Heading size='small'>
                        {t('buc:form-searchOtherBUCs')}
                      </Heading>
                    </HStack>
                  </HStack>
                </Accordion.Header>
                <Accordion.Content>
                  <div className={classNames(
                    styles.flexDiv,
                    { [styles.error]: _validation || false }
                  )}>
                    <HStack
                      align="end"
                      gap="4"
                    >
                      <TextField
                        style={{ width: '200px' }}
                        data-testid='a-buc-p-buclist--avdod-input-id'
                        error={_validation || false}
                        id='a-buc-p-buclist--avdod-input-id'
                        label={(
                          <div className={styles.hiddenOutsideViewDiv}>
                            {t('buc:form-avdodFnr')}
                          </div>
                        )}
                        onChange={onAvdodFnrChange}
                        description={t('buc:form-searchOtherBUCs-description')}
                        value={_avdodFnr || ''}
                        onKeyPress={handleKeyPress}
                      />
                      <Box>
                        <Button
                          variant='primary'
                          onClick={onAvdodFnrButtonClick}
                        >
                          {t('ui:get')}
                        </Button>
                      </Box>
                    </HStack>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          </>
        </div>
      </Box>
    </>
  )
}

export default AvdodFnrSearch
