import jwt from 'jsonwebtoken';
import db from '../../../knexfile.cjs'
export const projectAuthentication=async(req,res,next)=>{
    let token;
    if(req,Headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token=req.headers.authorization.spilit(' ')[1];
            const url=req.get('origin')
            const project=await db('Projects')
                .where({project_url:url})
                .first();
            if(!project){
                return res.status(401).json({message:"Project not registered"})
            }
            const decoded=jwt.verify(token,project.secret_key)
            req.project=project;
            req.user=decoded;
          
            return next();
        } catch (error) {
            console.error('Auth error: ',error.message)
            return res.status(401).json({message:'Unauthorized'})
        }
       
    }
    else{
        return res.status(401).json({message:'No token provided'})
    }
    
}