export interface InstitutionListProps {
  className?: string;
  flag?: boolean;
  flagType?: string;
  institutions: Array<any>;
  institutionNames: InstitutionNames;
  locale: string;
  t: (...args: any[]) => any;
  type: string;
}
