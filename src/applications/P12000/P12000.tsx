import React, {JSX} from "react";
import {Button, Heading, HStack, VStack} from "@navikt/ds-react";
import {ChevronLeftIcon} from "@navikt/aksel-icons";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {fetchBuc} from "src/actions/buc";
import {resetEditingItems} from "src/actions/app";
import {resetValidation} from "src/actions/validation";
import {Buc, Sed} from "src/declarations/buc";
import {BUCMode} from "src/declarations/app";

export interface P12000Props {
  buc: Buc
  sed?: Sed,
  setMode: (mode: BUCMode, s: string, callback?: () => void, content?: JSX.Element) => void
}

const P12000: React.FC<P12000Props> = ({buc, setMode}: P12000Props): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const namespace = "p12000"

  const onBackClick = () => {
    dispatch(resetEditingItems())
    dispatch(resetValidation(namespace))
    dispatch(fetchBuc(buc.caseId!))
    setMode('bucedit', 'back')
  }

  return (
    <VStack gap="space-16">
      <HStack>
        <Button
          variant='secondary'
          onClick={onBackClick}
          iconPosition="left" icon={<ChevronLeftIcon aria-hidden />}
        >
          {t('ui:back')}
        </Button>
      </HStack>
      <Heading level="1" size="medium">P12000</Heading>
    </VStack>
  )
}

export default P12000