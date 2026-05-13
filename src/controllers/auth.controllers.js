const userModel = require("../models/user.models")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

async function registerUser(req, res){
    const{username, email, passward } = req.body;

    const isuserAlreadyexits = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })
    if(isuserAlreadyexits){
        return res.status(409).json({
            message: "User Already Exist"
        })
    }

    const hash = await bcrypt.hash(passward, 10);
    const user = await userModel.create({
        username,
        email,
        passward :hash
    })

    const token = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET)

    res.cookie("token",token);
    
    res.status(201).json({
        message:"user created Successfully",
        token: token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            passward:user.passward
        }
    })
}

async function loginUser(req, res) {
  const { email, passward } = req.body;  // match what frontend sends

  const user = await userModel.findOne({ email });  // find by email only

  if (!user) {
    return res.status(401).json({ message: "Invalid Craditaianls" });
  }

  const isPasswardValid = await bcrypt.compare(passward, user.passward);

  if (!isPasswardValid) {
    return res.status(401).json({ message: "Invalid Craditaianls" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);

  res.status(200).json({
    message: "You Login Successfully",
    token,
    user: { id: user._id, username: user.username, email: user.email }
  });
}



module.exports = {registerUser, loginUser}