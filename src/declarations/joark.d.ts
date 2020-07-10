
export interface JoarkFileVariant {
  variantformat: string
  filnavn: string | null
}

export interface JoarkDoc {
  dokumentInfoId: string
  tittel?: string | null | undefined
  dokumentvarianter: Array<JoarkFileVariant>
}
export interface JoarkPoster {
  journalpostId: string
  tittel: string
  tema: string
  datoOpprettet: string
  tilleggsopplysninger?: Array<any> | null
  dokumenter: Array<JoarkDoc>
}

export interface JoarkFile {
  journalpostId: string
  tittel: string | null | undefined
  tema: string
  datoOpprettet: Date
  dokumentInfoId: string
  tilleggsopplysninger?: Array<any> | null
  variant: JoarkFileVariant
}

export type JoarkFiles = Array<JoarkFile>

interface Content {
  base64: string
}

export interface JoarkFileWithContent extends JoarkFile {
  content: Content
  name: string
  size: number
  mimetype: string
}
