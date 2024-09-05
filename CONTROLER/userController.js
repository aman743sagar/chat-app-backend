const User = require('../MODEL/Usermodel');
let bcrypt=  require('bcrypt')
const jwt=require('jsonwebtoken');



async function register(req, res){
    try {
        const {fullName,username,pasword,confirmPassword,gender}= req.body;
        if(!fullName || !username || !pasword || !confirmPassword || !gender){
            return res.status(400).json({message:"All filed are required"});
        }
        if(pasword !== confirmPassword){
            return res.status(400).json({message:"Password is not valid"})
        }
        const user =await User.findOne({username});
        console.log(req.body);

        if(user){
            return res.status(400).json({message:"user already exist"})
        }
        const handelPassword=await bcrypt.hash(pasword,10);
        const maleProfilePhoto=`https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePhoto=`https://avatar.iran.liara.run/public/girl?username=${username}`;
        await User.create({
            fullName,
            username,
            pasword:handelPassword,
            profilePhoto: gender==="male" ?maleProfilePhoto:femaleProfilePhoto,
            gender
        })
        return res.status(200).json({
            message:"Succefullu",
            success:true
        })

    } catch (error) {
         console.log(error)
    }
}
async function login(req, res){
    try {
        const {username,pasword}=req.body;
        if( !username || !pasword ){
            return res.status(400).json({message:"All filed are required"});
        }
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).json({
                message:"incorrect username or password",
                success:false
            })
        }
        const isPassword=await bcrypt.compare(pasword,user.pasword)
        if(!isPassword){
            return res.status(400).json({
                message:"Incorect username or password",
                success:false
            })
        };
        const tokenData={
            UserId:user._id
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const token=await jwt.sign(tokenData, jwtSecret, {expiresIn:'1d'});
        return res.status(200).cookie("token",token,{maxAge:24*60*60*1000, httpOnly:true}).json({
            _id:user._id,
            username:user.username,
            fullName:user.fullName,
            profilePhoto:user.profilePhoto

        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "An error occurred", success: false });
    }

}

function logout(req,res){
      try {
         return res.status(200).cookie("tooken","",{maxAge:0}).json({
            message:"user logged out"
         })
      } catch (error) {
        console.log(error)

      }
}

async function getotherouser(req,res){
    try {
        const loggedInUserid=req.id
        const otherUsers=await User.find({_id:{$ne:loggedInUserid}}).select("-pasword")
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    register,
    login,
    logout,
    getotherouser
}