import {Box, Heading, HStack, Radio, RadioGroup, Tabs, VStack} from "@navikt/ds-react";
import React, {JSX, useEffect, useState} from "react";
import _ from "lodash";
import {useTranslation} from "react-i18next";
import {useAppDispatch} from "src/store";
import {MainFormProps} from "src/applications/MainForm";
import {Betalingsdetaljer, PensjonsAvslagEllerOpphor} from "src/declarations/p12000";
import BetalingsdetaljerPanel from "./BetalingsdetaljerPanel";
import PensjonsAvslagEllerOpphorPanel from "./PensjonsAvslagEllerOpphorPanel";

export const BETALINGSDETALJER_TARGET = 'pensjon.pensjoninfo.betalingsdetaljer'
export const PENSJONSAVSLAG_TARGET = 'pensjon.pensjoninfo.pensjonsavslag'
export const PENSJONSOPPHORING_TARGET = 'pensjon.pensjoninfo.pensjonsopphoring'

const PENSJONSTYPER = ['01', '02', '03']

const InformasjonOmPensjon: React.FC<MainFormProps> = ({
  label,
  parentNamespace,
  PSED,
  updatePSED
}: MainFormProps): JSX.Element => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const namespace = `${parentNamespace}-informasjonompensjon`

  const betalingsdetaljer: Array<Betalingsdetaljer> = _.get(PSED, BETALINGSDETALJER_TARGET) ?? []
  const pensjonsavslag: Array<PensjonsAvslagEllerOpphor> = _.get(PSED, PENSJONSAVSLAG_TARGET) ?? []
  const pensjonsopphoring: Array<PensjonsAvslagEllerOpphor> = _.get(PSED, PENSJONSOPPHORING_TARGET) ?? []

  const storedPensjonstype: string | undefined = _.find(
    [...betalingsdetaljer, ...pensjonsavslag, ...pensjonsopphoring],
    (item: Betalingsdetaljer | PensjonsAvslagEllerOpphor) => !_.isEmpty(item?.pensjonstype)
  )?.pensjonstype

  const [_pensjonstype, _setPensjonstype] = useState<string>(storedPensjonstype ?? '')

  useEffect(() => {
    if (storedPensjonstype && storedPensjonstype !== _pensjonstype) {
      _setPensjonstype(storedPensjonstype)
    }
  }, [storedPensjonstype])

  const setPensjonstype = (pensjonstype: string) => {
    _setPensjonstype(pensjonstype)

    const applyPensjonstype = (target: string, items: Array<Betalingsdetaljer | PensjonsAvslagEllerOpphor>) => {
      if (!_.isEmpty(items)) {
        dispatch(updatePSED(target, items.map((item) => ({...item, pensjonstype}))))
      }
    }

    applyPensjonstype(BETALINGSDETALJER_TARGET, betalingsdetaljer)
    applyPensjonstype(PENSJONSAVSLAG_TARGET, pensjonsavslag)
    applyPensjonstype(PENSJONSOPPHORING_TARGET, pensjonsopphoring)
  }

  return (
    <Box padding="space-16">
      <VStack gap="space-16">
        <Heading size="medium">{label}</Heading>
        <RadioGroup
          value={_pensjonstype}
          data-testid={namespace + '-pensjonstype'}
          id={namespace + '-pensjonstype'}
          legend={t('p12000:form-informasjonompensjon-pensjonstype')}
          onChange={setPensjonstype}
        >
          <HStack gap="space-16">
            {PENSJONSTYPER.map((pensjonstype: string) => (
              <Radio key={pensjonstype} value={pensjonstype}>
                {t('p12000:pensjonstype-' + pensjonstype)}
              </Radio>
            ))}
          </HStack>
        </RadioGroup>
        <Tabs defaultValue="innvilgelseavpensjon">
          <Tabs.List>
            <Tabs.Tab label="Innvilgelse av pensjon (Betalingsdetaljer)" value="innvilgelseavpensjon"/>
            <Tabs.Tab label="Avslag på pensjon" value="avslagpensjon"/>
            <Tabs.Tab label="Opphør av pensjon" value="opphoravpensjon"/>
          </Tabs.List>
          <Tabs.Panel value="innvilgelseavpensjon">
            <Box paddingBlock="space-16 space-0">
              <BetalingsdetaljerPanel
                parentNamespace={namespace}
                target={BETALINGSDETALJER_TARGET}
                pensjonstype={_pensjonstype || undefined}
                PSED={PSED}
                updatePSED={updatePSED}
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="avslagpensjon">
            <Box paddingBlock="space-16 space-0">
              <PensjonsAvslagEllerOpphorPanel
                parentNamespace={namespace}
                id='avslagpensjon'
                target={PENSJONSAVSLAG_TARGET}
                pensjonstype={_pensjonstype || undefined}
                PSED={PSED}
                updatePSED={updatePSED}
              />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value="opphoravpensjon">
            <Box paddingBlock="space-16 space-0">
              <PensjonsAvslagEllerOpphorPanel
                parentNamespace={namespace}
                id='opphoravpensjon'
                target={PENSJONSOPPHORING_TARGET}
                pensjonstype={_pensjonstype || undefined}
                PSED={PSED}
                updatePSED={updatePSED}
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </VStack>
    </Box>
  )
}

export default InformasjonOmPensjon
