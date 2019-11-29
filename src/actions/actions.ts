export interface Action<T> {
  type: string,
  payload: T
}

export interface SimpleAction {
  type: string
}

export interface ErrorPayload {
  error: any
}
