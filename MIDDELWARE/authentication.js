const jwt=require('jsonwebtoken');
async function isAuthenticate(req,res,next){
    try {
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({message:"user not autheticated"})
        }
        const decode=await jwt.verify(token,process.env.JWT_SECRET)
        console.log(decode)
        if(!decode){
            return res.status(401).json({message:"Invalid token"})
        }
        req.id=decode.UserId;
        next();
    } catch (error) {
      console.log(error)

    }
}
module.exports={
    isAuthenticate
}
////authentication