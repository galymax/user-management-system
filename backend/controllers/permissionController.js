import Permission from '../models/Permission.js';

export const createPermission = async (req, res) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        res.status(201).json(permission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePermission = async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Permission not found' });
        res.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};