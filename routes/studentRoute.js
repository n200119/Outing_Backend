const express = require("express");
const { studentRegister, studentLogin, getAllStudents, getStudentById } = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register",studentRegister);
router.post("/login",studentLogin);
router.get("/all-students",authMiddleware,getAllStudents);
router.get("/:id",authMiddleware,getStudentById);
module.exports = router;