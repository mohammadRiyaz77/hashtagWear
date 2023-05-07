const JWT = require("jsonwebtoken");
const userModel = require("../models/userModel");

//Protected Routers token base

const reqiureSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    ); // verify for compare and JWT found in header section
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
   
  }
};

//admin access 
const isAdmin = async (req,res,next)=>{
    try{
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            });
        }
        else{
            next();
        }
    }
    catch(error){
        res.status(401).send({
            success:false,
            message:"Error in admin middleware",
            error,
        })
    }
}

module.exports = { reqiureSignIn ,isAdmin};
