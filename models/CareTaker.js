const mongoose = require("mongoose");

const careTakerSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    number:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:true
    }
})

const CareTaker = mongoose.model("CareTaker",careTakerSchema);

module.exports = CareTaker;