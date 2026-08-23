import multer from 'multer';

// Storage configuration: Memory storage so files aren't persisted on disk
const storage = multer.memoryStorage();

// File filter: Allow only JPEG, PNG, and WebP images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Multer upload instance with 5MB file size limit
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
});

/**
 * Middleware wrapper to handle Multer upload errors gracefully.
 */
export const handleSingleImageUpload = (fieldname = 'image') => {
  const singleUpload = upload.single(fieldname);

  return (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'Image size exceeds maximum limit of 5 MB',
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Image upload error',
        });
      }
      next();
    });
  };
};

export default upload;
