const jwt = require('jsonwebtoken');
const jose = require('jose');
const User = require('../models/User');

const alg = 'A256KW';
const enc = 'A256GCM';


const generateToken = async (user) => {
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const secret = jose.base64url.decode(process.env.JWE_ENCRYPTION_KEY);
    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(token))
        .setProtectedHeader({ alg, enc })
        .encrypt(secret);
    return jwe;
};


const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const secret = jose.base64url.decode(process.env.JWE_ENCRYPTION_KEY);
        const { plaintext } = await jose.compactDecrypt(token, secret);
        const decodedToken = new TextDecoder().decode(plaintext);
        const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) return res.status(401).json({ message: 'User not found' });
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

module.exports = { generateToken, protect, admin };
