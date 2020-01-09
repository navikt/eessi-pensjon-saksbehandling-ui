
export interface JoarkFileVariant {
  variantformat:string;
  filnavn: string;
}

export interface JoarkDoc {
  dokumentInfoId: string;
  tittel: string;
  dokumentvarianter: Array<JoarkFileVariant>;
}
export interface JoarkPoster {
  journalpostId: string;
  tittel: string;
  tema: string;
  datoOpprettet: string;
  tilleggsopplysninger?: string;
  dokumenter: Array<JoarkDoc>
}

export interface JoarkFile {
  journalpostId: string;
  tittel: string;
  tema: string;
  datoOpprettet: Date;
  dokumentInfoId: string;
  tilleggsopplysninger?: string;
  variant: JoarkFileVariant
}

interface Content {
  base64: string;
}

export interface JoarkFileWithContent extends JoarkFile {
  content: Content;
  name: string;
  size: number;
  mimetype: string;
}
