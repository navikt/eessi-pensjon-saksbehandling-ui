import { Buc, ErrorBuc } from 'constants/types'

interface Actions {
  resetSed: Function;
  resetBuc: Function;
}

interface BUCCrumbsProps {
  actions: Actions;
  bucs: {[k: string]: Buc | ErrorBuc};
  className?: string;
  currentBuc: string;
  mode: string;
  setMode: Function;
  showLastLink: boolean;
  t: Function;
}

interface BUCCrumbLink {
  label: string;
  func: Function
}
