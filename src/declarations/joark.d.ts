import { JoarkBrowserType } from 'components/JoarkBrowser/JoarkBrowser'
import { Item } from 'tabell'

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

export type JoarkType = 'joark'

export interface JoarkFile {
  type: JoarkType

  journalpostId: string
  dokumentInfoId: string
  variant: JoarkFileVariant | undefined

  title: string | null | undefined
  tema: string
  date: Date
}

export type JoarkFiles = Array<JoarkFile>

interface Content {
  base64: string
}

export interface JoarkBrowserItemWithContent extends JoarkBrowserItem {
  content: Content
  name: string
  size: number
  mimetype: string
}

export interface JoarkPayload {
  fileName: string | undefined
  contentType: string
  filInnhold: string
}

export interface JoarkBrowserItem extends Item {
  hasSubrows: boolean
  type: JoarkBrowserType

  journalpostId: string
  dokumentInfoId: string | undefined
  variant: JoarkFileVariant | undefined

  title: string
  tema: string | undefined
  date: Date
}

export type JoarkBrowserItems = Array<JoarkBrowserItem>
