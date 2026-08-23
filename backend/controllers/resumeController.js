const Resume = require("../models/Resume");
const extractTextFromPDF = require("../services/pdfParser");
const analyzeResume = require("../services/resumeAnalyzer");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume",
      });
    }

    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const resumeText = await extractTextFromPDF(req.file.path);

    const analysis = analyzeResume(resumeText, jobDescription);

    const resume = await Resume.create({
      fileName: req.file.originalname,
      resumeText,

      skills: analysis.skills,

      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,

      experience: analysis.experience || "",
      education: analysis.education || "",

      jobDescription,

matchScore: analysis.matchScore,
justification: analysis.justification,
suggestions: analysis.suggestions || [],
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    res.status(500).json({
      message: "Failed to process resume",
      error: error.message,
    });
  }
};

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });

    res.status(200).json({
      resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);

    res.status(500).json({
      message: "Failed to fetch resumes",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getResumes,
};