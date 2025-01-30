// Get the API URL from environment variable or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '';
  
  // If the image path is already a full URL, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Otherwise, construct the full URL
  return `${API_URL}${imagePath}`;
};
