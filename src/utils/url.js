/**
 * Forces a download of a Cloudinary URL by adding fl_attachment.
 */
export const getSecureDownloadUrl = (url) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      // Add fl_attachment flag to force browser download
      return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
    }
  }
  return url;
};
