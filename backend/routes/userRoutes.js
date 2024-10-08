import express from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser, assignRoles } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/roles', assignRoles);

export default router;