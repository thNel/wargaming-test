export function getMediaUrl(mediaPath: string, assetPath: string): string;
export function getMediaUrl(
  mediaPath: string | undefined,
  assetPath: string | undefined,
): string | undefined;
export function getMediaUrl(
  mediaPath: string | undefined,
  assetPath: string | undefined,
): string | undefined {
  if (mediaPath === undefined || assetPath === undefined) {
    return undefined;
  }

  return `${mediaPath.replace(/\/+$/, "")}/${assetPath.replace(/^\/+/, "")}`;
}
