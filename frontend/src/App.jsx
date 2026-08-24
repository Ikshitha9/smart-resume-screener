import { useState } from "react";
import "./App.css";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!resume) {
      setMessage("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setMessage("Please enter the job description.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/resumes/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      setResult(data.resume);
      setMessage("Resume analyzed successfully!");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">✦</span>
          Smart Resume Screener
        </div>

        <p className="header-subtitle">
          AI-powered resume analysis and job matching
        </p>
      </header>

      <main className="main">

        {/* Hero */}
        <section className="hero">
          <p className="badge">AI-POWERED RECRUITMENT</p>

          <h1>
            Find your
            <span> perfect job match.</span>
          </h1>

          <p className="hero-text">
            Upload your resume and provide a job description to discover how
            well your skills match the role.
          </p>
        </section>

        {/* Upload + Job Description */}
        <section className="card-container">

          {/* Resume Upload */}
          <div className="card">
            <h2>1. Upload your resume</h2>

            <p className="card-description">
              Upload your resume in PDF format.
            </p>

            <label className="upload-box">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />

              <div className="upload-icon">↑</div>

              {resume ? (
                <>
                  <strong>{resume.name}</strong>
                  <small>Resume selected successfully</small>
                </>
              ) : (
                <>
                  <strong>Click to upload your resume</strong>
                  <small>PDF files only</small>
                </>
              )}
            </label>
          </div>

          {/* Job Description */}
          <div className="card">
            <h2>2. Job description</h2>

            <p className="card-description">
              Paste the job description you want to match against.
            </p>

            <textarea
              className="job-input"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

        </section>

        {/* Analyze */}
        <div className="analyze-section">
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume →"}
          </button>

          {message && <p className="message">{message}</p>}
        </div>

        {/* Results */}
        {result && (
          <section className="results">

            <div className="results-header">
              <p className="results-label">ANALYSIS COMPLETE</p>
              <h2>Resume Analysis</h2>
              <p>
                Here's how your resume matches the selected job description.
              </p>
            </div>

            {/* Score + Quick Summary */}
            <div className="results-top">

              <div className="result-card score-card">
                <p className="result-label">MATCH SCORE</p>

                <div className="score">
                  {result.matchScore}
                  <span>/10</span>
                </div>

                <p className="score-description">
                  Overall compatibility with the job
                </p>
              </div>

              <div className="result-card summary-card">
                <p className="result-label">SKILL SUMMARY</p>

               <div className="summary-number">
  {result.matchedSkills?.length || 0}
  <span>
    / {(result.matchedSkills?.length || 0) + (result.missingSkills?.length || 0)}
  </span>
</div>

                <p className="score-description">
                  Required skills matched
                </p>
              </div>

            </div>

            {/* Skill Analysis */}
            <div className="result-card">

              <div className="section-title">
                <div className="section-icon">✓</div>
                <div>
                  <h3>Skill Analysis</h3>
                  <p>Skills identified from your resume and job description.</p>
                </div>
              </div>

              <div className="skill-section">

                <h4 className="skill-heading matched-heading">
                  ✓ Matched Skills
                </h4>

                <div className="skills-list">
                  {result.matchedSkills &&
                  result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill, index) => (
                      <span
                        className="skill-badge matched-badge"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="no-skills">
                      No matching skills found.
                    </p>
                  )}
                </div>

              </div>

              <div className="skill-section">

                <h4 className="skill-heading missing-heading">
                  ✕ Missing Skills
                </h4>

                <div className="skills-list">
                  {result.missingSkills &&
                  result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill, index) => (
                      <span
                        className="skill-badge missing-badge"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="no-skills">
                      No missing skills. Great match!
                    </p>
                  )}
                </div>

              </div>

            </div>

            {/* Experience */}
            <div className="result-card">

              <div className="section-title">
                <div className="section-icon">💼</div>

                <div>
                  <h3>Experience</h3>
                  <p>Projects and practical experience found in your resume.</p>
                </div>
              </div>

              {result.experience ? (
                <div className="result-text experience-text">
                  {result.experience}
                </div>
              ) : (
                <p className="empty-result">
                  No experience information detected.
                </p>
              )}

            </div>

            {/* Education */}
            <div className="result-card">

              <div className="section-title">
                <div className="section-icon">🎓</div>

                <div>
                  <h3>Education</h3>
                  <p>Academic information extracted from your resume.</p>
                </div>
              </div>

              {result.education ? (
                <div className="result-text education-text">
                  {result.education}
                </div>
              ) : (
                <p className="empty-result">
                  No education information detected.
                </p>
              )}

            </div>

            {/* Analysis */}
            <div className="result-card analysis-card">

              <div className="section-title">
                <div className="section-icon">✦</div>

                <div>
                  <h3>Analysis</h3>
                  <p>Summary of your resume's compatibility.</p>
                </div>
              </div>

              <div className="analysis-text">
                {result.justification}
              </div>

            </div>

          </section>
        )}
{/* AI Suggestions */}
{result && result.suggestions && result.suggestions.length > 0 && (
  <section className="suggestions-section">
    <div className="suggestions-card">
      <div className="section-title">
        <div className="section-icon">★</div>

        <div>
          <h3>AI Suggestions</h3>
          <p>Personalized recommendations to improve your resume.</p>
        </div>
      </div>

      <div className="suggestions-list">
        {result.suggestions.map((suggestion, index) => (
          <div className="suggestion-item" key={index}>
            <span className="suggestion-number">
              {index + 1}
            </span>

            <p>{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
        {/* Features */}
        <section className="features">

          <div>
            <div className="feature-icon">%</div>
            <h3>Match Score</h3>
            <p>See how closely your resume matches the job.</p>
          </div>

          <div>
            <div className="feature-icon">✓</div>
            <h3>Skill Analysis</h3>
            <p>Identify your matching and missing skills.</p>
          </div>

          <div>
            <div className="feature-icon">★</div>
            <h3>AI Suggestions</h3>
            <p>Get recommendations to improve your resume.</p>
          </div>

        </section>

      </main>

      <footer>
        <p>Smart Resume Screener • AI-powered career analysis</p>
      </footer>

    </div>
  );
}

export default App;