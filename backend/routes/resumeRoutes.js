const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadResume,
  getResumes,
} = require("../controllers/resumeController");

const router = express.Router();

router.post("/upload", upload.single("resume"), uploadResume);

router.get("/", getResumes);

module.exports = router;