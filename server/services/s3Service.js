import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName, getS3Config } from '../config/s3.js';

/**
 * Get S3 public object URL for a given storage key.
 */
export const getS3Url = (key) => {
  if (!key) return '';
  const { region, bucketName } = getS3Config();
  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

/**
 * Upload an image buffer to AWS S3.
 * @param {Object} options
 * @param {Buffer} options.buffer - Image binary buffer
 * @param {string} options.key - Object key (e.g. 'foods/aloo-gobhi.webp')
 * @param {string} options.contentType - MIME type (e.g. 'image/webp')
 * @returns {Promise<{ url: string, key: string }>}
 */
export const uploadImageToS3 = async ({ buffer, key, contentType }) => {
  if (!buffer || !key) {
    throw new Error('Buffer and key are required for S3 upload');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType || 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3Client.send(command);

  const url = getS3Url(key);
  return { url, key };
};

/**
 * Delete an object from AWS S3 by key.
 * @param {string} key - Object key (e.g. 'foods/aloo-gobhi.webp')
 * @returns {Promise<boolean>}
 */
export const deleteImageFromS3 = async (key) => {
  if (!key || !key.trim()) {
    return true;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key.trim(),
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.warn(`[S3 Service Warning] Failed to delete object key '${key}':`, error.message);
    return false;
  }
};
