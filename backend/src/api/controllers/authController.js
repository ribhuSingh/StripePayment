// import User from "../models/User.js";
// import jwt from 'jsonwebtoken';
// import { JWT_SECRET } from "../config.js";

// const generateToken=(id)=>{
//     return jwt.sign({id},JWT_SECRET,{
//         expiresIn:'30d'
//     })
// }

// export const registerUser= async(req,res)=>{
    
//     try {
//         const {username,email,password}=req.body;
        
//         const userExists=await User.findOne({email});
//         if(userExists){
//             return res.status(400).json({error:'User already exists with this email'})
//         }
//         const usernameExists=await User.findOne({username});
//         if(usernameExists){
//             return res.status(400).json({error:'Username already taken'});
//         }
//         const user=await User.create({
//             username,
//             email,
//             password,
//         });
//         if(user){
//             res.status(201).json({
//                 _id:user._id,
//                 username:user.username,
//                 email:user.email,
//                 role:user.role,
//                 team:user.team,
//                 token:generateToken(user._id),
//             })
//         }
//         else{
//             res.status(400).json({error:'Invalid user data'})
//         }

        
        
//     } catch (error) {
//         res.status(500).json({err:error.message || 'Server error'})
//     }
// }
// export const loginUser=async(req,res)=>{
//     try{
//         const {email,password}=req.body;
//         const user=await User.findOne({email});
//         if(user && (await user.matchPassword(password))){
//             res.json({
//                 _id:user._id,
//                 username:user.username,
//                 email:user.email,
//                 role:user.role,
//                 team:user.team,
//                 token:generateToken(user._id),
//             })
//         }
//         else{
//             res.status(401).json({error:'Invalid email or password'})
//         }
//     }
//     catch(err){
//         res.status(500).json({error:err.message || 'Server error'})
//     }
// }
