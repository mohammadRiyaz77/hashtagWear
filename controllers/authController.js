const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const { hashPassword, comparePassword } = require("../utils/authUtil");
const JWT = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address ,answer} = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is reqiured" });
    }
    if (!email) {
      return res.send({ message: "Email is reqiured" });
    }
    if (!password) {
      return res.send({ message: "Password is reqiured" });
    }
    if (!phone) {
      return res.send({ message: "Phone  number is reqiured" });
    }
    if (!address) {
      return res.send({ message: "Address is reqiured" });
    }
    if (!answer) {
      return res.send({ message: "Answer is reqiured" });
    }
    //check user
    const existingUser = await userModel.findOne({ email });
    //check for existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register plesse login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer
    }).save();
    res.status(201).send({
      success: true,
      message: "User register succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registraiton",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      //validation
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role:user.role
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//forgotPasswordController
const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is reqiured" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is reqiured" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is reqiured" });
    }
    //check 
    const user = await userModel.findOne({email,answer})
    //validation
    if(!user){
      return res.status(404).send({
        success:false,
        message:"Wrong Email or Answer.."
      })
    }
    const hashed =await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
      success:true,
      message:"Password Reset Successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong..",
      error,
    });
  }
};

//test controler
const testController = (req, res) => {
  console.log("Protected Routes");
  res.send("Routes");
};

//update profile
const updateProfileController  = async(req,res)=>{
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
}

//orders
const getOrderController =async (req,res)=>{
  try{
    const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
    res.json(orders)

  }
  catch(error){
    console.log(error);
    res.status(500).send({

      success:false,
      message:"Error while getting orders",
      error
    })
  }

}

const getAllOrderController = async(req,res)=>{
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }

}

//order status 
const orderStatusController = async(req,res)=>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
}

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrderController,
  getAllOrderController,
  orderStatusController
};
