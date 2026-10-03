import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");

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

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setResult(data.message);
  };

  return (
    <div className="app">
      <h1>Sign Image AI</h1>

      <p>
        Upload a sign-language gesture image and let AI analyze its
        possible meaning.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {preview && (
        <div className="preview">
          <img src={preview} alt="Selected sign" />

          <button onClick={analyzeImage}>
            Analyze Sign
          </button>

          {result && <p>{result}</p>}
        </div>
      )}
    </div>
  );
}

export default App;