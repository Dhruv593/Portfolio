import { apiClient } from './apiClient';

interface UploadSignature {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
}

export async function uploadImage(file: File, maxWidth: number): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) ||
      file.size === 0 || file.size > 5 * 1024 * 1024) {
    throw new Error('Choose a JPEG, PNG, WebP, or AVIF image up to 5 MB.');
  }

  const signed = await apiClient.post<{ data: UploadSignature }>('/media/sign');
  const { cloudName, apiKey, timestamp, folder, signature } = signed.data;
  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const result = await response.json();
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'Image upload failed. Please try again.');
  }

  const url = new URL(result.secure_url);
  if (url.protocol !== 'https:' || !url.pathname.includes('/image/upload/')) {
    throw new Error('Cloudinary returned an invalid image URL.');
  }
  url.pathname = url.pathname.replace('/image/upload/', `/image/upload/f_auto/q_auto/w_${maxWidth},c_limit/`);
  return url.toString();
}
