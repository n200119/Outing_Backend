const Student = require("../models/Student");
const CareTaker = require("../models/CareTaker");
const dotEnv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotEnv.config();

const emailRegex = /^[nN]\d{6}@rguktn\.ac\.in$/;

const studentRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email is not valid" });
        }

        const student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Student({
            name,
            email,
            password: hashedPassword
        });

        await newStudent.save();
        res.status(201).json({ message: "User registered successfully" });
        console.log("User registered successfully");
    } catch (error) {
        console.log(`Error at student register: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email format
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Email is not valid" });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ message: "No user found" });
        }

        const comparison = await bcrypt.compare(password, student.password);
        if (!comparison) {
            return res.status(400).json({ message: "Password didn't match" });
        }

        const token = jwt.sign(
            { mainEmail: student.email },
            process.env.WHATISYOURNAME,
            { expiresIn: "1h" }
        );
        res.status(200).json({ success: "Login Successful", token });
        console.log(email, "this is token:", token);
    } catch (error) {
        console.log(`Error at student login: ${error}`);
        res.status(500).json({ message: `${error}` });
    }
}


const getAllStudents = async (req, res) => {
    try {
        // Retrieve all students from the database
        const students = await Student.find().populate('outings'); // Optionally populate outings if needed

        // Check if there are no students found
        if (!students.length) {
            return res.status(404).json({ message: "No students found" });
        }

        // Return the list of students
        res.status(200).json({ students });
    } catch (error) {
        console.log(`Error at getting students: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getStudentById = async (req, res) => {
    try {
      const { id } = req.params; // `id` refers to studentId
  
      const student = await Student.findById(id);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.status(200).json({student});
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = { studentRegister, studentLogin, getAllStudents,getStudentById };
