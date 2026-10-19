export interface SearchFilterProps {
  onPendingChange?: (isPending: boolean) => void;
  resetVersion: number;
  id?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface SearchDraft {
  appliedSearchTerm: string;
  resetVersion: number;
  value: string;
}
