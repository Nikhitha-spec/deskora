import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            gender: user.gender,
            location: user.location,
            bio: user.bio,
            phoneNumber: user.phoneNumber,
            company: user.company,
            jobTitle: user.jobTitle,
            assignedCategory: user.assignedCategory
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.gender = req.body.gender || user.gender;
        user.location = req.body.location || user.location;
        user.bio = req.body.bio || user.bio;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.company = req.body.company || user.company;
        user.jobTitle = req.body.jobTitle || user.jobTitle;
        
        // Only allow updating category if they are an agent or admin
        if (req.user.role === 'Agent' || req.user.role === 'Admin') {
            user.assignedCategory = req.body.assignedCategory || user.assignedCategory;
        }

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            gender: updatedUser.gender,
            location: updatedUser.location,
            bio: updatedUser.bio,
            phoneNumber: updatedUser.phoneNumber,
            company: updatedUser.company,
            jobTitle: updatedUser.jobTitle,
            assignedCategory: updatedUser.assignedCategory,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
