
export type AllowedLocaleString = 'en' | 'nb'

export type T = (line: string, ...args: any[]) => string

export type RinaUrl = string;
export type Loading = {[key: string]: boolean};
export type Validation = {[key: string]: string | null | undefined}

interface Option {
  label: string;
  navn?: string;
  value: string;
}
