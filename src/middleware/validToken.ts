import { Request, Response, NextFunction } from "express";
import jwt,{ JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request{
    email?: JwtPayload
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction)=>{
    const token: string | undefined = req.header("authorization")?.split(" ")[1]
    
    if(!token) return res.status(401).json({message: "Access denied, missing token"}) 
        
    try{

        const verified: JwtPayload = jwt.verify(token, "dfd") as JwtPayload
        req.email = verified
        next()

    }catch(error:any){
        return res.status(201).json({message: error})
    }
}