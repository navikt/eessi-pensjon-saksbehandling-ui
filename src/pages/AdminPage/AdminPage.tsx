import TopContainer from 'src/components/TopContainer/TopContainer'
import {
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
import {resendDocument, resendDocumentList} from "src/actions/admin";
import {State} from "src/declarations/reducers";

export interface AdminPageProps {
  username?: string
}

export interface AdminPageSelector {
  resendingDocument: boolean
  resendingDocumentList: boolean
}

const mapState = (state: State): AdminPageSelector => ({
  resendingDocument: state.admin.resendingDocument,
  resendingDocumentList: state.admin.resendingDocumentList,
})

export const AdminPage: React.FC<AdminPageProps> = (): JSX.Element => {

  const dispatch = useDispatch()
  const { resendingDocument, resendingDocumentList }: AdminPageSelector = useSelector<State, AdminPageSelector>(mapState)

  const [_missingValuesResendDocument, _setMissingValuesResendDocument] = useState<boolean>(false)
  const [_missingValuesResendDocumentList, _setMissingValuesResendDocumentList] = useState<boolean>(false)
  const [_sakId, _setSakId] = useState<string>("")
  const [_dokumentId, _setDokumentId] = useState<string>("")
  const [_dokumentListe, _setDokumentListe] = useState<string>("")


  const onResendDocument = () => {
    _setMissingValuesResendDocument(false)
    if(_sakId !== "" && _dokumentId !== ""){
      dispatch(resendDocument(_sakId, _dokumentId))
    } else {
      _setMissingValuesResendDocument(true)
    }
  }

  const onResendDocumentList = () => {
    _setMissingValuesResendDocumentList(false)
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
                <VStack gap="4">
                  <div>
                    <Heading size={"small"}>Resend dokument</Heading>
                    <BodyLong size="small">Resending av SED for å journalføre.</BodyLong>
                  </div>
                  <HStack gap="4" align="end">
                    <TextField style={{width: "7rem"}} label="Sak ID (Rina)" onChange={(e) => _setSakId(e.target.value)}/>
                    <TextField style={{width: "20rem"}} label="Dokument ID" onChange={(e) => _setDokumentId(e.target.value)}/>
                    <Button variant="primary" onClick={onResendDocument} loading={resendingDocument} disabled={_sakId === "" || _dokumentId === ""}>Resend</Button>
                  </HStack>
                  {_missingValuesResendDocument &&
                    <ErrorMessage>Fyll ut begge felter</ErrorMessage>
                  }
                </VStack>
              </Box>
              <Box padding="4" width="1460px" borderWidth="1">
                <VStack gap="4">
                  <div>
                    <Heading size={"small"}>Resend dokumentliste</Heading>
                    <BodyLong size="small">Resending av liste med SED'er for å journalføre.</BodyLong>
                  </div>
                  <HStack gap="4" align="end">
                    <Textarea label="Dokumentliste" resize style={{width: "28rem", height: ""}} onChange={(e) => _setDokumentListe(e.target.value)}/>
                    <Button variant="primary" onClick={onResendDocumentList} loading={resendingDocumentList} disabled={_dokumentListe === ""}>Resend</Button>
                  </HStack>
                  {_missingValuesResendDocumentList &&
                    <ErrorMessage>Fyll ut</ErrorMessage>
                  }
                </VStack>
              </Box>
            </VStack>
            <Spacer/>
          </HStack>

      </VStack>
    </TopContainer>
  )
}

export default AdminPage
