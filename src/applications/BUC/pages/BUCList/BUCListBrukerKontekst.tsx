import {Heading} from "@navikt/ds-react";
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import styled from "styled-components/macro";
import {BUCMode, PesysContext} from "../../../../declarations/app";
import {useEffect} from "react";
import {fetchBucsInfoList, fetchJoarkBucsListForBrukerKontekst} from "../../../../actions/buc";
import {State} from "../../../../declarations/reducers";
import {BucLenkePanel} from "./BUCListBrukerKontekst_V1";

export const BUCListDiv = styled.div``
const BUCListHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
`

export interface BUCListProps {
  initialBucNew?: boolean
  setMode: (mode: BUCMode, s: string, callback?: any, content ?: JSX.Element) => void
}

export interface BUCListBrukerKontekstSelector {
  aktoerId: string | null | undefined
  sakId: string | null | undefined
  pesysContext: PesysContext | undefined
  bucsListJoark: Array<any> | null | undefined
  gettingBucsListJoark: boolean
}

const mapState = (state: State): BUCListBrukerKontekstSelector => ({
  aktoerId: state.app.params.aktoerId,
  sakId: state.app.params.sakId,
  pesysContext: state.app.pesysContext,
  bucsListJoark: state.buc.bucsListJoark,
  gettingBucsListJoark: state.loading.gettingBucsListJoark
})
const BUCListBrukerKontekst: React.FC<BUCListProps> = ({
  //setMode, initialBucNew = undefined
}: BUCListProps): JSX.Element => {

  const {
    aktoerId, sakId, pesysContext, bucsListJoark, gettingBucsListJoark
  }: BUCListBrukerKontekstSelector = useSelector<State, BUCListBrukerKontekstSelector>(mapState)

  const dispatch = useDispatch()
  const { t } = useTranslation()

  useEffect(() => {
    if (aktoerId && sakId && bucsListJoark === undefined && !gettingBucsListJoark) {
      dispatch(fetchJoarkBucsListForBrukerKontekst(aktoerId, sakId))
      dispatch(fetchBucsInfoList(aktoerId))
    }
  }, [aktoerId, gettingBucsListJoark, pesysContext, sakId])


  return (
    <BUCListDiv>
      <BUCListHeader>
        <Heading size='small'>
          {t('buc:form-buclist')}
        </Heading>
      </BUCListHeader>
      {bucsListJoark?.map((buc, index: number) => {
        return (
          <BucLenkePanel
            href='#'
            border
            data-testid={'a-buc-p-buclist--buc-' + buc.id}
            key={index}
            style={{ animationDelay: (0.1 * index) + 's' }}
          >
            {buc.processDefinitionName}
          </BucLenkePanel>

        )
      })}
    </BUCListDiv>
  )
}

export default BUCListBrukerKontekst
