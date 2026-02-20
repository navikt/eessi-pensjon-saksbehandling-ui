import {
  Events,
  type TaxonomyEvent,
  AccordionApnetProperties,
  AvkrysningsboksEndretProperties,
  KnappKlikketProperties
} from '@navikt/analytics-types';
const umamiLogger = (key: string, data: object) => {
  //@ts-ignore
  if (typeof window !== 'undefined' && window.umami) {
    //@ts-ignore
    window.umami.track(key, data)
  }
}

type TaxonomyEventWithExtra = TaxonomyEvent & {
  properties?: TaxonomyEvent['properties'] & Record<string, unknown>;
};

export const logToUmami = (event: TaxonomyEventWithExtra) => {
  umamiLogger(event.name, event.properties);
}

export const umamiButtonLogger = (data: KnappKlikketProperties & Record<string, unknown>) => {
  logToUmami({
    name: Events.KNAPP_KLIKKET,
    properties: data
  })
}

export const umamiAccordionLogger = (data: AccordionApnetProperties & Record<string, unknown>) => {
  logToUmami({
    name: Events.ACCORDION_APNET,
    properties: data
  })
}

export const umamiCheckBoxLogger = (data: AvkrysningsboksEndretProperties & Record<string, unknown>) => {
  logToUmami({
    name: Events.AVKRYSNINGSBOKS_ENDRET,
    properties: data
  })
}
