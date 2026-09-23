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
import {getIdx} from "src/utils/namespace";
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

  const setItems = (newItems: Array<PensjonsAvslagEllerOpphor>) => {
    dispatch(updatePSED(target, _.isEmpty(newItems) ? undefined : newItems))
  }

  const setBegrunnelse = (begrunnelse: string, index: number) => {
    const newItems: Array<PensjonsAvslagEllerOpphor> = _.cloneDeep(items)
    newItems[index] = {...newItems[index], begrunnelse, pensjonstype}
    setItems(newItems)
  }

  const onAddNew = () => {
    setItems([...items, {pensjonstype}])
  }

  const onRemove = (index: number) => {
    setItems(items.filter((_item, i: number) => i !== index))
  }

  const renderRow = (item: PensjonsAvslagEllerOpphor, index: number) => {
    const _namespace = namespace + getIdx(index)

    return (
      <Box
        key={'repeatablerow-' + _namespace}
        id={'repeatablerow-' + _namespace}
        className={styles.repeatableBox}
        padding="space-16"
      >
        <HStack gap="space-16" align="start" wrap={false}>
          <Box flexGrow="1">
            <TextArea
              namespace={_namespace}
              error={undefined}
              id='begrunnelse'
              label={t('p12000:form-pensjonsavslagelleropphor-begrunnelse')}
              onChanged={(v: string) => setBegrunnelse(v, index)}
              value={item?.begrunnelse ?? ''}
              maxLength={500}
            />
          </Box>
          <Spacer/>
          <AddRemovePanel<PensjonsAvslagEllerOpphor>
            item={item}
            index={index}
            marginTop
            allowEdit={false}
            alwaysVisible
            onRemove={() => onRemove(index)}
          />
        </HStack>
      </Box>
    )
  }

  return (
    <VStack gap="space-16">
      {_.isEmpty(items)
        ? (<em>{t('p12000:form-pensjonsavslagelleropphor-ingen-begrunnelser')}</em>)
        : (<VStack gap="space-8">{items.map(renderRow)}</VStack>)
      }
      <Box>
        <Button
          variant='tertiary'
          data-testid={namespace + '-add'}
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
