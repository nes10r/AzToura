import { Router } from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/event.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getEvents);
router.get('/:slug', getEvent);
router.post('/', authenticate, authorize('ADMIN'), createEvent);
router.patch('/:id', authenticate, authorize('ADMIN'), updateEvent);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteEvent);

export default router;
