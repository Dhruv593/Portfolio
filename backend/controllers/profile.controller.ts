import { Request, Response } from 'express';
import { profileService } from '../services/profile.service';
import { sendSuccess, sendError } from '../utils/apiResponse';

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.getProfile();
      return sendSuccess(res, { profile });
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to fetch profile');
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const profile = await profileService.updateProfile(req.body);
      return sendSuccess(res, { profile }, 200, 'Profile updated successfully');
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to update profile');
    }
  }
}

export const profileController = new ProfileController();
