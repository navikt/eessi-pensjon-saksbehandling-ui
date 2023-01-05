import React from "react";
import {Buc, BucInfo, Bucs, JoarkBuc} from "../../../../declarations/buc";
import {BucLenkePanel} from "../../CommonBucComponents";
import classNames from "classnames";
import BUCHeader from "../../components/BUCHeader/BUCHeader";
import {fetchBuc, setCurrentBuc} from "../../../../actions/buc";
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../../declarations/reducers";
import {BUCMode} from "../../../../declarations/app";

export interface BUCLenkeCardSelector {
  bucs: Bucs | undefined
}

const mapState = (state: State): BUCLenkeCardSelector => ({
  bucs: state.buc.bucs,
})

const BUCLenkeCard: React.FC<any> = (props: any): JSX.Element => {
  const {buc, bucsInfo, newlyCreatedBuc, setMode, index} = props;
  const {bucs}: BUCLenkeCardSelector = useSelector<State, BUCLenkeCardSelector>(mapState)

  const dispatch = useDispatch()
  const bucId: string = buc.caseId!
  const bucInfo: BucInfo = bucsInfo && bucsInfo.bucs && bucsInfo.bucs[bucId] ? bucsInfo.bucs[bucId] : {} as BucInfo

  const onBUCEdit = (buc: JoarkBuc | Buc): void => {
    dispatch(setCurrentBuc(buc.caseId!))
    if (bucs && buc.caseId && !bucs[buc.caseId!]) {
      dispatch(fetchBuc(buc.caseId))
    }
    setMode('bucedit' as BUCMode, 'forward')
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <BucLenkePanel
      href='#'
      border
      data-testid={'a-buc-p-buclist--buc-' + buc.caseId}
      key={index}
      className={classNames({ new: (newlyCreatedBuc && buc.caseId === newlyCreatedBuc.caseId) || false })}
      style={{ animationDelay: (0.1 * index) + 's' }}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onBUCEdit(buc)
      }}
    >
      <BUCHeader
        buc={buc}
        bucInfo={bucInfo}
      />
    </BucLenkePanel>
  )
}

export default BUCLenkeCard
