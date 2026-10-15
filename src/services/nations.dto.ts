export interface NationDto {
  name: string;
  icons: Record<string, string>;
  color: number;
  tags: string[];
  localization: {
    mark: Record<string, string>;
  };
  id: number;
}
