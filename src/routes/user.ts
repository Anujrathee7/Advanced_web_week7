import { Router,Request, Response } from "express";
import {User,IUser} from "../models/User";
import { body, validationResult, Result, ValidationError } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";
import { validateToken } from "../middleware/validToken";

const router: Router = Router();

let users: any[] = [];



router.get('/user/list', async (req: Request, res: Response) => {
    try {
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' }); 
    }
});

// User registration route

router.post('/user/register',
    async (req: Request, res: Response) => {

    try {
        // Check if user already exists
        const { email, password } = req.body;
        console.log(req.body)
        const existingUser = users.find(u => u.email === email);
        
        
        if (existingUser) {
            return res.status(403).json({ message: 'User already exists' });
        }
        // Hash the password
        const salt: string = bcrypt.genSaltSync(10);
        const hash: string = bcrypt.hashSync(password, salt);

        const user = {email,password: hash}
        users.push(user);


        return res.status(200).json(user);

    }catch (error) {
    return res.status(500).json({ message: 'Server error' });
}});

router.post('/user/login',
    async (req: Request, res: Response) => {
    
    try{

        const { email, password } = req.body;
        const user = users.find(u => u.email === email);

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