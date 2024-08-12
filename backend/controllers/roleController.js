import Role from '../models/Role.js';

export const createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id).populate('permissions');
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignPermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;
        const role = await Role.findById(id);
        if (!role) return res.status(404).json({ message: 'Role not found' });

        role.permissions = permissions;
        await role.save();

        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};