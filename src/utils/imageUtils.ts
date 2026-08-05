export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Handle Google Drive image links
  if (trimmed.includes('drive.google.com') || trimmed.includes('googleusercontent.com')) {
    let fileId = '';
    
    // Pattern 1: https://drive.google.com/file/d/FILE_ID/view...
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    // Pattern 2: https://drive.google.com/open?id=FILE_ID or ?id=FILE_ID
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    // Pattern 3: https://lh3.googleusercontent.com/d/FILE_ID
    const lh3Match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (fileDMatch && fileDMatch[1]) {
      fileId = fileDMatch[1];
    } else if (idParamMatch && idParamMatch[1]) {
      fileId = idParamMatch[1];
    } else if (lh3Match && lh3Match[1]) {
      fileId = lh3Match[1];
    }

    if (fileId) {
      // Use lh3 googleusercontent direct image CDN endpoint
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  return trimmed;
}
