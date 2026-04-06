import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Agent', 'User'],
        default: 'User',
    },
    gender: {
        type: String,
    },
    location: {
        type: String,
    },
    bio: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    company: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    assignedCategory: { // For Agents routing
        type: String,
        enum: ['billing', 'technical', 'general', null],
        default: null
    }
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
