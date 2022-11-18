import * as constants from 'constants/constants'
import { PesysContext } from 'declarations/app.d'
import { State } from 'declarations/reducers'
import { useSelector } from 'react-redux'
import BUCIndexVedtaksKontekst from "./BUCIndexVedtaksKontekst";
import BUCIndexBrukerKontekst from "./BUCIndexBrukerKontekst";

export interface BUCIndexSelector {
  pesysContext: PesysContext | undefined
  vedtakId: string | null | undefined
}

const mapState = (state: State): BUCIndexSelector => ({
  pesysContext: state.app.pesysContext,
  vedtakId: state.app.params.vedtakId
})

export const BUCIndex = (): JSX.Element => {
  const {
    pesysContext, vedtakId
  }: BUCIndexSelector = useSelector<State, BUCIndexSelector>(mapState)

  const isVedtaksKontekst = !!vedtakId && pesysContext === constants.VEDTAKSKONTEKST

  return (
    isVedtaksKontekst ? <BUCIndexVedtaksKontekst/> : <BUCIndexBrukerKontekst/>
  )
}

export default BUCIndex
