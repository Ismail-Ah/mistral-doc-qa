import React, { useState } from "react";
import { uploadFile } from "../api";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    try {
      await uploadFile(file);
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}
