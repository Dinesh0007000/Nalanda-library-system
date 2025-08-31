const validator = require('validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid input data' });
    }
    try {
        const existingAdmin = await User.findOne({ role: 'Admin' });
        if (role === 'Admin' && existingAdmin) {
            return res.status(400).json({ message: 'Only one Admin is allowed' });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        user = new User({ name, email, password, role: role || 'Member' });
        await user.save();
        const token = await generateToken(user);
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Invalid input' });
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = await generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
