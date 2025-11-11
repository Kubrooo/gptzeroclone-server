import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const register = async (req, res, next) => {
    try{
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser){
            return res.status(400).json({
                error: 'User already exists with this email or username'
            });
        }

        // Create user
        const user = new User({ username, email, password });
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                error: 'Invalid Credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid Credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login Successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try{
        res.json({
            user:{
                id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    } catch (error) {
        next(error);
    }
};