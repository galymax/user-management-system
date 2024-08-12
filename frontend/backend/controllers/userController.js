import User from '../models/User.js';
import Role from '../models/Role.js';

export const createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('roles');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('roles');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignRoles = async (req, res) => {
    try {
        const userId = req.params.id;
        const roleIds = req.body.roles;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.roles = roleIds;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};