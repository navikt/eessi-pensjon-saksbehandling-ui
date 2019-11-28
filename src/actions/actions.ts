export interface Action<T> {
  type: string,
  payload?: T
}

export interface JustTypeAction {
  type: string
}

export interface PayloadError {
  error: any
}
