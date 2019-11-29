import { BucInfo, InstitutionNames } from "constants/types"

export interface BUCDetailProps {
  buc: Buc;
  bucInfo: BucInfo;
  className ?: string;
  institutionNames: InstitutionNames;
  locale: string;
  rinaUrl: string;
  t: (...args: any[]) => any
}
