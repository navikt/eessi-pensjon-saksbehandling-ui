import { LocalStorageEntry } from 'declarations/app'
import _ from 'lodash'
import { useState, useEffect, useRef } from 'react'

const useLocalStorage = <CustomLocalStorageContent extends any = any>(
  key: string,
  defaultValue: LocalStorageEntry<CustomLocalStorageContent> = {}
): [
  state: LocalStorageEntry<CustomLocalStorageContent>,
  saveStorageState: (it: LocalStorageEntry<CustomLocalStorageContent>) => void
] => {
  const [state, setState] = useState<LocalStorageEntry<CustomLocalStorageContent>>(() => {
    console.log('read from local storage')
    const items: string | null = window.localStorage.getItem(key)
    let savedEntries: LocalStorageEntry<CustomLocalStorageContent>
    if (_.isString(items)) {
      savedEntries = JSON.parse(items)
    } else {
      savedEntries = defaultValue as LocalStorageEntry<CustomLocalStorageContent>
    }
    return savedEntries
  })

  const prevKeyRef = useRef(key)

  useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    console.log('saved to local storage')
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

export default useLocalStorage
