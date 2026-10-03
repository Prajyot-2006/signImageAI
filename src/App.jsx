import { useState } from "react";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="app">
      <h1>Sign Image AI</h1>

      <p>
        Upload a sign-language gesture image and let AI analyze its possible
        meaning.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      {preview && (
        <div className="preview">
          <img src={preview} alt="Selected sign" />

          <button>Analyze Sign</button>
        </div>
      )}
    </div>
  );
}

export default App;