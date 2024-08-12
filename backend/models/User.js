import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
});

export default mongoose.model('User', userSchema);