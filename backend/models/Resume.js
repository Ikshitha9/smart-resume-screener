const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    jobDescription: {
      type: String,
      required: true,
    },

    matchScore: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    justification: {
      type: String,
      default: "",
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);