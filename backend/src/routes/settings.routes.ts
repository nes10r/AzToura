import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { Role } from '@prisma/client';
import {
  getSiteSettings, updateSiteSettings,
  getThemeSettings, updateThemeSettings,
  getMediaFiles, createMediaFile, deleteMediaFile,
  getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem,
  getAuditLogs,
} from '../controllers/settings.controller';

const router = Router();

// Public
router.get('/theme', getThemeSettings);
router.get('/menus', getMenuItems);
router.get('/site', getSiteSettings);

// Admin only
router.use(authenticate, authorize(Role.ADMIN));
router.put('/site',                  updateSiteSettings);
router.put('/theme',                 updateThemeSettings);
router.get('/media',                 getMediaFiles);
router.post('/media',                createMediaFile);
router.delete('/media/:id',          deleteMediaFile);
router.post('/menus',                createMenuItem);
router.put('/menus/:id',             updateMenuItem);
router.delete('/menus/:id',          deleteMenuItem);
router.get('/audit-logs',            getAuditLogs);

export default router;
