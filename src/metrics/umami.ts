export const umamiLogger = (key: string, data: object) => {
  //@ts-ignore
  if (typeof window !== 'undefined' && window.umami) {
    //@ts-ignore
    window.umami.track(key, data)
  }
}

export const umamiButtonLogger = (data: object ) => {
  umamiLogger("knapp klikket", data)
}

export const umamiAccordionLogger = (data: object ) => {
  umamiLogger("accordion åpnet", data)
}
