
export type AllowedLocaleString = 'en' | 'nb'

export type T = (line: string, ...args: any[]) => string

export type ActionCreator = Function
export type ActionCreators = {[k: string]: ActionCreator}
export type Dispatch = Function
export type State = { [k: string]: any }

export type RinaUrl = string;
export type Loading = {[key: string]: boolean};
export type Validation = {[key: string]:string | undefined}

interface Option {
  label: string;
  navn?: string;
  value: string;
}

export interface Action {
  type: string;
  payload?: any;
  context ?: any;
}

export interface ActionWithPayload<T> extends Action {
  payload: T;
}

export interface ErrorPayload {
  error: any
}
