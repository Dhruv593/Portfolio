import { Router } from 'express';
import { env } from '../config/env.config.js';
import { dbService } from '../db/mongodb.js';
import { authenticateAdmin } from '../middleware/auth.middleware.js';
import { sendError, sendSuccess } from '../utils/apiResponse.js';
import { signCloudinaryUpload } from '../utils/cloudinarySignature.js';

const router = Router();

// Cloudinary signs these fields on the server. The API secret never reaches the browser.
router.post('/sign', authenticateAdmin, (_req, res) => {
  if (!dbService.getDb()) {
    return sendError(res, 'MongoDB must be connected before uploading images.', 503);
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return sendError(res, 'Cloudinary upload is not configured on the server.', 503);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'portfolio';
  const signature = signCloudinaryUpload({ folder, timestamp }, CLOUDINARY_API_SECRET);

  return sendSuccess(res, {
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});

export default router;
