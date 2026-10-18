export interface FilterGroupStatusProps {
  isLoading: boolean;
  hasError: boolean;
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  onRetry: () => void;
}
