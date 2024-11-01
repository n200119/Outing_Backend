const CareTaker = require("../models/CareTaker");
const dotEnv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotEnv.config();

const careTakerRegister = async (req,res)=>{
    try {
        const {name,email,number,password} = req.body;
    const careTaker = await CareTaker.findOne({email});
    if(careTaker)
    {
        return res.status(400).json({message:"caretaker already exists"});
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const newCareTaker =new CareTaker({
        name,
        email,
        number,
        password:hashedPassword
    });

    await newCareTaker.save();
    res.status(201).json({message:"user registered successfully"});
    console.log("user registered successfully");
    } catch (error) {
        console.log(`err at careTaker register:${error}`);
        res.status(500).json({ error: "internal server error" });
    }
}

const careTakerLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
    const careTaker = await CareTaker.findOne({email});
    if(!careTaker)
    {
        return res.status(400).json({message:"no user found"});
    }
    const comparison = await bcrypt.compare(password,careTaker.password);
    if(!comparison)
    {
        return res.status(400).json({message:"password dint match"});
    }
    const token = await jwt.sign(
        { mainEmail: careTaker.email},
        process.env.WHATISYOURNAME,
        { expiresIn: "1h" }
      );
      res.status(200).json({ success: "Login Successfull", token });
      console.log(email, "this is token:", token);
    } catch (error) {
        console.log(`error at careTaker login:${error}`);
        res.status(500).json({ message: `${error}` }); 
    }
}

const getAllCareTakers = async (req,res)=>{
    try {
        const careTakers = await CareTaker.find()
        if(!careTakers)
        {
            return res.status(400).json({message:"no careTakers found"});
        }
        res.status(201).json(careTakers);
    } catch (error) {
        console.log(`error at careTaker login:${error}`);
        res.status(500).json({ message: `${error}` });
    }
}

const getCareTakerById = async (req, res) => {
    try {
        const caretakerEmail = req.mainEmail;
      
        // Find the student by email
        const maincaretaker = await CareTaker.findOne({ email: caretakerEmail });
        
        if (!maincaretaker) {
            return res.status(404).json({ message: 'caretaker not found' });
        }
  
        const careTakerId = maincaretaker._id;
      if (!careTakerId) {
        return res.status(401).json("no id is given");
      }
  
      const careTaker = await CareTaker.findById(careTakerId);
  
      if (!careTaker) {
        return res.status(401).json("no careTaker is present with given id");
      }
  
      res.status(200).json({ careTaker });

    } catch (error) {
      console.log(`error at single careTaker getting:${error}`);
      res.status(500).json("internal server error");
    }
  };

  const getCareTakerByIdForStudent = async (req, res) => {
    try {
  
        const {Id} = req.params;
        const careTakerId = Id;
      if (!careTakerId) {
        return res.status(401).json("no id is given");
      }
  
      const careTaker = await CareTaker.findById(careTakerId);
  
      if (!careTaker) {
        return res.status(401).json("no careTaker is present with given id");
      }
  
      res.status(200).json({ careTaker });

    } catch (error) {
      console.log(`error at single careTaker getting:${error}`);
      res.status(500).json("internal server error");
    }
  };

module.exports ={careTakerRegister,careTakerLogin,getAllCareTakers,getCareTakerById,getCareTakerByIdForStudent};