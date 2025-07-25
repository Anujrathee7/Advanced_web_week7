"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Access denied, missing token" });
    try {
        const verified = jsonwebtoken_1.default.verify(token, "dfd");
        req.email = verified;
        next();
    }
    catch (error) {
        return res.status(201).json({ message: error });
    }
};
exports.validateToken = validateToken;
