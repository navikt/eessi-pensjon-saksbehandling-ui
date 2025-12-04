import { JoarkBrowserMode, JoarkBrowserType } from 'src/components/JoarkBrowser/JoarkBrowser'
import { Context, Item } from '@navikt/tabell'

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
  relevanteDatoer?: Array<RelevantDato>
}

export interface RelevantDato {
  dato: string
  datotype: string
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

interface Content {
  base64: string
}

export interface JoarkPreview {
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

export interface JoarkBrowserItemWithContent extends JoarkBrowserItem {
  content: Content
  name: string
  size: number
  mimetype: string
}

export interface JoarkBrowserContext extends Context {
  existingItems: JoarkBrowserItems
  loadingJoarkPreviewFile: boolean
  previewFile: JoarkBrowserItemWithContent | undefined
  clickedPreviewItem: JoarkBrowserItem | undefined,
  mode: JoarkBrowserMode
}

export interface JoarkList {
  data: {
    dokumentoversiktBruker: {
      journalposter: Array<JoarkPoster>
    }
  }
}
