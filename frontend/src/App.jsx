import { useState } from "react";
import { reviewPDF, reviewText } from "./api";
import './App.css';

export default function App() {
  const [jobRole, setJobRole] = useState("Software Engineer");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("text"); // "text" or "pdf"

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      if (mode === "pdf" && file) {
        data = await reviewPDF(file, jobRole);
      } else if (mode === "text" && resumeText.trim()) {
        data = await reviewText(resumeText, jobRole);
      } else {
        setError("Please provide a resume — either upload a PDF or paste text.");
        setLoading(false);
        return;
      }
      setResult(data);
    } catch (err) {
      setError("Something went wrong. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>AI Resume Reviewer</h1>
          <p style={styles.subtitle}>
            Get instant AI feedback on your resume powered by Google Gemini
          </p>
        </div>

        {/* Job Role Selector */}
        <div style={styles.card}>
          <label style={styles.label}>Target Job Role</label>
          <select
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            style={styles.select}
          >
            <option>Software Engineer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Full Stack Developer</option>
            <option>Data Scientist</option>
            <option>Machine Learning Engineer</option>
            <option>Product Manager</option>
            <option>UI/UX Designer</option>
            <option>DevOps Engineer</option>
          </select>
        </div>

        {/* Mode Toggle */}
        <div style={styles.toggleRow}>
          <button
            onClick={() => setMode("text")}
            style={mode === "text" ? styles.toggleActive : styles.toggle}
          >
            Paste Text
          </button>
          <button
            onClick={() => setMode("pdf")}
            style={mode === "pdf" ? styles.toggleActive : styles.toggle}
          >
            Upload PDF
          </button>
        </div>

        {/* Text Input */}
        {mode === "text" && (
          <div style={styles.card}>
            <label style={styles.label}>Paste your resume text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume content here..."
              style={styles.textarea}
            />
          </div>
        )}

        {/* PDF Upload */}
        {mode === "pdf" && (
          <div style={styles.card}>
            <label style={styles.label}>Upload your resume PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={styles.fileInput}
            />
            {file && (
              <p style={styles.fileName}>Selected: {file.name}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={loading ? styles.btnDisabled : styles.btn}
        >
          {loading ? "Analyzing your resume..." : "Review My Resume"}
        </button>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Results */}
        {result && (
          <div>
            {/* Score Cards */}
            <h2 style={styles.sectionTitle}>Your Scores</h2>
            <div style={styles.scoreGrid}>
              {Object.entries(result.scores).map(([key, val]) => (
                <div key={key} style={styles.scoreCard}>
                  <p style={styles.scoreLabel}>{key.toUpperCase()}</p>
                  <p style={styles.scoreValue}>{val}<span style={styles.scoreMax}>/100</span></p>
                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${val}%`, background: val >= 70 ? "#10b981" : val >= 50 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <h2 style={styles.sectionTitle}>Summary</h2>
            <div style={styles.card}>
              <p style={styles.summaryText}>{result.summary}</p>
            </div>

            {/* Strengths */}
            <h2 style={styles.sectionTitle}>Strengths</h2>
            <div style={styles.card}>
              {result.strengths.map((s, i) => (
                <div key={i} style={styles.listItem}>
                  <span style={styles.greenDot} />
                  <p style={styles.listText}>{s}</p>
                </div>
              ))}
            </div>

            {/* Weaknesses */}
            <h2 style={styles.sectionTitle}>Weaknesses</h2>
            <div style={styles.card}>
              {result.weaknesses.map((w, i) => (
                <div key={i} style={styles.listItem}>
                  <span style={styles.redDot} />
                  <p style={styles.listText}>{w}</p>
                </div>
              ))}
            </div>

            {/* Rewrites */}
            <h2 style={styles.sectionTitle}>Suggested Rewrites</h2>
            {result.rewrites.map((r, i) => (
              <div key={i} style={styles.rewriteCard}>
                <div style={styles.rewriteSection}>
                  <span style={styles.rewriteBadgeRed}>Original</span>
                  <p style={styles.rewriteText}>{r.original}</p>
                </div>
                <div style={styles.rewriteArrow}>↓</div>
                <div style={styles.rewriteSection}>
                  <span style={styles.rewriteBadgeGreen}>Improved</span>
                  <p style={styles.rewriteText}>{r.improved}</p>
                </div>
                <div style={styles.rewriteReason}>
                  <strong>Why: </strong>{r.reason}
                </div>
              </div>
            ))}

            {/* Missing Keywords */}
            <h2 style={styles.sectionTitle}>Missing Keywords</h2>
            <div style={styles.card}>
              <div style={styles.keywordRow}>
                {result.keywords_missing.map((k, i) => (
                  <span key={i} style={styles.keyword}>{k}</span>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}


const styles = {
  // 1. Dark Background with Inter/Sans-serif font
  page: { 
    minHeight: "100vh", 
    background: "#0f111a", // Deep dark navy
    padding: "2rem 1rem", 
    fontFamily: "'Inter', sans-serif", 
    color: "#ffffff" 
  },
  container: { maxWidth: "720px", margin: "0 auto" },
  header: { textAlign: "center", marginBottom: "2.5rem" },
  
  // 2. Multi-color Title (White + Purple)
  title: { fontSize: "2.5rem", fontWeight: "800", color: "#ffffff", marginBottom: "0.5rem" },
  titleAccent: { color: "#6366f1" }, // Add this to your <span> in JSX
  subtitle: { color: "#94a3b8", fontSize: "1rem" },

  // 3. Glassmorphic Cards
  card: { 
    background: "#1a1d2b", // Slightly lighter than background
    border: "1px solid #2e3244", 
    borderRadius: "16px", 
    padding: "1.5rem", 
    marginBottom: "1.5rem",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)" 
  },
  
  label: { 
    display: "block", 
    fontSize: "12px", 
    fontWeight: "700", 
    color: "#94a3b8", 
    marginBottom: "0.75rem", 
    textTransform: "uppercase", 
    letterSpacing: "0.1em" 
  },

  // 4. Input Beautification
  select: { 
    width: "100%", 
    padding: "12px 16px", 
    borderRadius: "10px", 
    border: "1px solid #2e3244", 
    fontSize: "15px", 
    color: "#ffffff", 
    background: "#0f111a",
    outline: "none"
  },
  toggleRow: { display: "flex", gap: "10px", marginBottom: "1.5rem" },
  toggle: { 
    flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #2e3244", 
    background: "transparent", fontSize: "14px", fontWeight: "600", color: "#94a3b8", cursor: "pointer",
    transition: "0.2s"
  },
  toggleActive: { 
    flex: 1, padding: "12px", borderRadius: "10px", border: "1px solid #6366f1", 
    background: "rgba(99, 102, 241, 0.1)", fontSize: "14px", fontWeight: "600", color: "#6366f1", cursor: "pointer" 
  },

  textarea: { 
    width: "100%", minHeight: "220px", padding: "16px", borderRadius: "12px", 
    border: "1px solid #2e3244", fontSize: "14px", color: "#ffffff", 
    background: "#0f111a", resize: "vertical", boxSizing: "border-box", outline: "none" 
  },

  // 5. High-Impact Primary Button
  btn: { 
    width: "100%", 
    padding: "16px", 
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", 
    color: "#ffffff", 
    border: "none", 
    borderRadius: "12px", 
    fontSize: "16px", 
    fontWeight: "700", 
    cursor: "pointer", 
    marginBottom: "1.5rem",
    boxShadow: "0 4px 15px rgba(99, 102, 241, 0.4)",
    transition: "transform 0.2s ease"
  },
  btnDisabled: { 
    width: "100%", padding: "16px", background: "#2e3244", color: "#64748b", 
    border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700", cursor: "not-allowed" 
  },

  // 6. Result Dashboard Styling
  sectionTitle: { fontSize: "1.25rem", fontWeight: "700", color: "#ffffff", margin: "2rem 0 1rem" },
  scoreCard: { 
    background: "#1a1d2b", 
    border: "1px solid #2e3244", 
    borderRadius: "14px", 
    padding: "1.25rem",
    textAlign: "center"
  },
  scoreValue: { fontSize: "32px", fontWeight: "800", color: "#ffffff", marginBottom: "4px" },
  barBg: { height: "8px", background: "#0f111a", borderRadius: "99px", overflow: "hidden" },
  
  keyword: { 
    fontSize: "12px", 
    fontWeight: "600", 
    background: "rgba(99, 102, 241, 0.15)", 
    color: "#a5b4fc", 
    padding: "6px 14px", 
    borderRadius: "20px",
    border: "1px solid rgba(99, 102, 241, 0.3)" 
  },
};
