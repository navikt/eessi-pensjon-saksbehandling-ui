import TopContainer from 'src/components/TopContainer/TopContainer'
import {
  Alert,
  BodyLong,
  Box,
  Button,
  ErrorMessage,
  Heading,
  HStack,
  Spacer,
  Textarea,
  TextField,
  VStack
} from "@navikt/ds-react";
import {useState} from "react";
import { useDispatch, useSelector } from 'react-redux'
import {adminResetSuccessMsg, resendDocument, resendDocumentList} from "src/actions/admin";
import {State} from "src/declarations/reducers";

export interface AdminPageProps {
  username?: string
}

export interface AdminPageSelector {
  resendingDocument: boolean
  resendingDocumentList: boolean
  resendingDocumentSuccess: boolean
  resendingDocumentListSuccess: boolean
}

const mapState = (state: State): AdminPageSelector => ({
  resendingDocument: state.admin.resendingDocument,
  resendingDocumentList: state.admin.resendingDocumentList,
  resendingDocumentSuccess: state.admin.resendingDocumentSuccess,
  resendingDocumentListSuccess: state.admin.resendingDocumentListSuccess,
})

export const AdminPage: React.FC<AdminPageProps> = (): JSX.Element => {

  const dispatch = useDispatch()
  const { resendingDocument, resendingDocumentSuccess, resendingDocumentList, resendingDocumentListSuccess }: AdminPageSelector = useSelector<State, AdminPageSelector>(mapState)

  const [_missingValuesResendDocument, _setMissingValuesResendDocument] = useState<boolean>(false)
  const [_missingValuesResendDocumentList, _setMissingValuesResendDocumentList] = useState<boolean>(false)
  const [_sakId, _setSakId] = useState<string>("")
  const [_dokumentId, _setDokumentId] = useState<string>("")
  const [_dokumentListe, _setDokumentListe] = useState<string>("")

  var dokumentListe = "Eks. 12345678_123456abc123456def123456abc123456d_1\n" +
    "12345678_123456abc123456def123456abc123456d_1"

  const onResendDocument = () => {
    _setMissingValuesResendDocument(false)
    if(resendingDocumentSuccess) dispatch(adminResetSuccessMsg())
    if(_sakId !== "" && _dokumentId !== ""){
      dispatch(resendDocument(_sakId, _dokumentId))
    } else {
      _setMissingValuesResendDocument(true)
    }
  }

  const onResendDocumentList = () => {
    _setMissingValuesResendDocumentList(false)
    if(resendingDocumentListSuccess) dispatch(adminResetSuccessMsg())
    if(_dokumentListe !== ""){
      dispatch(resendDocumentList(_dokumentListe))
    } else {
      _setMissingValuesResendDocumentList(true)
    }
  }

  return (
    <TopContainer>
      <VStack gap="4">
          <HStack>
            <Spacer/>
            <VStack gap="4" padding="4">
              <Box padding="4" width="1460px" borderWidth="1">
                <HStack gap="4">
                  <VStack gap="4">
                    <div>
                      <Heading size={"small"}>Resend dokument</Heading>
                      <BodyLong size="small">Resending av SED for å journalføre.</BodyLong>
                    </div>
                    <HStack gap="4" align="end">
                      <TextField
                        style={{width: "7rem"}}
                        label="Sak ID (Rina)"
                        description="Eks. 12345678"
                        onChange={(e) => {
                          if(resendingDocumentSuccess) dispatch(adminResetSuccessMsg())
                          _setSakId(e.target.value)
                        }}
                      />

                      <TextField
                        style={{width: "20rem"}}
                        label="Dokument ID"
                        description="Eks. 123456abc123456def123456abc123456d"
                        onChange={(e) => {
                          if(resendingDocumentSuccess) dispatch(adminResetSuccessMsg())
                          _setDokumentId(e.target.value)
                        }}
                      />
                    </HStack>
                    {_missingValuesResendDocument &&
                      <ErrorMessage>Fyll ut begge felter</ErrorMessage>
                    }
                    {resendingDocumentSuccess &&
                      <Alert variant="success">
                        Dokumentet ble funnet og sendt videre for ny registrering
                      </Alert>
                    }
                  <HStack>
                    <Button variant="primary" onClick={onResendDocument} loading={resendingDocument} disabled={_sakId === "" || _dokumentId === ""}>Resend</Button>
                  </HStack>
                  </VStack>
                </HStack>
              </Box>
              <Box padding="4" width="1460px" borderWidth="1">
                <HStack gap="4">
                  <VStack gap="4">
                    <div>
                      <Heading size={"small"}>Resend dokumentliste</Heading>
                      <BodyLong size="small">Resending av liste med SED'er for å journalføre.</BodyLong>
                    </div>
                    <HStack gap="4" align="end">
                      <Textarea
                        label="Dokumentliste"
                        description= {<div style={{whiteSpace: 'pre-line'}}>{dokumentListe}</div>}
                        resize
                        style={{width: "28rem", height: ""}}
                        onChange={(e) => {
                          if(resendingDocumentListSuccess) dispatch(adminResetSuccessMsg())
                          _setDokumentListe(e.target.value)
                        }}
                      />
                    </HStack>
                    {_missingValuesResendDocumentList &&
                      <ErrorMessage>Fyll ut</ErrorMessage>
                    }
                    {resendingDocumentListSuccess &&
                      <Alert variant="success">
                        Alle dokumenter ble funnet og sendt videre for ny registrering
                      </Alert>
                    }
                    <HStack gap="4" align="end">
                      <Button variant="primary" onClick={onResendDocumentList} loading={resendingDocumentList} disabled={_dokumentListe === ""}>Resend</Button>
                    </HStack>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
            <Spacer/>
          </HStack>

      </VStack>
    </TopContainer>
  )
}

export default AdminPage
