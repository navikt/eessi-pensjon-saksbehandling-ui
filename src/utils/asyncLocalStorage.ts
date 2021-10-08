export const asyncLocalStorage = {
  setItem: (key: string, value: string) =>
    Promise.resolve().then(() => window.localStorage.setItem(key, value))
  ,
  getItem: (key: string) =>
    Promise.resolve().then(() => window.localStorage.getItem(key))
}

