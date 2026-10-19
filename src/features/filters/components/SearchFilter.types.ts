export interface SearchFilterProps {
  onPendingChange: (isPending: boolean) => void;
  resetVersion: number;
}

export interface SearchDraft {
  appliedSearchTerm: string;
  resetVersion: number;
  value: string;
}
