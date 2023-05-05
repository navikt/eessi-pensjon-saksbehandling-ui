import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {Buc, Sed} from "../../declarations/buc";
import {BUCMode} from "../../declarations/app";
import {Button, Heading} from "@navikt/ds-react";
import {BackFilled} from "@navikt/ds-icons";
import {HorizontalSeparatorDiv} from "@navikt/hoykontrast";
import {getSed} from "../../actions/buc";

export interface P2000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P2000: React.FC<P2000Props> = ({
  buc,
  sed = undefined,
  setMode
}: P2000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    if(sed){
      dispatch(getSed(buc.caseId!, sed))
    }

  }, [sed])

  const onBackClick = () => {
    setMode('bucedit', 'back')
  }


  return (
    <>
      <div style={{ display: 'inline-block' }}>
        <Button
          variant='secondary'
          onClick={onBackClick}
        >
          <BackFilled />
          <HorizontalSeparatorDiv size='0.25' />
          <span>
            {t('ui:back')}
          </span>
        </Button>
      </div>
      <Heading size={"medium"}>P2000</Heading>
    </>
  )
}

export default P2000
