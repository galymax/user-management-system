import express from 'express';
import { createRole, getRoles, deleteRole, assignPermissions, getRole } from '../controllers/roleController.js';

const router = express.Router();

router.post('/', createRole);
router.get('/', getRoles);
router.get('/:id', getRole);
router.delete('/:id', deleteRole);
router.post('/:id/permissions', assignPermissions);

export default router;