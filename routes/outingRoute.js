const express = require("express");
const { createOuting, getAllOuting, getOutingsByStudentId, updateOutingDetails, getLatestOuting, cancelOuting } = require("../controllers/outingController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express();

router.post("/create",authMiddleware,createOuting);
router.get("/all-outings",authMiddleware,getAllOuting);
router.get("/student",authMiddleware,getOutingsByStudentId);
router.put("/:id/update",authMiddleware,updateOutingDetails);
router.get("/latestOuting",authMiddleware,getLatestOuting);
router.delete("/cancel/:id",authMiddleware,cancelOuting);

module.exports = router;