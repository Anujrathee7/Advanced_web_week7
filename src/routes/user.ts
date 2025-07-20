import { Router,Request, Response } from "express";
import {User,IUser} from "../models/User";
import { body, validationResult, Result, ValidationError } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";
import { validateToken } from "../middleware/validToken";

const router: Router = Router();


router.get('/user/list', async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find();

        let formattedUsers = users.map(user => ({
            email: user.email,
            password: user.password
        }));

        return res.status(200).json(formattedUsers);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' }); 
    }
});

// User registration route

router.post('/user/register',body("email").isEmail().escape(),
    body("password").isLength({min: 3}).escape(),
    async (req: Request, res: Response) => {

    // Validate request body
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if user already exists
        const existingUser = await User.find({ email: req.body.email });
        console.log(existingUser);
        if (existingUser.length > 0) {
            return res.status(403).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(req.body.password, salt);

        // Create new user
        const user: IUser = await User.create({
            email: req.body.email,
            password: hash
        })

        return res.status(201).json({email: user.email, password: user.password});

    }catch (error) {
    return res.status(500).json({ message: 'Server error' });
}});

router.post('/user/login', body("email").isEmail().escape(),
    body("password").isLength({min: 3}).escape(),
    async (req: Request, res: Response) => {
    // Validate request body
    const errors: Result<ValidationError> = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try{

        const user: IUser | null = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        if(bcrypt.compareSync(req.body.password, user.password)) {
            // Generate JWT token
            const JwtPayload: JwtPayload = {
                email: user.email}
            
            const token: string = jwt.sign(JwtPayload,"dfd", { expiresIn: '1h' });

            return res.status(200).json({success: true, token:token});
        } 

        return res.status(401).json({ message: 'Invalid password' });

        

    }catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/private',validateToken,(req: Request, res: Response)=>{
    res.status(200).json({message:"This is protected secure route!"})
})

export default router;