const analyzeResume = (resumeText, jobDescription) => {
  const text = resumeText.toLowerCase();
  const jobText = jobDescription.toLowerCase();

  const skills = [
    "javascript",
    "typescript",
    "java",
    "python",
    "c++",
    "react",
    "node.js",
    "express.js",
    "mongodb",
    "mysql",
    "postgresql",
    "sql",
    "html",
    "css",
    "rest api",
    "git",
    "github",
    "docker",
    "aws",
  ];

  const containsSkill = (text, skill) => {
    if (skill === "rest api") {
      return (
        /\brest\s*api\b/i.test(text) ||
        /\brestful\s*api(s)?\b/i.test(text)
      );
    }

    const escapedSkill = skill.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const pattern = new RegExp(`\\b${escapedSkill}\\b`, "i");

    return pattern.test(text);
  };

  // Resume skills
  const resumeSkills = skills.filter((skill) =>
    containsSkill(text, skill)
  );

  // Skills required by job
  const requiredSkills = skills.filter((skill) =>
    containsSkill(jobText, skill)
  );

  // Matching skills
  const matchedSkills = requiredSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  // Missing skills
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill)
  );

  // Match score
  let matchScore = 1;

  if (requiredSkills.length > 0) {
    matchScore = Math.round(
      (matchedSkills.length / requiredSkills.length) * 10
    );

    matchScore = Math.max(1, Math.min(10, matchScore));
  }

  // Extract experience/projects
  let experience = "";

  const experienceMatch = resumeText.match(
    /Projects([\s\S]*?)(?=Technical Skills|Education|Certifications|$)/i
  );

  if (experienceMatch) {
    experience = experienceMatch[0].trim();
  }

  // Extract education
  let education = "";

  const educationMatch = resumeText.match(
    /Education([\s\S]*?)(?=Certifications|$)/i
  );

  if (educationMatch) {
    education = educationMatch[0].trim();
  }

  // Generate suggestions
  const suggestions = [];

  // Missing skill suggestions
  if (missingSkills.length > 0) {
    suggestions.push(
      `Consider adding or gaining experience with: ${missingSkills.join(
        ", "
      )}.`
    );
  } else {
    suggestions.push(
      "Your resume covers all the required technical skills for this job."
    );
  }

  // Project suggestions
  if (experience) {
    suggestions.push(
      "Add measurable results to your project descriptions, such as performance improvements, number of users, or features completed."
    );
  } else {
    suggestions.push(
      "Add relevant projects or practical experience to strengthen your resume."
    );
  }

  // GitHub suggestion
  if (!text.includes("github")) {
    suggestions.push(
      "Add a GitHub profile or project links so recruiters can review your work."
    );
  }

  // REST API suggestion
  if (
    requiredSkills.includes("rest api") &&
    text.includes("rest")
  ) {
    suggestions.push(
      "Highlight your REST API work more clearly by mentioning specific APIs, endpoints, or backend functionality you implemented."
    );
  }

  // General resume suggestion
  suggestions.push(
    "Keep your resume concise and use strong action verbs such as developed, implemented, designed, and optimized."
  );

  // Justification
  const justification = `
The resume matches ${matchedSkills.length} out of ${
    requiredSkills.length
  } required skills.

Matched skills: ${
    matchedSkills.length > 0 ? matchedSkills.join(", ") : "None"
  }.

Missing skills: ${
    missingSkills.length > 0 ? missingSkills.join(", ") : "None"
  }.
`.trim();

  return {
    skills: resumeSkills,
    matchedSkills,
    missingSkills,
    experience,
    education,
    matchScore,
    justification,
    suggestions,
  };
};

module.exports = analyzeResume;