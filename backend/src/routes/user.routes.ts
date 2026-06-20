import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser, updateUserRole } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN'), getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', authorize('ADMIN'), updateUserRole);

export default router;
