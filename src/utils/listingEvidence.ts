export function createEvidenceId() {
  return `evidence-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export function formatEvidenceSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${bytes}B`;
}
export function getEvidenceMimeType(name: string, mimeType?: string) {
  if (mimeType && mimeType !== 'application/octet-stream') return mimeType;
  if (/\.pdf$/i.test(name)) return 'application/pdf';
  if (/\.png$/i.test(name)) return 'image/png';
  if (/\.jpe?g$/i.test(name)) return 'image/jpeg';
  return mimeType ?? '';
}
