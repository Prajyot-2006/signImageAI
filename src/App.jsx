import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult("");
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    const imageKey = `${image.name}-${image.size}-${image.lastModified}`;

    const cachedResult = localStorage.getItem(imageKey);

    if (cachedResult) {
      setResult(cachedResult);
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.result) {
        setResult(data.result);
        localStorage.setItem(imageKey, data.result);
      } else {
        setResult("Failed to analyze the image.");
      }
    } catch (error) {
      console.error(error);
      setResult("Failed to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  const possibleSign =
    result.match(
      /Possible Sign:\s*(.*?)(?=\s*Meaning:)/
    )?.[1] || "Unknown";

  const meaning =
    result.match(
      /Meaning:\s*(.*?)(?=\s*What the person is communicating:)/
    )?.[1] || "Not available";

  const communication =
    result.match(
      /What the person is communicating:\s*(.*)/i
    )?.[1] || "Not available";

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">
          <span>✦</span> Sign Image AI
        </div>

        <div className="header-badge">
          AI Powered
        </div>
      </header>

      {/* Main */}
      <main className="main">

        <section className="hero">
          <p className="eyebrow">SIGN LANGUAGE • AI VISION</p>

          <h1>
            Understand Sign Language
            <br />
            <span>Through Images</span>
          </h1>

          <p className="subtitle">
            Upload a sign-language gesture and let AI identify
            its possible meaning and what the person is communicating.
          </p>
        </section>

        {/* Two Column Layout */}
        <div className="workspace">

          {/* LEFT */}
          <section className="left-panel">

            <div className="panel-title">
              <div>
                <h2>Upload Image</h2>
                <p>Choose a sign-language gesture image.</p>
              </div>
            </div>

            {!preview ? (
              <label className="upload-box">

                <div className="upload-icon">
                  ↑
                </div>

                <h3>Drop your image here</h3>

                <p>
                  or choose an image from your computer
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
              <div className="selected-image">

                <div className="image-container">
                  <img
                    src={preview}
                    alt="Selected sign"
                  />
                </div>

                <div className="image-name">
                  {image?.name}
                </div>

                <button
                  className="analyze-button"
                  onClick={analyzeImage}
                  disabled={loading}
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

                <label className="change-image">
                  Choose another image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>

              </div>
            )}

          </section>

          {/* RIGHT */}
          <section className="right-panel">

            <div className="panel-title">
              <div>
                <h2>AI Interpretation</h2>
                <p>
                  Results generated from your uploaded image.
                </p>
              </div>
            </div>

            {!result && !loading && (
              <div className="empty-result">

                <div className="empty-icon">
                  ✦
                </div>

                <h3>Waiting for an image</h3>

                <p>
                  Upload a sign image and click
                  <strong> Analyze Sign </strong>
                  to see the AI interpretation.
                </p>

              </div>
            )}

            {loading && (
              <div className="empty-result">

                <div className="loading-circle">
                  ✦
                </div>

                <h3>Analyzing image...</h3>

                <p>
                  AI is analyzing the sign. Please wait.
                </p>

              </div>
            )}

            {result && !loading && (
              <div className="results">

                <div className="result-card highlight">
                  <span className="result-label">
                    POSSIBLE SIGN
                  </span>

                  <h3>{possibleSign}</h3>
                </div>

                <div className="result-card">
                  <span className="result-label">
                    MEANING
                  </span>

                  <p>{meaning}</p>
                </div>

                <div className="result-card">
                  <span className="result-label">
                    WHAT THE PERSON IS COMMUNICATING
                  </span>

                  <p>{communication}</p>
                </div>

                <div className="disclaimer">
                  ⚠️ AI-generated interpretation. Sign meanings
                  can vary by sign language and context.
                </div>

              </div>
            )}

          </section>

        </div>

      </main>

      <footer>
        Sign Image AI • AI-assisted sign-language image interpretation
      </footer>

    </div>
  );
}

export default App;