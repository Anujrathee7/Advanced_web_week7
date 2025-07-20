"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validToken_1 = require("../middleware/validToken");
const router = (0, express_1.Router)();
let users = [];
router.get('/user/list', async (req, res) => {
    try {
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
// User registration route
router.post('/user/register', async (req, res) => {
    try {
        // Check if user already exists
        const { email, password } = req.body;
        console.log(req.body);
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(password, salt);
        const user = { email, password: hash };
        users.push(user);
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.post('/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        if (bcrypt_1.default.compareSync(req.body.password, user.password)) {
            // Generate JWT token
            const JwtPayload = {
                email: user.email
            };
            const token = jsonwebtoken_1.default.sign(JwtPayload, "dfd", { expiresIn: '1h' });
            return res.status(200).json({ success: true, token: token });
        }
        return res.status(401).json({ message: 'Invalid password' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.get('/private', validToken_1.validateToken, (req, res) => {
    res.status(200).json({ message: "This is protected secure route!" });
});
exports.default = router;
