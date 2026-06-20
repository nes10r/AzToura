import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/image.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.post('/upload', authenticate, authorize('ADMIN'), uploadImage);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteImage);

export default router;
