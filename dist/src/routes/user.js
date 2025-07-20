"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validToken_1 = require("../middleware/validToken");
const router = (0, express_1.Router)();
router.get('/user/list', async (req, res) => {
    try {
        const users = await User_1.User.find();
        let formattedUsers = users.map(user => ({
            email: user.email,
            password: user.password
        }));
        return res.status(200).json(formattedUsers);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
// User registration route
router.post('/user/register', (0, express_validator_1.body)("email").isEmail().escape(), (0, express_validator_1.body)("password").isLength({ min: 3 }).escape(), async (req, res) => {
    // Validate request body
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check if user already exists
        const existingUser = await User_1.User.find({ email: req.body.email });
        console.log(existingUser);
        if (existingUser.length > 0) {
            return res.status(403).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        // Create new user
        const user = await User_1.User.create({
            email: req.body.email,
            password: hash
        });
        return res.status(201).json({ email: user.email, password: user.password });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
router.post('/user/login', (0, express_validator_1.body)("email").isEmail().escape(), (0, express_validator_1.body)("password").isLength({ min: 3 }).escape(), async (req, res) => {
    // Validate request body
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User_1.User.findOne({ email: req.body.email });
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
