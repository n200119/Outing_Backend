const express = require("express");
const { careTakerRegister, careTakerLogin, getAllCareTakers, getCareTakerById, getCareTakerByIdForStudent } = require("../controllers/careTakerController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register",careTakerRegister);
router.post("/login",careTakerLogin);
router.get("/all-careTakers",getAllCareTakers);
router.get("/singleCareTaker",authMiddleware,getCareTakerById);
router.get("/:Id",authMiddleware,getCareTakerByIdForStudent);



module.exports = router;