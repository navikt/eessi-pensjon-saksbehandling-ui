import {Box, Button, HStack, Spacer, VStack} from "@navikt/ds-react";
import {PlusCircleIcon} from "@navikt/aksel-icons";
import React, {JSX} from "react";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {ActionWithPayload} from "@navikt/fetch";
import {useAppDispatch} from "src/store";
import {PSED} from "src/declarations/app";
import {UpdateSedPayload} from "src/declarations/types";
import {PensjonsAvslagEllerOpphor} from "src/declarations/p12000";
import AddRemovePanel from "src/components/AddRemovePanel/AddRemovePanel";
import TextArea from "src/components/Forms/TextArea";
import styles from "src/assets/css/common.module.css";

export interface PensjonsAvslagEllerOpphorPanelProps {
  parentNamespace: string
  id: string
  target: string
  pensjonstype: string | undefined
  PSED: PSED | null | undefined
  updatePSED: (needle: string, value: any) => ActionWithPayload<UpdateSedPayload>
}

const PensjonsAvslagEllerOpphorPanel: React.FC<PensjonsAvslagEllerOpphorPanelProps> = ({
  parentNamespace,
  id,
  target,
  pensjonstype,
  PSED,
  updatePSED
}: PensjonsAvslagEllerOpphorPanelProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-${id}`
  const items: Array<PensjonsAvslagEllerOpphor> = _.get(PSED, target) ?? []
  const item: PensjonsAvslagEllerOpphor | undefined = _.head(items)

  const setBegrunnelse = (begrunnelse: string) => {
    dispatch(updatePSED(target, [{...item, begrunnelse, pensjonstype}]))
  }

  const onAddNew = () => {
    dispatch(updatePSED(target, [{pensjonstype}]))
  }

  const onRemove = () => {
    dispatch(updatePSED(target, undefined))
  }

  return (
    <VStack gap="space-16">
      {item
        ? (
          <Box
            id={'repeatablerow-' + namespace}
            className={styles.repeatableBox}
            padding="space-16"
          >
            <HStack gap="space-16" align="start" wrap={false}>
              <Box flexGrow="1">
                <TextArea
                  namespace={namespace}
                  error={undefined}
                  id='begrunnelse'
                  label={t('p12000:form-pensjonsavslagelleropphor-begrunnelse')}
                  onChanged={setBegrunnelse}
                  value={item?.begrunnelse ?? ''}
                  maxLength={500}
                />
              </Box>
              <Spacer/>
              <AddRemovePanel<PensjonsAvslagEllerOpphor>
                item={item}
                index={0}
                marginTop
                allowEdit={false}
                alwaysVisible
                onRemove={onRemove}
              />
            </HStack>
          </Box>
        )
        : (<em>{t('p12000:form-pensjonsavslagelleropphor-ingen-begrunnelser')}</em>)
      }
      <Box>
        <Button
          variant='tertiary'
          data-testid={namespace + '-add'}
          disabled={!!item}
          onClick={onAddNew}
          iconPosition="left" icon={<PlusCircleIcon aria-hidden/>}
        >
          {t('ui:add-new-x', {x: t('p12000:form-pensjonsavslagelleropphor-begrunnelse')?.toLowerCase()})}
        </Button>
      </Box>
    </VStack>
  )
}

export default PensjonsAvslagEllerOpphorPanel
