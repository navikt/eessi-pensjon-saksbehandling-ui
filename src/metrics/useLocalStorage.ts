
import { LocalStorageEntry } from 'declarations/app'
import _ from 'lodash'
import { useState, useEffect } from 'react'

const useLocalStorage = <CustomLocalStorageContent extends any = any>(key: string): [
  state: LocalStorageEntry<CustomLocalStorageContent>,
  saveStorageState: (it: LocalStorageEntry<CustomLocalStorageContent>) => void
] => {
  const [state, setState] = useState<LocalStorageEntry<CustomLocalStorageContent>>(() => {
      const items: string | null = window.localStorage.getItem(key)
      let savedEntries: LocalStorageEntry<CustomLocalStorageContent>
      if (_.isString(items)) {
        savedEntries = JSON.parse(items)
      } else {
        savedEntries = {} as LocalStorageEntry<CustomLocalStorageContent>
      }
      console.log('read from local storage')
      return savedEntries
    }
  )

  const saveStorageState = (it: LocalStorageEntry<CustomLocalStorageContent>) => {
    window.localStorage.setItem(key, JSON.stringify(it))
    setState(it)
  }

  useEffect(() => {
    if (state) {
      saveStorageState(state)
      console.log('saved to local storage')
    }
  }, [state])

  return [state, saveStorageState]
}

export default useLocalStorage
