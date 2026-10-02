import { Adresse, BaseSED, Eessisak, Krav, Person, Pensjon, PIN } from "src/declarations/sed";

export interface P2200Uforhet {
  arbeidsUlykke?: string
  startDatoPensjon?: string
  startdatoLege?: string
  militartjenesteUlykke?: string
  ansvarligTredjepart?: string
  bevisstforsaketSoker?: string
}

export interface P2200Institusjon {
  institusjonsid?: string
  institusjonsnavn?: string
  saksnummer?: string
  sektor?: string
  land?: string
  personNr?: string
  utstedelsesDato?: string
  startdatoPensjonsRettighet?: string
}

export interface P2200Pin extends Omit<PIN, "institusjonsid" | "institusjonsnavn" | "sektor" | "land"> {
  institusjonsid?: string
  institusjonsnavn?: string
  sektor?: string
  land?: string
  institusjon?: P2200Institusjon
}

export interface P2200Person extends Omit<Person, "kontakt" | "sivilstand" | "relasjontilavdod" | "pin"> {
  fornavnvedfoedsel?: string
  tidligerefornavn?: string
  tidligereetternavn?: string
  pinland?: { oppholdsland?: string; kompetenteuland?: string }
  pin?: Array<P2200Pin>
  relasjontilavdod?: { relasjon?: string }
  sivilstand?: Array<{ fradato?: string; status?: string }>
  kontakt?: {
    telefon?: Array<{ type?: string; nummer?: string }>
    email?: Array<{ adresse?: string }>
  }
}

export interface P2200Arbeidsforhold {
  inntekt?: Array<{
    betalingshyppighetinntekt?: string
    beloeputbetaltsiden?: string
    valuta?: string
    annenbetalingshyppighetinntekt?: string
    beloep?: string
  } | null>
  planlagtstartdato?: string
  arbeidstimerperuke?: string
  planlagtpensjoneringsdato?: string
  yrke?: string
  type?: string
  sluttdato?: string
}

export interface P2200Adresse extends Partial<Adresse> {
  type?: string
  annen?: string
}

export interface P2200Bank {
  navn?: string
  konto?: {
    sepa?: { iban?: string; swift?: string }
    ikkesepa?: { swift?: string }
    kontonr?: string
    innehaver?: { rolle?: string; navn?: string }
    betalingsreferanse?: string
  }
  adresse?: P2200Adresse
}

export interface P2200Bruker {
  mor?: { person: P2200Person }
  far?: { person: P2200Person }
  person?: P2200Person
  adresse?: P2200Adresse
  arbeidsforhold?: Array<P2200Arbeidsforhold>
  bank?: P2200Bank
}

export type P2200Krav = Omit<Krav, "dato"> & { dato?: string }

export interface P2200Nav {
  eessisak?: Array<Partial<Eessisak>>
  bruker?: P2200Bruker & { uforhet?: P2200Uforhet }
  ektefelle?: {
    person?: P2200Person
    type?: string
    far?: { person: P2200Person }
    mor?: { person: P2200Person }
  }
  barn?: Array<{
    mor?: { person: P2200Person }
    person?: P2200Person
    far?: { person: P2200Person }
    relasjontilbruker?: string
    relasjontilbruker43?: string
    opplysningeromannetbarn?: string
  }>
  verge?: {
    person?: P2200Person
    vergemaal?: { mandat?: string }
    adresse?: P2200Adresse
  }
  krav?: P2200Krav
}

export interface P2200Ytelse {
  totalbruttobeloeparbeidsbasert?: string
  institusjon?: P2200Institusjon
  pin?: P2200Pin
  startdatoutbetaling?: string
  mottasbasertpaa?: string
  annenytelse?: string
  mottasbasertpaaitem?: Array<{
    totalbruttobeloepbostedsbasert?: string
    totalbruttobeloeparbeidsbasert?: string
    verdi?: string
  }>
  ytelse?: string
  startdatoretttilytelse?: string
  sluttdatoutbetaling?: string
  sluttdatoRettTilUtbetaling?: string
  beloep?: Array<{
    betalingshyppighetytelse?: string
    valuta?: string
    beloep?: string
    beloepBrutto?: string
    gjeldendesiden?: string
    utbetalingshyppighetAnnen?: string
  }>
  status?: string
  annenbetalingshyppighetytelse?: string
  totalbruttobeloepbostedsbasert?: string
}

export interface P2200Pensjon extends Pensjon {
  gjenlevende?: P2200Bruker
  angitidligstdato?: string
  utsettelse?: Array<{
    institusjonsnavn?: string
    institusjonsid?: string
    land?: string
    institusjon?: P2200Ytelse["institusjon"]
    tildato?: string
  }>
  bruker?: P2200Bruker
  vedtak?: Array<{
    mottaker?: Array<string>
    trekkgrunnlag?: Array<string>
  }>
  vedlegg?: Array<string>
  vedleggandre?: string
  etterspurtedokumenter?: string
  ytterligeinformasjon?: string
  trekkgrunnlag?: Array<string>
  mottaker?: Array<string>
  institusjonennaaikkesoektompensjon?: Array<string>
  ytelser?: Array<P2200Ytelse>
  kravDato?: P2200Krav
  forespurtstartdato?: string
}

export interface P2200SED extends BaseSED {
  nav: P2200Nav
  pensjon: P2200Pensjon
}
