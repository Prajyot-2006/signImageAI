import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzedImageKey, setAnalyzedImageKey] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageKey = `${file.name}-${file.size}-${file.lastModified}`;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult("");
    setAnalyzedImageKey(null);
  };

  const analyzeImage = async () => {
    if (!image) return;

    // Prevent another API request for the same image
    const imageKey = `${image.name}-${image.size}-${image.lastModified}`;

    if (analyzedImageKey === imageKey) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.result);
      setAnalyzedImageKey(imageKey);
    } catch (error) {
      console.error(error);
      setResult("Unable to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  const extractResult = (label, nextLabel) => {
    if (!result) return "Not available";

    const regex = nextLabel
      ? new RegExp(`${label}\\s*(.*?)(?=\\s*${nextLabel})`, "is")
      : new RegExp(`${label}\\s*(.*)`, "is");

    return result.match(regex)?.[1]?.trim() || "Not available";
  };

  const possibleSign =
    extractResult("Possible Sign:", "Meaning:") || "Unknown";

  const meaning =
    extractResult("Meaning:", "What the person is communicating:") ||
    "Not available";

  const communication =
    extractResult("What the person is communicating:", null) ||
    "Not available";

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">✦</span>
          <span>Sign Image AI</span>
        </div>

        <div className="ai-badge">
          <span>✦</span>
          AI Powered
        </div>
      </header>

      {/* HERO */}
      <section className="hero">

        <div className="eyebrow">
          SIGN LANGUAGE <span>•</span> AI VISION
        </div>

        <h1>
          Understand Sign Language
          <span>Through Images</span>
        </h1>

        <p className="hero-description">
          Upload a sign-language gesture and let AI identify its
          possible meaning and what the person is communicating.
        </p>

        {/* FEATURE ROW */}
        <div className="feature-row">

          <div className="feature">
            <div className="feature-icon blue">↥</div>
            <div>
              <strong>Upload Image</strong>
              <small>PNG, JPG, JPEG, WEBP</small>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon purple">✦</div>
            <div>
              <strong>AI Analysis</strong>
              <small>Powered by Gemini</small>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon blue">✦</div>
            <div>
              <strong>Get Meaning</strong>
              <small>Simple explanation</small>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN WORKSPACE */}
      <main className="workspace">

        {/* LEFT CARD */}
        <section className="panel upload-panel">

          <div className="panel-heading">
            <div className="panel-icon blue">↑</div>

            <div>
              <h2>Upload Image</h2>
              <p>Choose a sign-language gesture image.</p>
            </div>
          </div>

          {!preview ? (
            <label className="drop-zone">

              <div className="upload-cloud">↑</div>

              <h3>Upload your image</h3>

              <p>
                Click here to choose a sign-language image
              </p>

              <span className="choose-button">
                Choose Image
              </span>

              <small>
                PNG • JPG • JPEG • WEBP
              </small>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </label>
          ) : (
            <div className="image-preview-container">

              <div className="image-preview">
                <img
                  src={preview}
                  alt="Selected sign"
                />
              </div>

              <div className="file-info">
                <span>▧</span>
                <span>{image?.name}</span>

                <button
                  className="remove-button"
                  onClick={() => {
                    setImage(null);
                    setPreview(null);
                    setResult("");
                    setAnalyzedImageKey(null);
                  }}
                >
                  ×
                </button>
              </div>

            </div>
          )}

          <button
            className="analyze-button"
            onClick={analyzeImage}
            disabled={!image || loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                ✦ Analyze Sign
              </>
            )}
          </button>

          {preview && (
            <label className="change-image">
              ↻ Choose another image

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}

        </section>

        {/* RIGHT CARD */}
        <section className="panel result-panel">

          <div className="panel-heading result-heading">

            <div className="panel-icon purple">✦</div>

            <div>
              <h2>AI Interpretation</h2>
              <p>
                Results generated from your uploaded image.
              </p>
            </div>

            <div className="status">
              <span></span>
              {loading ? "Analyzing" : "Ready"}
            </div>

          </div>

          {!result ? (
            <div className="empty-result">

              <div className="empty-icon">✦</div>

              <h3>Waiting for an image</h3>

              <p>
                Upload a sign-language image and click
                <strong> Analyze Sign </strong>
                to see the AI interpretation.
              </p>

            </div>
          ) : (
            <div className="results">

              {/* POSSIBLE SIGN */}
              <div className="result-card primary-result">

                <div className="result-card-icon purple">
                  ▣
                </div>

                <div className="result-content">

                  <span className="result-label">
                    POSSIBLE SIGN
                  </span>

                  <h3>{possibleSign}</h3>

                </div>

              </div>

              {/* MEANING */}
              <div className="result-card">

                <div className="result-card-icon blue">
                  □
                </div>

                <div className="result-content">

                  <span className="result-label">
                    MEANING
                  </span>

                  <p>{meaning}</p>

                </div>

              </div>

              {/* COMMUNICATION */}
              <div className="result-card">

                <div className="result-card-icon purple">
                  ●
                </div>

                <div className="result-content">

                  <span className="result-label">
                    WHAT THE PERSON IS COMMUNICATING
                  </span>

                  <p>{communication}</p>

                </div>

              </div>

              {/* WARNING */}
              <div className="result-warning">

                <span>⚠</span>

                <p>
                  AI-generated interpretation. Sign meanings
                  can vary by sign language and context.
                </p>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer>
        Sign Image AI <span>•</span> AI-assisted sign-language
        image interpretation
      </footer>

    </div>
  );
}

export default App;