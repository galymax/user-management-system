import express from 'express';
import { createPermission, getPermissions, deletePermission } from '../controllers/permissionController.js';

const router = express.Router();

router.post('/', createPermission);
router.get('/', getPermissions);
router.delete('/:id', deletePermission);

export default router;