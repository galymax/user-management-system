import express from 'express';
import { createRole, getRoles, deleteRole, assignPermissions } from '../controllers/roleController.js';

const router = express.Router();

router.post('/', createRole);
router.get('/', getRoles);
router.delete('/:id', deleteRole);
router.post('/:id/permissions', assignPermissions);

export default router;