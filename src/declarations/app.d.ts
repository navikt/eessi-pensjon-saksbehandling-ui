import { FeatureToggles } from 'declarations/types'

export interface ParamPayload {
  key: string,
  value?: any
}

export interface UserInfoPayload {
  subject: string
  role: string
  allowed: boolean
  featureToggles: FeatureToggles
}
