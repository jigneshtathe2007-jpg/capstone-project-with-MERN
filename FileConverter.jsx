import React, { useState } from "react";
import axios from "axios";
import "./converter.css";

function FileConverter() {

  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);

    const droppedFile = e.dataTransfer.files[0];
    setFile(droppedFile);
  };

  const convertFile = async () => {

    if (!file) {
      alert("Upload a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", format);

    try {

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/convert",
        formData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `converted.${format}`);

      document.body.appendChild(link);
      link.click();

      setLoading(false);

    } catch (err) {

      alert("Conversion failed");
      setLoading(false);

    }

  };

  return (

    <div className="page">

      <div className="glass-card">

        <h1>⚡ Smart File Converter</h1>

        <p>Drag & Drop your file below</p>

        <div
          className={drag ? "drop-zone drag" : "drop-zone"}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
        >

          {file ? file.name : "Drop file here or click to upload"}

          <input type="file" onChange={handleFile} />

        </div>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >

          <option value="pdf">Convert to PDF</option>
          <option value="txt">Convert to TXT</option>
          <option value="html">Convert to HTML</option>
          <option value="odt">Convert to ODT</option>

        </select>

        <button onClick={convertFile}>
          {loading ? "Converting..." : "Convert File"}
        </button>

      </div>

    </div>

  );

}

export default FileConverter;